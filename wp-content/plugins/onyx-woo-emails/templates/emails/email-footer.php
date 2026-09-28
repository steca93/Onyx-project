<?php
defined('ABSPATH') || exit;
?>
                    </td>
                </tr>
            </table>
            <!-- END CONTENT CARD -->

            <!-- FOOTER -->
            <table class="email-wrapper" width="600" cellpadding="0" cellspacing="0" border="0"
                   style="max-width:600px;width:100%;background-color:#0D1013;">
                <tr>
                    <td align="center" class="email-footer" style="padding:28px 40px;">

                        <!-- Nav links -->
                        <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td style="font-family:Arial,Helvetica,sans-serif;font-size:13px;">
                                    <a href="<?php echo onyx_frontend_url('/'); ?>" style="color:#CBD5E0;text-decoration:none;">Prodavnica</a>
                                    <span style="color:#4A5568;margin:0 10px;">·</span>
                                    <a href="<?php echo onyx_frontend_url('/kontakt'); ?>" style="color:#CBD5E0;text-decoration:none;">Kontakt</a>
                                    <span style="color:#4A5568;margin:0 10px;">·</span>
                                    <a href="<?php echo onyx_frontend_url('/uslovi-koriscenja'); ?>" style="color:#CBD5E0;text-decoration:none;">Uslovi korišćenja</a>
                                </td>
                            </tr>
                        </table>

                        <!-- Divider -->
                        <table width="60" cellpadding="0" cellspacing="0" border="0" style="margin:16px auto 0 auto;">
                            <tr>
                                <td style="height:1px;background-color:#22262B;font-size:0;line-height:0;"></td>
                            </tr>
                        </table>

                        <p style="margin:16px 0 4px 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#718096;text-align:center;line-height:1.6;">
                            &copy; <?php echo date('Y'); ?> ONYX Evolution. Sva prava zadržana.
                        </p>
                        <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#4A5568;text-align:center;line-height:1.5;">
                            Dobili ste ovaj email jer ste napravili porudžbinu na ONYX Evolution sajtu
                        </p>

                    </td>
                </tr>
            </table>

        </td>
    </tr>
    <!-- Bottom spacer -->
    <tr>
        <td style="height:30px;"></td>
    </tr>
</table>

</body>
</html>
