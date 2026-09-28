<?php
/**
 * Admin new order notification email
 *
 * @var WC_Order $order
 * @var string   $email_heading
 * @var WC_Email $email
 */
defined('ABSPATH') || exit;

do_action('woocommerce_email_header', $email_heading, $email);
?>

<!-- ═══ HERO ═══════════════════════════════════════════════════════════════ -->
<table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
        <td class="email-body" style="padding:36px 40px 28px 40px;text-align:center;">
            <h1 style="margin:0 0 8px 0;font-family:Arial,Helvetica,sans-serif;font-size:24px;font-weight:bold;color:#12181C;line-height:1.3;">
                Nova porudžbina
            </h1>
            <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin-top:14px;">
                <tr>
                    <td style="background-color:#F1F2F4;border-radius:6px;padding:8px 22px;">
                        <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#374151;">
                            <strong style="color:#12181C;">#<?php echo esc_html($order->get_order_number()); ?></strong>
                            &nbsp;·&nbsp;
                            <span style="color:#6B7280;"><?php echo date_i18n('d.m.Y H:i', strtotime($order->get_date_created())); ?></span>
                        </p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

<table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr><td style="height:1px;background-color:#F1F2F4;font-size:0;"></td></tr>
</table>

<!-- ═══ CUSTOMER INFO ════════════════════════════════════════════════════════ -->
<table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
        <td class="email-body" style="padding:24px 40px;">
            <p style="margin:0 0 12px 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:bold;color:#9CA3AF;letter-spacing:1.5px;text-transform:uppercase;">
                KUPAC
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" border="0"
                   style="background-color:#F8F9FA;border-radius:8px;">
                <tr>
                    <td style="padding:16px 20px;">
                        <p style="margin:0 0 4px 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;color:#12181C;">
                            <?php echo esc_html($order->get_billing_first_name() . ' ' . $order->get_billing_last_name()); ?>
                        </p>
                        <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#6B7280;line-height:1.6;">
                            <a href="mailto:<?php echo esc_attr($order->get_billing_email()); ?>"
                               style="color:#0E3547;text-decoration:none;">
                                <?php echo esc_html($order->get_billing_email()); ?>
                            </a>
                            <?php if ($order->get_billing_phone()): ?>
                            &nbsp;·&nbsp; <?php echo esc_html($order->get_billing_phone()); ?>
                            <?php endif; ?>
                        </p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

<table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr><td style="height:1px;background-color:#F1F2F4;font-size:0;"></td></tr>
</table>

<!-- ═══ ORDER ITEMS ══════════════════════════════════════════════════════════ -->
<table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
        <td class="email-body" style="padding:24px 40px 0 40px;">
            <p style="margin:0 0 16px 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:bold;color:#9CA3AF;letter-spacing:1.5px;text-transform:uppercase;">
                NARUČENI PROIZVODI
            </p>
        </td>
    </tr>
    <tr>
        <td class="email-body" style="padding:0 40px;">
            <?php
            $items      = $order->get_items();
            $item_count = count($items);
            $i          = 0;
            foreach ($items as $item_id => $item) :
                $i++;
                $product   = $item->get_product();
                $image_url = '';
                if ($product) {
                    $img_id    = $product->get_image_id();
                    $image_url = $img_id
                        ? wp_get_attachment_image_url($img_id, 'woocommerce_thumbnail')
                        : wc_placeholder_img_src('woocommerce_thumbnail');
                }
                $is_last = ($i === $item_count);
            ?>
            <table width="100%" cellpadding="0" cellspacing="0" border="0"
                   style="margin-bottom:<?php echo $is_last ? '0' : '16px'; ?>;padding-bottom:<?php echo $is_last ? '0' : '16px'; ?>;border-bottom:<?php echo $is_last ? 'none' : '1px solid #F3F4F6'; ?>;">
                <tr>
                    <td width="64" valign="top" style="padding-right:16px;">
                        <?php if ($image_url) : ?>
                        <img src="<?php echo esc_url($image_url); ?>" width="64" height="64"
                             alt="<?php echo esc_attr($item->get_name()); ?>"
                             class="product-img"
                             style="width:64px;height:64px;border-radius:4px;border:1px solid #F3F4F6;display:block;" />
                        <?php else : ?>
                        <table width="64" cellpadding="0" cellspacing="0" border="0"><tr>
                            <td width="64" height="64" style="width:64px;height:64px;background-color:#F3F4F6;border-radius:4px;text-align:center;vertical-align:middle;">
                                <p style="margin:0;font-size:24px;line-height:64px;">&#9968;</p>
                            </td>
                        </tr></table>
                        <?php endif; ?>
                    </td>
                    <td valign="middle">
                        <p style="margin:0 0 4px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;color:#12181C;line-height:1.4;">
                            <?php echo esc_html($item->get_name()); ?>
                        </p>
                        <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#9CA3AF;">
                            Kol: <?php echo esc_html($item->get_quantity()); ?>
                            <?php if ($product && $product->get_sku()): ?>
                            &nbsp;·&nbsp; SKU: <?php echo esc_html($product->get_sku()); ?>
                            <?php endif; ?>
                        </p>
                    </td>
                    <td width="90" valign="middle" style="text-align:right;">
                        <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;color:#12181C;">
                            <?php echo wp_kses_post($order->get_formatted_line_subtotal($item)); ?>
                        </p>
                    </td>
                </tr>
            </table>
            <?php endforeach; ?>
        </td>
    </tr>
