# Phase 3 — Technical SEO

All checks below were run against `next build && next start` with live data. [`audit.txt`](audit.txt) is the automated audit output, run in production-like mode (`SITE_INDEXABLE=true`, `NEXT_PUBLIC_SITE_URL=https://onyx.com`).

## What's in place
| Item | Implementation |
|---|---|
| Base URL | `metadataBase` = `NEXT_PUBLIC_SITE_URL` (`src/lib/seo/env.ts`); no hardcoded domain anywhere. |
| Titles | Template `%s \| ONYX EVOLUTION`. Content pages use new 50–60 char SEO titles (`Seo.pages.*`, sr/en/de). Products: the name, plus the category when the name is short. When name + suffix > 60 chars, the suffix is dropped and the title clamped at a word boundary. Categories: `{name} — kupite online`, paginated `{name} — strana N`. |
| Descriptions | WP short description → long description → template fallback (`Seo.*DescriptionFallback`), clamped to 155 chars at a word boundary. |
| Canonical | Every indexable page; `?page=N` self-canonical; sort/filter variants → clean category URL. |
| hreflang | sr/en/de + `x-default` (→ sr) on every page and in the sitemap. |
| Indexing | Production only (`VERCEL_ENV=production` or `SITE_INDEXABLE=true`): `index, follow` + `max-image-preview:large`. Elsewhere: `noindex, nofollow` meta, `X-Robots-Tag` header, and `Disallow: /`. Search, cart, checkout and confirmation are always `noindex, follow`. 404s are `noindex` (Next default). |
| Open Graph / Twitter | `og:locale` sr_RS/en_US/de_DE + alternates; product/category image served via `/_next/image` on the storefront domain (never the WP URL); generated default `/og-default.png` (1200×630); `summary_large_image`. |
| JSON-LD | `Product` (sku, brand, category, images, `Offer` with numeric RSD price, availability, condition, url; `priceValidUntil` only if WP has a sale end date; `AggregateOffer` for variable products; no ratings — no real reviews exist) + `BreadcrumbList` on product pages; `BreadcrumbList` + `ItemList` on categories; `Organization` (raster `/logo.png`) + `WebSite` with `SearchAction` on home. Output escapes `<`. |
| Sitemap | Per-locale URLs with alternates, `lastmod` from WP `modified` for products, all categories; 156 URLs today (split via `generateSitemaps` if the catalog exceeds a few thousand products). |
| robots.txt | Allows `/`; disallows cart/checkout/confirmation/search in every locale spelling, sort/filter params and `/api/`; links the sitemap. |
| Status codes | Missing product/category/page → real 404 (verified in all locales). 404 page now offers search + category links. |
| Redirects | `src/data/redirects.ts` → 301s for changed product/category slugs, expanded to every locale by `next.config.ts`. |
| Semantics | One `<h1>` per page; home heading order fixed (SplitPromo h3 → h2); all images have alt text (WP alt → product/category name fallback, translated for EN/DE); "view all" and social links have descriptive labels. |
| Internal linking | Visible breadcrumbs on product pages (Home → category → product) and category pages (incl. parent category); subcategory links on parent category pages; product → its category link; related products. |
