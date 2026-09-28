<?php
/**
 * Plugin Name: ONYX Frontend Revalidation
 * Description: Tells the Next.js storefront to refresh its cached catalog data when products, stock, prices, categories or menus change.
 * Version:     1.0.0
 * Author:      ONYX EVOLUTION
 *
 * Must-use plugin: copy this file to wp-content/mu-plugins/ (see
 * wp-backend/README.md). Requires in wp-config.php:
 *
 *   define( 'ONYX_FRONTEND_URL', 'https://onyx.com' );          // no trailing slash
 *   define( 'ONYX_REVALIDATE_SECRET', '…same as REVALIDATE_SECRET on Vercel…' );
 *
 * Design:
 * - Events are only *queued* while WordPress handles the request; one
 *   deduplicated batch is sent on `shutdown`, so a bulk edit of 50 products
 *   costs 50 small requests at the very end, not one per saved meta field.
 * - Requests are non-blocking (`'blocking' => false`, 2 s timeout): admin
 *   saves never wait on, or fail because of, the frontend.
 */

defined( 'ABSPATH' ) || exit;

final class Onyx_Revalidate {

	/** @var array<string, array> Pending payloads keyed by a dedupe key. */
	private static $queue = array();

	public static function init() {
		if ( ! defined( 'ONYX_FRONTEND_URL' ) || ! defined( 'ONYX_REVALIDATE_SECRET' ) ) {
			return; // Not configured — do nothing rather than error.
		}

		// Products: create / update (covers title, description, price, images, categories, status).
		add_action( 'woocommerce_new_product', array( __CLASS__, 'product_id' ), 10, 1 );
		add_action( 'woocommerce_update_product', array( __CLASS__, 'product_id' ), 10, 1 );

		// Variations: map to the parent product.
		add_action( 'woocommerce_new_product_variation', array( __CLASS__, 'variation_id' ), 10, 1 );
		add_action( 'woocommerce_update_product_variation', array( __CLASS__, 'variation_id' ), 10, 1 );

		// Stock quantity / stock status changes (incl. those caused by orders).
		add_action( 'woocommerce_product_set_stock', array( __CLASS__, 'product_object' ), 10, 1 );
		add_action( 'woocommerce_variation_set_stock', array( __CLASS__, 'product_object' ), 10, 1 );
		add_action( 'woocommerce_product_set_stock_status', array( __CLASS__, 'product_id' ), 10, 1 );
		add_action( 'woocommerce_variation_set_stock_status', array( __CLASS__, 'variation_id' ), 10, 1 );

		// Scheduled sale prices starting/ending (run by WP cron).
		add_action( 'wc_after_products_starting_sales', array( __CLASS__, 'product_ids' ), 10, 1 );
		add_action( 'wc_after_products_ending_sales', array( __CLASS__, 'product_ids' ), 10, 1 );

		// Slug changes: also expire the old slug's cached page.
		add_action( 'post_updated', array( __CLASS__, 'slug_change' ), 10, 3 );

		// Trash / restore / delete.
		add_action( 'wp_trash_post', array( __CLASS__, 'post_id' ), 10, 1 );
		add_action( 'untrashed_post', array( __CLASS__, 'post_id' ), 10, 1 );
		add_action( 'before_delete_post', array( __CLASS__, 'post_id' ), 10, 1 );

		// Product categories.
		add_action( 'created_product_cat', array( __CLASS__, 'category_term' ), 10, 1 );
		add_action( 'edited_product_cat', array( __CLASS__, 'category_term' ), 10, 1 );
		add_action( 'pre_delete_term', array( __CLASS__, 'category_pre_delete' ), 10, 2 );

		// Menus.
		add_action( 'wp_update_nav_menu', array( __CLASS__, 'menu' ), 10, 0 );

		add_action( 'shutdown', array( __CLASS__, 'flush' ) );
	}

	/* ---------- hook adapters ---------- */

	public static function product_id( $product_id ) {
		$product = wc_get_product( $product_id );
		if ( $product ) {
			self::queue_product( $product );
		}
	}

	public static function product_ids( $ids ) {
		foreach ( (array) $ids as $id ) {
			self::product_id( $id );
		}
	}

	public static function product_object( $product ) {
		if ( $product instanceof WC_Product ) {
			self::queue_product( $product );
		}
	}

	public static function variation_id( $variation_id ) {
		$variation = wc_get_product( $variation_id );
		if ( $variation && $variation->get_parent_id() ) {
			self::product_id( $variation->get_parent_id() );
		}
	}

	public static function post_id( $post_id ) {
		$type = get_post_type( $post_id );
		if ( 'product' === $type ) {
			self::product_id( $post_id );
		} elseif ( 'product_variation' === $type ) {
			self::variation_id( $post_id );
		}
	}

	public static function slug_change( $post_id, $after, $before ) {
		if ( 'product' !== $after->post_type || $after->post_name === $before->post_name || '' === $before->post_name ) {
			return;
		}
		self::enqueue( 'product:' . $before->post_name, array( 'type' => 'product', 'slug' => $before->post_name ) );
	}

	public static function category_term( $term_id ) {
		$term = get_term( $term_id, 'product_cat' );
		if ( $term && ! is_wp_error( $term ) ) {
			self::enqueue( 'category:' . $term->slug, array( 'type' => 'category', 'slug' => $term->slug ) );
		}
	}

	public static function category_pre_delete( $term_id, $taxonomy ) {
		if ( 'product_cat' === $taxonomy ) {
			self::category_term( $term_id ); // Capture the slug before the term is gone.
		}
	}

	public static function menu() {
		self::enqueue( 'menu', array( 'type' => 'menu' ) );
	}

	/* ---------- queue + send ---------- */

	private static function queue_product( WC_Product $product ) {
		if ( $product->is_type( 'variation' ) ) {
			self::product_id( $product->get_parent_id() );
			return;
		}
		$slug = $product->get_slug();
		if ( '' === $slug ) {
			return; // Auto-draft without a slug yet.
		}
		$categories = array();
		foreach ( $product->get_category_ids() as $cat_id ) {
			$term = get_term( $cat_id, 'product_cat' );
			if ( $term && ! is_wp_error( $term ) ) {
				$categories[] = $term->slug;
			}
		}
		self::enqueue(
			'product:' . $slug,
			array(
				'type'       => 'product',
				'slug'       => $slug,
				'categories' => array_values( array_unique( $categories ) ),
			)
		);
	}

	private static function enqueue( $key, array $payload ) {
		// Later events for the same key win (e.g. categories changed in the same save).
		self::$queue[ $key ] = $payload;
	}

	public static function flush() {
		if ( empty( self::$queue ) ) {
			return;
		}
		$endpoint = rtrim( ONYX_FRONTEND_URL, '/' ) . '/api/revalidate';
		foreach ( self::$queue as $payload ) {
			wp_remote_post(
				$endpoint,
				array(
					'blocking' => false,
					'timeout'  => 2,
					'headers'  => array(
						'Content-Type'  => 'application/json',
						'Authorization' => 'Bearer ' . ONYX_REVALIDATE_SECRET,
					),
					'body'     => wp_json_encode( $payload ),
				)
			);
		}
		self::$queue = array();
	}
}

add_action( 'plugins_loaded', array( 'Onyx_Revalidate', 'init' ) );