</table>

<!-- ═══ TOTALS ═══════════════════════════════════════════════════════════════ -->
<table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
        <td class="email-body" style="padding:20px 40px 24px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0"
                   style="background-color:#F8F9FA;border-radius:8px;">
                <tr>
                    <td style="padding:18px 22px;">
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:10px;">
                            <tr>
                                <td style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#6B7280;">Međuzbir</td>
                                <td style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#374151;text-align:right;"><?php echo wp_kses_post(wc_price($order->get_subtotal())); ?></td>
                            </tr>
                        </table>
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:12px;">
                            <tr>
                                <td style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#6B7280;">Dostava</td>
                                <td style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#374151;text-align:right;">
                                    <?php echo $order->get_shipping_total() > 0
                                        ? wp_kses_post(wc_price($order->get_shipping_total()))
                                        : 'Besplatna'; ?>
                                </td>
                            </tr>
                        </table>
                        <table width="100%" cellpadding="0" cellspacing="0" border="0"
                               style="border-top:1px solid #E5E7EB;">
                            <tr>
                                <td style="font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;color:#12181C;padding-top:12px;">Ukupno</td>
                                <td style="font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:bold;color:#12181C;text-align:right;padding-top:12px;">
                                    <?php echo wp_kses_post($order->get_formatted_order_total()); ?>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

<table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr><td style="height:1px;background-color:#F1F2F4;font-size:0;"></td></tr>
</table>

<!-- ═══ DELIVERY + PAYMENT ══════════════════════════════════════════════════ -->
<table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
        <td class="email-body" style="padding:24px 40px 28px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td class="two-col-left" width="48%" valign="top" style="padding-right:12px;">
                        <p style="margin:0 0 8px 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:bold;color:#9CA3AF;letter-spacing:1.5px;text-transform:uppercase;">DOSTAVA</p>
                        <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#374151;line-height:1.8;">
                            <strong style="color:#12181C;"><?php echo esc_html(trim($order->get_shipping_first_name() . ' ' . $order->get_shipping_last_name())); ?></strong><br>
                            <?php echo esc_html($order->get_shipping_address_1()); ?><br>
                            <?php if ($order->get_shipping_address_2()): echo esc_html($order->get_shipping_address_2()) . '<br>'; endif; ?>
                            <?php echo esc_html($order->get_shipping_city() . ' ' . $order->get_shipping_postcode()); ?>
                        </p>
                    </td>
                    <td class="two-col-div" width="4%" style="border-left:1px solid #F1F2F4;"></td>
                    <td class="two-col-right" width="48%" valign="top" style="padding-left:12px;">
                        <p style="margin:0 0 8px 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:bold;color:#9CA3AF;letter-spacing:1.5px;text-transform:uppercase;">PLAĆANJE</p>
                        <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;color:#12181C;">
                            <?php echo esc_html($order->get_payment_method_title()); ?>
                        </p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

<!-- ═══ CTA ══════════════════════════════════════════════════════════════════ -->
<table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
        <td align="center" style="padding:0 40px 32px 40px;">
            <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td align="center" style="border-radius:4px;background-color:#0D1013;">
                        <a href="<?php echo esc_url($order->get_edit_order_url()); ?>"
                           style="display:inline-block;padding:14px 36px;background-color:#0D1013;color:#FFFFFF;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;border-radius:4px;">
                            POGLEDAJ U WP-ADMIN
                        </a>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

<?php do_action('woocommerce_email_footer', $email); ?>
