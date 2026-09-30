# Vercel deployment checklist

Tick items off (`[x]`) as you go. Background for the WordPress steps lives in
[`wp-backend/README.md`](../wp-backend/README.md); every env var is documented
in [`.env.example`](../.env.example).

## 1. Code

- [ ] Latest code merged into `main` and pushed to GitHub (Vercel deploys from GitHub)

## 2. Create the Vercel project

- [ ] vercel.com → **Add New → Project** → import `steca93/Onyx-project`
- [ ] Framework preset: **Next.js** (auto-detected), build settings left at defaults
- [ ] Region is `fra1` (set by `vercel.json`, no action needed)

## 3. Environment variables

Project → Settings → Environment Variables. Add them **before** the first deploy.

- [ ] `DATA_SOURCE` = `live` (Production + Preview)
- [ ] `NEXT_PUBLIC_DATA_SOURCE` = `live` (Production + Preview)
- [ ] `WORDPRESS_API_URL` = `https://woocommerce-1614143-6633101.cloudwaysapps.com` (Production + Preview)
- [ ] `NEXT_PUBLIC_SITE_URL` = production domain, e.g. `https://onyx.com` (Production). Use the `*.vercel.app` URL until the domain is attached.
- [ ] `REVALIDATE_SECRET` = output of `openssl rand -hex 32` (Production + Preview, same value). Save it for step 6.
- [ ] `SITE_INDEXABLE` left **unset** (production is indexable, previews get noindex automatically)

## 4. First deploy

- [ ] Click **Deploy**
- [ ] Build succeeds. It takes a few minutes because pages prerender against WordPress two at a time. If it fails on WPGraphQL timeouts, redeploy.
- [ ] Site opens on the `*.vercel.app` URL

## 5. Custom domain

- [ ] Project → Settings → Domains → add the domain
- [ ] DNS records set at the registrar as Vercel instructs
- [ ] Domain shows as valid in Vercel, HTTPS works
- [ ] `NEXT_PUBLIC_SITE_URL` updated to the real domain
- [ ] **Redeployed** (`NEXT_PUBLIC_*` values are baked in at build time)

## 6. WordPress on-demand revalidation

Without this, wp-admin edits take up to 1 hour to show on the storefront.

- [ ] Added to `wp-config.php` (above `/* That's all, stop editing! */`):
  ```php
  define( 'ONYX_FRONTEND_URL', 'https://onyx.com' );   // production URL, no trailing slash
  define( 'ONYX_REVALIDATE_SECRET', '<same value as REVALIDATE_SECRET>' );
  ```
- [ ] Uploaded `wp-backend/mu-plugins/onyx-revalidate.php` to `wp-content/mu-plugins/`
- [ ] Plugin shows under Plugins → Must-Use
- [ ] Test: edit a product's price in wp-admin → its storefront page shows the new price on the first reload

## 7. Post-launch checks

- [ ] Homepage, a category page and a product page load in sr, en and de
- [ ] Add to cart → cart page → checkout works (`/api/store/**` proxy to WooCommerce)
- [ ] Production `/robots.txt` allows crawling and links the sitemap
- [ ] A preview deployment's `/robots.txt` returns `Disallow: /`
- [ ] `/sitemap.xml` lists URLs on the production domain (not `localhost` or `vercel.app`)
- [ ] Sitemap submitted in Google Search Console
- [ ] Confirm the Cloudways server location. If it isn't in Europe, change `regions` in `vercel.json` to the closest Vercel region and redeploy.
