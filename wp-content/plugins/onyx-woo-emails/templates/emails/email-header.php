<?php
defined('ABSPATH') || exit;
?>
<!DOCTYPE html>
<html lang="sr" xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title><?php echo esc_html(isset($email_heading) ? $email_heading : get_bloginfo('name')); ?></title>
    <style type="text/css">
        body, table, td, p, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        body { margin: 0; padding: 0; background-color: #F1F2F4; font-family: Arial, Helvetica, sans-serif; }
        table { border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        td { padding: 0; }
        img { border: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
        a { color: #0E3547; }

        @media only screen and (max-width: 620px) {
            .email-outer  { padding: 16px 8px 0 8px !important; }
            .email-card   { border-radius: 0 !important; }
            .email-header { padding: 26px 20px !important; }
            .email-footer { padding: 24px 20px !important; }
            .email-body   { padding: 24px 20px !important; }
            .two-col-left  { display: block !important; width: 100% !important; padding-right: 0 !important; padding-bottom: 20px !important; }
            .two-col-right { display: block !important; width: 100% !important; padding-left: 0 !important; border-left: none !important; border-top: 1px solid #F1F2F4 !important; padding-top: 20px !important; }
            .two-col-div   { display: none !important; }
            .product-img   { width: 52px !important; height: 52px !important; }
            h1 { font-size: 20px !important; }
        }
    </style>
</head>
<body style="margin:0;padding:0;background-color:#F1F2F4;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F1F2F4;">
    <tr>
        <td class="email-outer" align="center" style="padding:30px 15px 0 15px;">

            <!-- HEADER BAR -->
            <table width="600" cellpadding="0" cellspacing="0" border="0"
                   style="max-width:600px;width:100%;">
                <tr>
                    <td>
                        <table width="100%" cellpadding="0" cellspacing="0" border="0"
                               style="background-color:#0D1013;">
                            <tr>
                                <td class="email-header" align="center" style="padding:30px 40px 24px 40px;">
                                    <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:26px;font-weight:bold;color:#EAEEF1;letter-spacing:8px;line-height:1;">
                                        ON<span style="color:#2AB3E6;">Y</span>X
                                    </p>
                                    <p style="margin:8px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:10px;color:#2AB3E6;letter-spacing:4px;font-weight:bold;text-transform:uppercase;">EVOLUTION</p>
                                </td>
                            </tr>
                            <tr>
                                <td style="height:3px;background-color:#2AB3E6;font-size:0;line-height:0;"></td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>

            <!-- CONTENT CARD -->
            <table width="600" cellpadding="0" cellspacing="0" border="0"
                   style="max-width:600px;width:100%;background-color:#FFFFFF;">
                <tr>
                    <td>
