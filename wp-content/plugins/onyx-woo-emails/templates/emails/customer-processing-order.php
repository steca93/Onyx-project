<?php
/**
 * Customer processing order email
 *
 * @var WC_Order $order
 * @var string   $email_heading
 * @var bool     $sent_to_admin
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
                Hvala<?php if ($order->get_billing_first_name()): ?>, <?php echo esc_html($order->get_billing_first_name()); ?><?php endif; ?>!
            </h1>
            <p style="margin:0 0 20px 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#6B7280;line-height:1.6;">
                Vaša porudžbina je primljena i već je u obradi.
            </p>
            <!-- Order number pill -->
            <table align="center" cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td style="background-color:#F1F2F4;border-radius:6px;padding:8px 22px;">
                        <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#374151;">
                            Porudžbina <strong style="color:#12181C;">#<?php echo esc_html($order->get_order_number()); ?></strong>
                            &nbsp;·&nbsp;
                            <span style="color:#6B7280;"><?php echo date_i18n('d.m.Y', strtotime($order->get_date_created())); ?></span>
                        </p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

<!-- Divider -->
<table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr><td style="height:1px;background-color:#F1F2F4;font-size:0;"></td></tr>
</table>

<!-- ═══ ORDER ITEMS ══════════════════════════════════════════════════════════ -->
<table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
        <td class="email-body" style="padding:28px 40px 0 40px;">
            <p style="margin:0 0 16px 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:bold;color:#9CA3AF;letter-spacing:1.5px;text-transform:uppercase;">
                VAŠA PORUDŽBINA
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

            <!-- Item row -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0"
                   style="border-bottom:<?php echo $is_last ? '0' : '1px solid #F3F4F6'; ?>;padding-bottom:<?php echo $is_last ? '0' : '16px'; ?>;margin-bottom:<?php echo $is_last ? '0' : '16px'; ?>;">
                <tr>
                    <!-- Product image -->
                    <td width="64" valign="top" style="padding-right:16px;">
                        <?php if ($image_url) : ?>
                        <img src="<?php echo esc_url($image_url); ?>"
                             width="64" height="64"
                             alt="<?php echo esc_attr($item->get_name()); ?>"
                             class="product-img"
                             style="width:64px;height:64px;border-radius:4px;border:1px solid #F3F4F6;display:block;" />
                        <?php else : ?>
                        <table width="64" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td width="64" height="64"
                                    style="width:64px;height:64px;background-color:#F3F4F6;border-radius:4px;text-align:center;vertical-align:middle;">
                                    <p style="margin:0;font-size:24px;line-height:64px;">&#9968;</p>
                                </td>
                            </tr>
                        </table>
                        <?php endif; ?>
                    </td>
                    <!-- Product info -->
                    <td valign="middle">
                        <p style="margin:0 0 4px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;color:#12181C;line-height:1.4;">
                            <?php echo esc_html($item->get_name()); ?>
                        </p>
                        <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#9CA3AF;">
                            Količina: <?php echo esc_html($item->get_quantity()); ?>
                        </p>
                    </td>
                    <!-- Price -->
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

<!-- ═══ ORDER TOTALS ═════════════════════════════════════════════════════════ -->
<table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
        <td class="email-body" style="padding:20px 40px 28px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0"
                   style="background-color:#F8F9FA;border-radius:8px;">
                <tr>
                    <td style="padding:20px 24px;">

                        <!-- Subtotal -->
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:10px;">
                            <tr>
                                <td style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#6B7280;">Međuzbir</td>
                                <td style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#374151;text-align:right;">
                                    <?php echo wp_kses_post(wc_price($order->get_subtotal())); ?>
                                </td>
                            </tr>
                        </table>

                        <!-- Shipping — read straight off the order, never a
                             guessed threshold, so this can't drift from what
                             was actually charged. -->
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:<?php echo $order->get_discount_total() > 0 ? '10px' : '16px'; ?>;">
                            <tr>
                                <td style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#6B7280;">Dostava</td>
                                <td style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#374151;text-align:right;">
                                    <?php echo $order->get_shipping_total() > 0
                                        ? wp_kses_post(wc_price($order->get_shipping_total()))
                                        : '<span style="color:#0E3547;font-weight:bold;">Besplatna</span>'; ?>
                                </td>
                            </tr>
                        </table>

                        <?php if ($order->get_discount_total() > 0) : ?>
                        <!-- Discount -->
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px;">
                            <tr>
                                <td style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#6B7280;">Popust</td>
                                <td style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#0E3547;font-weight:bold;text-align:right;">
                                    -<?php echo wp_kses_post(wc_price($order->get_discount_total())); ?>
                                </td>
                            </tr>
                        </table>
                        <?php endif; ?>

                        <!-- Total -->
                        <table width="100%" cellpadding="0" cellspacing="0" border="0"
                               style="border-top:1px solid #E5E7EB;">
                            <tr>
                                <td style="font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;color:#12181C;padding-top:14px;">
                                    Ukupno
                                </td>
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

<!-- Divider -->
<table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr><td style="height:1px;background-color:#F1F2F4;font-size:0;"></td></tr>
</table>

<!-- ═══ DELIVERY + PAYMENT ══════════════════════════════════════════════════ -->
<table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
        <td class="email-body" style="padding:28px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>

                    <!-- Shipping address -->
                    <td class="two-col-left" width="48%" valign="top" style="padding-right:16px;">
                        <p style="margin:0 0 10px 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:bold;color:#9CA3AF;letter-spacing:1.5px;text-transform:uppercase;">
                            ADRESA ZA DOSTAVU
                        </p>
                        <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#374151;line-height:1.8;">
                            <strong style="color:#12181C;"><?php echo esc_html(trim($order->get_shipping_first_name() . ' ' . $order->get_shipping_last_name())); ?></strong><br>
                            <?php echo esc_html($order->get_shipping_address_1()); ?><br>
                            <?php if ($order->get_shipping_address_2()): echo esc_html($order->get_shipping_address_2()) . '<br>'; endif; ?>
                            <?php echo esc_html($order->get_shipping_city() . ' ' . $order->get_shipping_postcode()); ?><br>
                            Srbija
                        </p>
                    </td>

                    <!-- Divider -->
                    <td class="two-col-div" width="4%" style="border-left:1px solid #F1F2F4;"></td>

                    <!-- Payment method -->
                    <td class="two-col-right" width="48%" valign="top" style="padding-left:16px;">
                        <p style="margin:0 0 10px 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:bold;color:#9CA3AF;letter-spacing:1.5px;text-transform:uppercase;">
                            NAČIN PLAĆANJA
                        </p>
                        <p style="margin:0 0 4px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;color:#12181C;">
                            <?php echo esc_html($order->get_payment_method_title()); ?>
                        </p>
                        <?php if ($order->get_payment_method() === 'cod'): ?>
                        <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#6B7280;line-height:1.5;">
                            Plaćanje kuriru pri isporuci
                        </p>
                        <?php endif; ?>
                    </td>

                </tr>
            </table>
        </td>
    </tr>
</table>

<!-- Divider -->
<table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr><td style="height:1px;background-color:#F1F2F4;font-size:0;"></td></tr>
</table>

<!-- ═══ WHAT'S NEXT ══════════════════════════════════════════════════════════ -->
<table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
        <td style="padding:28px 40px;">
            <p style="margin:0 0 20px 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:bold;color:#9CA3AF;letter-spacing:1.5px;text-transform:uppercase;text-align:center;">
                ŠTA SE DEŠAVA DALJE?
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <!-- Step 1 -->
                    <td width="33%" align="center" valign="top" style="padding:0 8px;">
                        <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:10px;">
                            <tr>
                                <td align="center" style="width:44px;height:44px;background-color:#F1F2F4;border-radius:50%;">
                                    <p style="margin:0;font-size:20px;line-height:44px;">&#128230;</p>
                                </td>
                            </tr>
                        </table>
                        <p style="margin:0 0 4px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;color:#12181C;">Pakujemo</p>
                        <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#9CA3AF;line-height:1.5;">Vaši proizvodi se pripremaju</p>
                    </td>
                    <!-- Step 2 -->
                    <td width="33%" align="center" valign="top" style="padding:0 8px;">
                        <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:10px;">
                            <tr>
                                <td align="center" style="width:44px;height:44px;background-color:#F1F2F4;border-radius:50%;">
                                    <p style="margin:0;font-size:20px;line-height:44px;">&#128666;</p>
                                </td>
                            </tr>
                        </table>
                        <p style="margin:0 0 4px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;color:#12181C;">Šaljemo</p>
                        <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#9CA3AF;line-height:1.5;">Dostava 1–3 radna dana</p>
                    </td>
                    <!-- Step 3 -->
                    <td width="33%" align="center" valign="top" style="padding:0 8px;">
                        <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:10px;">
                            <tr>
                                <td align="center" style="width:44px;height:44px;background-color:#E5F7FC;border-radius:50%;">
                                    <p style="margin:0;font-size:20px;line-height:44px;">&#10003;</p>
                                </td>
                            </tr>
                        </table>
                        <p style="margin:0 0 4px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;color:#12181C;">Uživajte!</p>
                        <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#9CA3AF;line-height:1.5;">Hvala što ste izabrali ONYX</p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

<!-- ═══ CTA BUTTON ═══════════════════════════════════════════════════════════ -->
<table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
        <td align="center" style="padding:8px 40px 32px 40px;">
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

<!-- ═══ HELP BOX ══════════════════════════════════════════════════════════════ -->
<table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
        <td style="padding:0 40px 32px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0"
                   style="border:1px solid #E5E7EB;border-radius:8px;">
                <tr>
                    <td style="padding:18px 22px;">
                        <p style="margin:0 0 4px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;color:#12181C;">
                            Imate pitanje?
                        </p>
                        <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#6B7280;line-height:1.6;">
                            Odgovorimo vam u roku od 24h —
                            <a href="<?php echo onyx_frontend_url('/kontakt'); ?>"
                               style="color:#0E3547;text-decoration:none;font-weight:bold;">
                                kontaktirajte nas
                            </a>
                        </p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

<?php do_action('woocommerce_email_footer', $email); ?>
