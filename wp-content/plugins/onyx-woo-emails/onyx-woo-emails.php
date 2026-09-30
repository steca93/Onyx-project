<?php
/**
 * Plugin Name: ONYX WooCommerce Emails
 * Description: Branded email templates for ONYX EVOLUTION WooCommerce orders, in Serbian.
 * Version: 1.0.1
 * Author: ONYX EVOLUTION
 */

if (!defined('ABSPATH')) exit;

// ── Frontend URL helper ───────────────────────────────────────────────────────

/**
 * Returns the Next.js frontend URL with optional path.
 * Reads from the onyx_frontend_url option; defaults to localhost:3000.
 */
function onyx_frontend_url(string $path = ''): string {
    $base = rtrim(get_option('onyx_frontend_url', 'http://localhost:3000'), '/');
    if ($path) {
        $path = '/' . ltrim($path, '/');
    }
    return esc_url($base . $path);
}

// ── Template override ─────────────────────────────────────────────────────────

add_filter('woocommerce_locate_template', 'onyx_custom_email_templates', 10, 3);
function onyx_custom_email_templates($template, $template_name, $template_path) {
    $custom_path = plugin_dir_path(__FILE__) . 'templates/';
    if (file_exists($custom_path . $template_name)) {
        return $custom_path . $template_name;
    }
    return $template;
}

// ── Email subjects ────────────────────────────────────────────────────────────
// Only for the statuses this plugin ships a template for — see README.md for
// why customer_new_account / customer_reset_password / customer_failed_order
// are deliberately not included yet.

add_filter('woocommerce_email_subject_customer_processing_order',
    function($subject, $order) {
        return 'Vaša porudžbina #' . $order->get_order_number() . ' je primljena — ONYX Evolution';
    }, 10, 2);

add_filter('woocommerce_email_subject_customer_completed_order',
    function($subject, $order) {
        return 'Vaša porudžbina #' . $order->get_order_number() . ' je isporučena — ONYX Evolution';
    }, 10, 2);

add_filter('woocommerce_email_subject_customer_on_hold_order',
    function($subject, $order) {
        return 'Porudžbina #' . $order->get_order_number() . ' — čekamo potvrdu plaćanja';
    }, 10, 2);

add_filter('woocommerce_email_subject_customer_cancelled_order',
    function($subject, $order) {
        return 'Porudžbina #' . $order->get_order_number() . ' je otkazana';
    }, 10, 2);

// ── Remove "Process your orders on the go" WooCommerce app promo ─────────────

add_filter('woocommerce_email_footer_text', '__return_empty_string');

// Remove WooCommerce "additional content" appended to each email type
$onyx_email_ids = [
    'new_order',
    'cancelled_order',
    'customer_processing_order',
    'customer_completed_order',
    'customer_on_hold_order',
    'customer_cancelled_order',
];
foreach ($onyx_email_ids as $id) {
    add_filter("woocommerce_email_additional_content_{$id}", '__return_empty_string');
}

// ── From name and address ─────────────────────────────────────────────────────

add_filter('woocommerce_email_from_name', function($name) {
    return 'ONYX Evolution';
});

add_filter('woocommerce_email_from_address', function($email) {
    return get_option('admin_email');
});

// ── Send order emails after checkout, not during it ──────────────────────────

// By default WooCommerce sends the customer + admin emails inside the
// checkout request, so the storefront's "confirm order" call waits on the
// mail server. Deferred, they are queued and sent at the end of the request.
add_filter('woocommerce_defer_transactional_emails', '__return_true');

// ── Admin settings page ───────────────────────────────────────────────────────

add_action('admin_menu', function() {
    add_submenu_page(
        'woocommerce',
        'Email Templates',
        'Email Templates',
        'manage_options',
        'onyx-email-settings',
        'onyx_render_email_settings_page'
    );
});

