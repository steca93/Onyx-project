<?php
/**
 * Customer cancelled order email
 *
 * @var WC_Order $order
 * @var string   $email_heading
 * @var WC_Email $email
 */
defined('ABSPATH') || exit;

do_action('woocommerce_email_header', $email_heading, $email);
?>

<!-- ===== HERO: Red cancellation panel ===== -->
<table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
        <td align="center" style="background-color:#FEE2E2;padding:30px 40px;">

            <p style="margin:0 0 12px 0;padding:0;font-family:Arial,Helvetica,sans-serif;font-size:48px;line-height:1;">
                &#10060;
            </p>
            <h2 style="margin:0 0 8px 0;padding:0;font-family:Arial,Helvetica,sans-serif;font-size:22px;font-weight:bold;color:#12181C;line-height:1.3;">
                Vaša porudžbina je otkazana
            </h2>
            <p style="margin:0 0 15px 0;padding:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#374151;line-height:1.6;">
                Žao nam je što je vaša porudžbina otkazana.
            </p>

            <!-- Order number badge -->
            <table align="center" cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td style="background-color:#FFFFFF;border-radius:4px;padding:8px 20px;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#374151;">
                        Porudžbina: <strong>#<?php echo esc_html($order->get_order_number()); ?></strong>
                    </td>
                </tr>
            </table>

        </td>
    </tr>
</table>

<!-- ===== CONTACT BOX ===== -->
<table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
        <td style="padding:30px 40px 15px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0"
                   style="background-color:#F1F5FD;border-radius:6px;">
                <tr>
                    <td style="padding:20px;">
                        <p style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#374151;line-height:1.6;">
                            Ako mislite da je ovo greška, kontaktirajte nas na
                            <a href="mailto:<?php echo esc_attr(get_option('admin_email')); ?>"
                               style="color:#0E3547;text-decoration:none;font-weight:bold;">
                                <?php echo esc_html(get_option('admin_email')); ?>
                            </a>.
                        </p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

<!-- ===== ORDER SUMMARY (brief) ===== -->
<table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
        <td style="padding:15px 40px 0 40px;">
            <h3 style="margin:0;padding:0 0 10px 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:bold;color:#12181C;letter-spacing:1px;text-transform:uppercase;border-bottom:2px solid #E5E7EB;">
                OTKAZANA PORUDŽBINA
            </h3>
        </td>
    </tr>
    <tr>
        <td style="padding:0 40px 20px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">

                <tr style="background-color:#F8F8F6;">
                    <td style="font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;color:#374151;padding:10px 15px;text-align:left;">Proizvod</td>
                    <td style="font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;color:#374151;padding:10px 15px;text-align:right;">Cena</td>
                </tr>

                <?php foreach ($order->get_items() as $item_id => $item) : ?>
                <tr>
                    <td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#6B7280;padding:10px 15px;border-bottom:1px solid #F3F4F6;line-height:1.4;">
                        <?php echo esc_html($item->get_name()); ?> &times; <?php echo esc_html($item->get_quantity()); ?>
                    </td>
                    <td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#6B7280;padding:10px 15px;text-align:right;border-bottom:1px solid #F3F4F6;">
                        <?php echo wp_kses_post($order->get_formatted_line_subtotal($item)); ?>
                    </td>
                </tr>
                <?php endforeach; ?>

                <!-- Total -->
                <tr>
                    <td style="font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;color:#12181C;padding:12px 15px;text-align:right;border-top:2px solid #0D1013;">
                        Ukupno:
                    </td>
                    <td style="font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;color:#12181C;padding:12px 15px;text-align:right;border-top:2px solid #0D1013;">
                        <?php echo wp_kses_post($order->get_formatted_order_total()); ?>
                    </td>
                </tr>

            </table>
        </td>
    </tr>
</table>

<!-- ===== CTA BUTTON ===== -->
<table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
        <td align="center" style="padding:20px 40px 30px 40px;">
            <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td align="center" style="border-radius:4px;background-color:#0D1013;">
                        <a href="<?php echo onyx_frontend_url('/'); ?>"
                           style="display:inline-block;background-color:#0D1013;color:#FFFFFF;padding:14px 40px;border-radius:4px;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-weight:bold;font-size:13px;letter-spacing:1.5px;text-transform:uppercase;">
                            NASTAVITE KUPOVINU
                        </a>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

<?php do_action('woocommerce_email_footer', $email); ?>
