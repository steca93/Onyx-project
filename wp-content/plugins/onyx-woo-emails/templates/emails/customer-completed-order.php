<?php
/**
 * Customer completed order email
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
                Vaša porudžbina je isporučena!
            </h1>
            <p style="margin:0 0 20px 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#6B7280;line-height:1.6;">
                Nadamo se da ste zadovoljni vašom kupovinom.
            </p>
            <table align="center" cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td style="background-color:#F1F2F4;border-radius:6px;padding:8px 22px;">
                        <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#374151;">
                            Porudžbina <strong style="color:#12181C;">#<?php echo esc_html($order->get_order_number()); ?></strong>
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
        <td class="email-body" style="padding:28px 40px 0 40px;">
            <p style="margin:0 0 16px 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:bold;color:#9CA3AF;letter-spacing:1.5px;text-transform:uppercase;">
                PREGLED PORUDŽBINE
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
                   style="border-bottom:<?php echo $is_last ? '0' : '1px solid #F3F4F6'; ?>;padding-bottom:<?php echo $is_last ? '0' : '16px'; ?>;margin-bottom:<?php echo $is_last ? '0' : '16px'; ?>;">
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
                            Količina: <?php echo esc_html($item->get_quantity()); ?>
                        </p>
                    </td>
                    <td width="100" valign="middle" style="text-align:right;">
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

<!-- ═══ TOTAL ════════════════════════════════════════════════════════════════ -->
<table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
        <td style="padding:20px 40px 28px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F8F9FA;border-radius:8px;">
                <tr>
                    <td style="padding:20px 24px;">
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:10px;">
                            <tr>
                                <td style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#6B7280;">Dostava</td>
                                <td style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#374151;text-align:right;">
                                    <?php echo $order->get_shipping_total() > 0
                                        ? wp_kses_post(wc_price($order->get_shipping_total()))
                                        : '<span style="color:#0E3547;font-weight:bold;">Besplatna</span>'; ?>
                                </td>
                            </tr>
                        </table>
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid #E5E7EB;">
                            <tr>
                                <td style="font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;color:#12181C;padding-top:14px;">Ukupno</td>
                                <td style="font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:bold;color:#12181C;text-align:right;padding-top:14px;">
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

<!-- ═══ CTA ══════════════════════════════════════════════════════════════════ -->
<table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
        <td align="center" style="padding:28px 40px 32px 40px;">
            <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td align="center" style="border-radius:4px;background-color:#0D1013;">
                        <a href="<?php echo onyx_frontend_url('/'); ?>"
                           style="display:inline-block;padding:14px 36px;background-color:#0D1013;color:#FFFFFF;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;border-radius:4px;">
                            NASTAVITE KUPOVINU
                        </a>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

<?php do_action('woocommerce_email_footer', $email); ?>
