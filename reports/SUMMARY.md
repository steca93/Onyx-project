# ONYX storefront — performance + SEO: summary

Branch `perf-seo` (based on `feat/i18n-full`). One commit per phase. `lint`, `typecheck` and `build` pass after each phase, and the SEO test suite passes (31 tests).

## Results
| | Before | After |
|---|---|---|
| Lighthouse performance (mobile) | 92–94 | **94–96** |
| LCP (mobile, simulated) | 3.08–3.39 s | **2.85–3.09 s** |
| CLS | 0–0.04 | **0 everywhere** |
| Initial JS per route (gzip) | ~282 KB | **~207 KB (−26%)** |
| Listing / PDP GraphQL payload | 20.7–29.8 / 17.4 KB | **4.5–5.7 / 8.7 KB** |
| Catalog data caching | 60 s time-based only | **1 h + instant tag invalidation from WordPress** |
| Lighthouse SEO (home/category/product) | 92 / 92 / 100 | **100 / 100 / 100** |
| Lighthouse accessibility | 90–93 | **96** |

Details: [`baseline/`](baseline/README.md) → [`phase2/`](phase2/README.md) → [`after/`](after/README.md). SEO implementation: [`phase3/`](phase3/README.md). Content audit: [`seo-content-audit.md`](seo-content-audit.md).

## What changed
- **Phase 1 — audit:** measurement scripts (`npm run perf:lighthouse | perf:bundle | perf:graphql`), baseline reports and an architecture map. The browser never calls `/graphql`: the cart and checkout already went through a same-origin Store API proxy, so no CORS changes were needed.
- **Phase 2 — performance:**
  - A `server-only` GraphQL client with timeout, one retry, typed errors and mandatory cache tags.
  - Separate field sets for cards and product pages.
  - Tag-based caching plus `POST /api/revalidate` and a WordPress mu-plugin that calls it.
  - `private, no-store` on everything per-visitor.
  - zod/react-hook-form removed from every page's bundle (footer form rewritten; forms moved to `zod/mini`).
  - The cart drawer loads when the browser is idle.
  - `fetchPriority` on real LCP images.
  - A CLS fix, security headers, `vercel.json`, and a documented `.env.example`.
  - A build throttle, because the unthrottled build overloaded Cloudways.
- **Phase 3 — technical SEO:**
  - `buildMetadata()` on every page: titles, descriptions, canonicals, hreflang + `x-default`, OG/Twitter.
  - JSON-LD: Product/Offer, BreadcrumbList, ItemList, Organization, WebSite + SearchAction.
  - Sitemap with WordPress `lastmod`, robots.txt per environment, and `noindex` everywhere except production.
  - A 301 redirect map, a better 404 page, breadcrumbs and subcategory links.
  - All OG and schema images served from the storefront domain.
- **Phase 4 — content:** a live read-only audit (194 issues) and Serbian SEO suggestions for all 43 products and categories. Nothing was written to WordPress.
- **Phase 5 — verification:** after-measurements and a Playwright suite (`npm run test:seo`) that builds production and preview modes and checks titles, descriptions, canonicals, `og:image`, `lang`, hreflang, JSON-LD, `noindex` rules, 200/404 codes, robots, sitemap, and no-store on cart responses.

## Open TODOs (need you)
1. **Vercel region:** `vercel.json` uses `fra1`. Confirm the Cloudways server's location and pick the nearest Vercel region, since every uncached render calls it.
2. **Vercel environment variables** (Production + Preview):
   - `WORDPRESS_API_URL`: the Cloudways URL for now, `https://cms.onyx.com` after the move. That switch is an env change only.
   - `NEXT_PUBLIC_SITE_URL`: `https://onyx.com` on Production and the preview URL on Preview.
   - `REVALIDATE_SECRET`: `openssl rand -hex 32`.
   - `DATA_SOURCE=live` and `NEXT_PUBLIC_DATA_SOURCE=live`.
   - Don't set `SITE_INDEXABLE`; `VERCEL_ENV` handles it.
3. **Install the mu-plugin:** follow `wp-backend/README.md`. It needs two `wp-config.php` constants and one file upload.
4. **Domain setup on Vercel:** `onyx.com` as primary and `www.onyx.com` → redirect to apex (Vercel's domain settings do this; no code needed).
5. **When the backend moves to `cms.onyx.com`:** update `WORDPRESS_API_URL`. `remotePatterns` already allows both hosts. Keep the old host in `next.config.ts` until the switch is done, then remove it.
6. **Catalog data fixes in WooCommerce** (see `seo-content-audit.md`):
   - Unpublish the 11 placeholder products.
   - Remove the "NAPOMENA" note from the red Hex finishing pad.
   - Fix the Fish Scale towel's copy (it's the Glass Wipe text).
   - Add category descriptions and images.
   - Mark real bestsellers as **Featured**. Today none are, so the home page's bestseller block shows the newest products instead.
7. **Import `seo-suggestions.csv`** after review: short descriptions, alt texts and category intros go into WooCommerce's native fields.

## Decisions for you
- **Per-product SEO fields:** my recommendation is templates plus native fields now. Add the lightweight custom-field mu-plugin (Option C in `seo-content-audit.md`) only if you want separate SEO titles; skip Yoast/Rank Math given the backend weight.
- **Accessibility follow-ups outside this scope:** text contrast of the `text-40`/`text-34` color tokens (a design call), and the logo link's aria-label.
- **Still Serbian-only:** the web manifest description and the order emails from the WordPress plugin.

## Notes and deviations from the brief
- **Bundle analysis:** `@next/bundle-analyzer` only analyzes Webpack builds, and this project builds with Turbopack. I used `next experimental-analyze` plus a per-route script instead.
- **Variable products:** there are none in the live catalog. The `AggregateOffer` schema is implemented but only exercised with mock data.
- **INP:** it can't be measured in the lab. TBT (≤ 10 ms) is reported as its proxy; check real INP in Vercel Speed Insights after launch.
- **Dynamic pages and crawlers:** the category page is dynamically rendered (filters in the URL). Next streams metadata to browsers but renders it in `<head>` for crawlers, which is what the tests check (they request pages as Googlebot).
