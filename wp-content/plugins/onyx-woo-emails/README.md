# ONYX WooCommerce Emails

Branded WooCommerce email templates for ONYX EVOLUTION, in Serbian. Same
architecture as the reference `custom-woo-emails` plugin (template override
via `woocommerce_locate_template`, custom subjects, from-name, a settings
page), reskinned with ONYX's own colors and copy adjusted for what actually
exists on the ONYX Next.js frontend.

## Included

- `customer_processing_order` — sent when an order is placed and paid (COD
  orders land here immediately).
- `customer_completed_order` — sent when an order is marked shipped/done.
- `customer_on_hold_order` — sent for orders awaiting payment confirmation.
- `customer_cancelled_order` — sent when an order is cancelled.
- `new_order` (admin) — notifies the store owner of a new order, links
  straight into wp-admin's edit-order screen.
- Shared header/footer/styles matching the site's actual brand colors
  (`#0D1013` near-black bands, `#2AB3E6` accent, "ONYX" wordmark with the
  accent-colored "Y").

## Deliberately NOT included (yet)

- **`customer_new_account` / `customer_reset_password`** — the ONYX
  storefront checkout is guest-only right now (no account/login pages, no
  "create account" option at checkout — Store API orders come back with
  `customer_id: 0`). These emails can't fire under the current setup, so
  building them now would be dead code. Add them when an account system
  ships.
- **`customer_failed_order`** (customer-facing card-decline email) — ONYX
  only has Cash on Delivery wired up; there's no card gateway yet to
  decline a payment. Add this alongside whichever card gateway gets
  integrated (see the `TODO(payments)` comment in
  `src/lib/checkout/submit-order.ts` in the main repo).
- The GYEON reference plugin also registered a `/wp-json/gyeon/v1/reviews`
  REST endpoint for product reviews — unrelated to email, and the ONYX
  frontend has no review-submission UI, so it wasn't ported.

## Install

1. Zip this `onyx-woo-emails` folder.
2. wp-admin → Plugins → Add New → Upload Plugin → upload the zip → Activate.
   (Or upload the folder directly via SFTP to `wp-content/plugins/` if you
   have file access, then activate from the Plugins list.)
3. WooCommerce → Email Templates (in the left sidebar, under WooCommerce)
   → set **URL frontend sajta** to the real Next.js site URL (defaults to
   `http://localhost:3000`, so this needs updating once there's a real
   domain — otherwise footer/CTA links in emails will point at localhost).

## If no email arrives at all (not even before this plugin)

A template override changes *appearance*, not *whether WordPress can send
mail*. If literally nothing showed up — not even WooCommerce's plain
default email — the template was never the problem. Check, in order:

1. **Spam folder** — obvious, but check it first.
2. **WooCommerce → Settings → Emails → "Processing order"** — confirm it's
   enabled and the recipient logic wasn't customized elsewhere.
3. **Use the "Pošalji test email" tool on this plugin's settings page**
   (WooCommerce → Email Templates). If the test email also never arrives,
   the problem is 100% mail delivery (`wp_mail()`), not templates.
4. **SMTP.** This is the most common cause on Cloudways and most shared
   hosting: PHP's built-in `mail()` (what `wp_mail()` falls back to) is
   frequently blocked, unauthenticated, or silently dropped/spam-filtered
   by the receiving server. Install an SMTP plugin (e.g. WP Mail SMTP) and
   connect it to a real transactional mail provider (SendGrid, Mailgun,
   Postmark, Brevo, or Cloudways' own recommended add-on) — free tiers
   cover this volume easily. Without this, WordPress often reports success
   internally while the email never actually leaves the server.
5. Check **WooCommerce → Status → Logs** for a `fatal-errors` or mailer log
   entry around the time of the failed order — if wp_mail() itself throws,
   it'll usually show here.