function onyx_render_email_settings_page() {
    // Save settings
    if (isset($_POST['onyx_save_settings']) && check_admin_referer('onyx_email_settings')) {
        update_option('onyx_frontend_url', sanitize_url($_POST['onyx_frontend_url'] ?? ''));
        update_option('onyx_bank_name',    sanitize_text_field($_POST['onyx_bank_name'] ?? ''));
        update_option('onyx_bank_account', sanitize_text_field($_POST['onyx_bank_account'] ?? ''));
        echo '<div class="notice notice-success"><p>Podešavanja su sačuvana.</p></div>';
    }

    // Send test email
    $send_result = null;
    if (isset($_POST['send_test']) && check_admin_referer('onyx_email_settings')) {
        $order_id   = intval($_POST['order_id'] ?? 0);
        $email_type = sanitize_text_field($_POST['email_type'] ?? '');
        $send_to    = sanitize_email($_POST['send_to'] ?? '');
        $order      = wc_get_order($order_id);
        if ($order && $email_type && $send_to) {
            $mailer = WC()->mailer();
            $emails = $mailer->get_emails();
            if (isset($emails[$email_type])) {
                $email            = $emails[$email_type];
                $email->recipient = $send_to;
                $email->trigger($order->get_id(), $order);
                $send_result = 'sent';
            } else {
                $send_result = 'error';
            }
        }
    }

    $orders = wc_get_orders(['limit' => 10, 'orderby' => 'date', 'order' => 'DESC']);
    ?>
    <div class="wrap">
        <h1>ONYX Email Templates</h1>

        <form method="post">
            <?php wp_nonce_field('onyx_email_settings'); ?>

            <h2>Opšta podešavanja</h2>
            <table class="form-table">
                <tr>
                    <th scope="row"><label for="onyx_frontend_url">URL frontend sajta (Next.js)</label></th>
                    <td>
                        <input type="url" id="onyx_frontend_url" name="onyx_frontend_url"
                               value="<?php echo esc_attr(get_option('onyx_frontend_url', 'http://localhost:3000')); ?>"
                               class="regular-text" />
                        <p class="description">Npr. https://onyxevolution.rs — koristi se u linkovima u emailovima</p>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="onyx_bank_name">Naziv banke (za uplatu na račun)</label></th>
                    <td>
                        <input type="text" id="onyx_bank_name" name="onyx_bank_name"
                               value="<?php echo esc_attr(get_option('onyx_bank_name', '')); ?>"
                               class="regular-text" />
                        <p class="description">Koristi se samo u emailu za porudžbine na čekanju sa uplatom na račun — trenutno se ne koristi u checkout-u.</p>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="onyx_bank_account">Broj računa</label></th>
                    <td>
                        <input type="text" id="onyx_bank_account" name="onyx_bank_account"
                               value="<?php echo esc_attr(get_option('onyx_bank_account', '')); ?>"
                               class="regular-text" />
                    </td>
                </tr>
            </table>

            <p><input type="submit" name="onyx_save_settings" class="button button-primary" value="Sačuvaj podešavanja" /></p>

            <hr>
            <h2>Pošalji test email</h2>
            <p class="description">
                Koristi ovo da proveriš da li WordPress uopšte uspeva da pošalje mejl (nezavisno od izgleda) —
                ako test email ne stigne (proveri i spam), problem je u slanju (SMTP), ne u ovom pluginu.
            </p>
            <?php if ($send_result === 'sent'): ?>
                <div class="notice notice-success"><p>Test email je poslat. Proveri inbox (i spam folder).</p></div>
            <?php elseif ($send_result === 'error'): ?>
                <div class="notice notice-error"><p>Greška pri slanju. Proveri parametre.</p></div>
            <?php endif; ?>
            <table class="form-table">
                <tr>
                    <th>Porudžbina</th>
                    <td>
                        <select name="order_id">
                            <?php foreach ($orders as $order): ?>
                                <option value="<?php echo esc_attr($order->get_id()); ?>">
                                    #<?php echo esc_html($order->get_order_number()); ?> —
                                    <?php echo esc_html($order->get_billing_first_name() . ' ' . $order->get_billing_last_name()); ?>
                                    (<?php echo wp_kses_post(wc_price($order->get_total())); ?>)
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </td>
                </tr>
                <tr>
                    <th>Tip emaila</th>
                    <td>
                        <select name="email_type">
                            <option value="customer_processing_order">Porudžbina primljena (Processing)</option>
                            <option value="customer_completed_order">Isporučena (Completed)</option>
                            <option value="customer_on_hold_order">Čeka plaćanje (On Hold)</option>
                            <option value="customer_cancelled_order">Otkazana (Cancelled)</option>
                            <option value="new_order">Nova porudžbina (Admin)</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <th>Pošalji na</th>
                    <td>
                        <input type="email" name="send_to" value="<?php echo esc_attr(get_option('admin_email')); ?>" class="regular-text" />
                    </td>
                </tr>
            </table>
            <p><input type="submit" name="send_test" class="button button-secondary" value="Pošalji test email" /></p>
        </form>
    </div>
    <?php
}
