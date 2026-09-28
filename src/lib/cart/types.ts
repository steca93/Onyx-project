import type { ProductImage } from "@/lib/repo/types";

/**
 * `name` is the raw WooCommerce attribute name/slug (what the Store API's
 * add-item call needs in its `variation` array) — `label` is what's shown
 * on screen. They're the same string in mock data, but genuinely differ
 * live (e.g. `name: "sirina"` vs `label: "Širina"`), so both are kept.
 */
interface CartLineAttribute {
  name: string;
  label: string;
  value: string;
}

export interface CartLineItem {
  /** Mock mode: `${productId}:${variationId ?? "-"}`. Live mode: WC's own
   * cart item `key` (its native unique cart-line identifier). */
  key: string;
  productId: string;
  variationId: string | null;
  slug: string;
  name: string;
  image: ProductImage | null;
  /** Raw Woo-style price string, e.g. "142900". Format with formatPrice(). */
  price: string;
  quantity: number;
  attributes?: CartLineAttribute[];
}

export interface AddToCartInput {
  productId: string;
  variationId: string | null;
  slug: string;
  name: string;
  image: ProductImage | null;
  price: string;
  attributes?: CartLineAttribute[];
  /** WooCommerce's real numeric post ID — required by the Store API's
   * add-item call (`id`), unused in mock mode. For a variation, this is the
   * variation's own numeric ID (WooCommerce has no separate "variation ID"
   * field on cart lines — the variation IS just a product with its own ID). */
  databaseId?: number;
}
