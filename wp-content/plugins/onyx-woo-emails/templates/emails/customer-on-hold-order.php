<?php
/**
 * Customer on-hold order email
 * Sent when an order is awaiting payment confirmation (e.g. bank transfer,
 * or manually held for review) — not currently reachable via COD, but WC
 * core can still transition any order into this status.
 *
 * @var WC_Order $order
 * @var string   $email_heading
 * @var WC_Email $email
 */
defined('ABSPATH') || exit;

do_action('woocommerce_email_header', $email_heading, $email);
?>

<!-- ===== HERO: Amber/yellow awaiting panel ===== -->
<table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
        <td align="center" style="background-color:#FEF3C7;padding:30px 40px;">

            <p style="margin:0 0 12px 0;padding:0;font-family:Arial,Helvetica,sans-serif;font-size:48px;line-height:1;">
                &#9203;
            </p>
            <h2 style="margin:0 0 8px 0;padding:0;font-family:Arial,Helvetica,sans-serif;font-size:22px;font-weight:bold;color:#12181C;line-height:1.3;">
                Porudžbina primljena — čekamo potvrdu plaćanja
            </h2>

            <!-- Order number badge -->
            <table align="center" cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td style="background-color:#FFFFFF;border-radius:4px;padding:8px 20px;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#374151;">
                        Broj porudžbine: <strong>#<?php echo esc_html($order->get_order_number()); ?></strong>
                    </td>
                </tr>
            </table>

        </td>
    </tr>
</table>

<!-- ===== PAYMENT INSTRUCTIONS ===== -->
<table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
        <td style="padding:30px 40px;">

            <?php if ($order->get_payment_method() === 'bacs') : ?>

                <p style="margin:0 0 15px 0;padding:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#374151;line-height:1.6;">
                    Molimo vas da izvršite uplatu na sledeći račun:
                </p>

                <!-- Bank details box -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0"
                       style="border:1px solid #D1D5DB;border-radius:6px;background-color:#F9FAFB;">
                    <tr>
                        <td style="padding:4px 20px;">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#6B7280;padding:8px 0;width:45%;border-bottom:1px solid #E5E7EB;">
                                        Naziv banke:
                                    </td>
                                    <td style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#1a1a1a;font-weight:bold;padding:8px 0;border-bottom:1px solid #E5E7EB;">
                                        <?php echo esc_html(get_option('onyx_bank_name', '[Naziv banke]')); ?>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#6B7280;padding:8px 0;border-bottom:1px solid #E5E7EB;">
                                        Broj računa:
                                    </td>
                                    <td style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#1a1a1a;font-weight:bold;padding:8px 0;border-bottom:1px solid #E5E7EB;">
                                        <?php echo esc_html(get_option('onyx_bank_account', '[Broj računa]')); ?>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#6B7280;padding:8px 0;border-bottom:1px solid #E5E7EB;">
                                        Iznos:
                                    </td>
                                    <td style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#12181C;font-weight:bold;padding:8px 0;border-bottom:1px solid #E5E7EB;">
                                        <?php echo wp_kses_post($order->get_formatted_order_total()); ?>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#6B7280;padding:8px 0;">
                                        Poziv na broj:
                                    </td>
                                    <td style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#1a1a1a;font-weight:bold;padding:8px 0;">
                                        #<?php echo esc_html($order->get_order_number()); ?>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>

                <p style="margin:15px 0 0 0;padding:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#6B7280;font-style:italic;line-height:1.6;">
                    Porudžbina će biti prosleđena čim primimo potvrdu uplate.
                </p>

            <?php elseif ($order->get_payment_method() === 'cod') : ?>

                <p style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#374151;line-height:1.6;">
                    Platićete gotovinom kuriru kada paket stigne na vašu adresu.
                </p>

            <?php else : ?>

                <p style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#374151;line-height:1.6;">
                    Porudžbina čeka potvrdu plaćanja. Kontaktiraćemo vas uskoro.
                </p>

            <?php endif; ?>

        </td>
    </tr>
</table>

<!-- ===== ORDER SUMMARY ===== -->
<table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
        <td style="padding:0 40px 0 40px;">
            <h3 style="margin:0;padding:0 0 10px 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:bold;color:#12181C;letter-spacing:1px;text-transform:uppercase;border-bottom:2px solid #E5E7EB;">
                PREGLED PORUDŽBINE
            </h3>
        </td>
    </tr>
    <tr>
        <td style="padding:0 40px 30px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">

                <tr style="background-color:#F8F8F6;">
                    <td style="font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;color:#374151;padding:10px 15px;text-align:left;">Proizvod</td>
                    <td style="font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;color:#374151;padding:10px 15px;text-align:center;">Kol.</td>
                    <td style="font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;color:#374151;padding:10px 15px;text-align:right;">Cena</td>
                </tr>

                <?php
                $i = 0;
                foreach ($order->get_items() as $item_id => $item) :
                    $row_bg = ($i % 2 === 0) ? '#FFFFFF' : '#FAFAFA';
                    $i++;
                ?>
                <tr style="background-color:<?php echo $row_bg; ?>;">
                    <td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1a1a1a;padding:12px 15px;line-height:1.4;">
                        <strong><?php echo esc_html($item->get_name()); ?></strong>
                    </td>
                    <td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#374151;padding:12px 15px;text-align:center;">
                        <?php echo esc_html($item->get_quantity()); ?>
                    </td>
                    <td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1a1a1a;padding:12px 15px;text-align:right;">
                        <?php echo wp_kses_post($order->get_formatted_line_subtotal($item)); ?>
                    </td>
                </tr>
                <?php endforeach; ?>

                <!-- Shipping -->
                <tr>
                    <td colspan="2" style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#374151;padding:10px 15px;text-align:right;border-top:1px solid #E5E7EB;">
                        Dostava
                    </td>
                    <td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1a1a1a;padding:10px 15px;text-align:right;border-top:1px solid #E5E7EB;">
                        <?php echo $order->get_shipping_total() > 0
                            ? wp_kses_post(wc_price($order->get_shipping_total()))
                            : 'Besplatna'; ?>
                    </td>
                </tr>

                <!-- Total -->
                <tr>
                    <td colspan="2" style="font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:bold;color:#12181C;padding:15px;text-align:right;border-top:2px solid #0D1013;">
                        UKUPNO
                    </td>
                    <td style="font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:bold;color:#12181C;padding:15px;text-align:right;border-top:2px solid #0D1013;">
                        <?php echo wp_kses_post($order->get_formatted_order_total()); ?>
                    </td>
                </tr>

            </table>
        </td>
    </tr>
</table>

<?php do_action('woocommerce_email_footer', $email); ?>
