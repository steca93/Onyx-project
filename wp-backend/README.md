# WordPress backend add-ons

Code in this folder runs **on the WordPress server**, not in Next.js. Nothing here is deployed automatically — upload it yourself.

## `mu-plugins/onyx-revalidate.php` — on-demand cache refresh

The storefront caches all catalog data (products, categories, menu) in Next.js for up to 1 hour, because WPGraphQL responses are never cached by Varnish. This mu-plugin tells the storefront to drop the affected cache entries **immediately** when something changes in wp-admin, so edits appear within seconds instead of up to an hour later.

It fires on: product create/update/trash/restore/delete, variation changes (mapped to the parent), stock quantity and stock status changes (including those caused by orders), scheduled sale start/end, product slug changes (old URL is refreshed too), product category create/edit/delete, and menu updates. Requests are queued during the admin request and sent **non-blocking** when it finishes (2 s timeout), so saving in wp-admin never waits on the frontend.

### Install

1. Generate a secret (at least 32 random characters), e.g. `openssl rand -hex 32`.
2. Set it on **Vercel** → Project → Settings → Environment Variables → `REVALIDATE_SECRET` (Production + Preview).
3. Add to `wp-config.php` (above `/* That's all, stop editing! */`):
   ```php
   define( 'ONYX_FRONTEND_URL', 'https://onyx.com' );        // production storefront, no trailing slash
   define( 'ONYX_REVALIDATE_SECRET', 'paste-the-same-secret' );
   ```
4. Upload `mu-plugins/onyx-revalidate.php` to `wp-content/mu-plugins/` (create the folder if it doesn't exist). Must-use plugins activate automatically; it shows under Plugins → Must-Use.

If either constant is missing, the plugin does nothing (no errors).

### Verify

Edit a product's price in wp-admin, then reload its page on the storefront — the new price shows on the first reload. To test the endpoint directly:

```bash
curl -X POST https://onyx.com/api/revalidate \
  -H "Authorization: Bearer $REVALIDATE_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"type":"product","slug":"onyx-evo-clear-ppf-zastitna-folija","categories":["ppf-auto-folija"]}'
# → {"ok":true,"tags":["products","product:onyx-evo-clear-ppf-zastitna-folija","category:ppf-auto-folija"]}
```

Payload types: `product` (`id`, `slug`, `categories`), `category` (`id`, `slug`), `menu`, `settings`, `all`. One call refreshes the sr, en and de pages (translations are applied on top of the same cached data). EN/DE translations live in the storefront repo (`src/i18n/catalog/`), so editing them means a deploy, which clears the cache anyway — no WordPress hook needed.

### Notes

- Cloudways: outbound HTTPS from the server must be allowed (it is by default).
- Vercel region: functions run in `fra1` (see `vercel.json`). **TODO: confirm the Cloudways server location** and pick the closest Vercel region — every uncached page render makes WPGraphQL calls to it.
