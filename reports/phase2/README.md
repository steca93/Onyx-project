# Phase 2 — Performance

Same method as the baseline (`next build && next start`, live data, Lighthouse mobile median of 3).

## Results vs baseline
| Page | Perf | LCP ms | CLS | TBT ms | Initial JS gzip KB | JS transfer KB (incl. prefetch) |
|---|---|---|---|---|---|---|
| home | 92 → **95** | 3391 → **2914** | 0 → 0 | 0 → 1 | 281.7 → **206.7** | 256.0 → **211.4** |
| category | 94 → **96** | 3080 → **2830** | 0 → 0 | 0 → 0 | 280.4 → **205.4** | 258.3 → **214.2** |
| product | 93 → **95** | 3161 → **2907** | 0 → 0 | 0 → 0 | 282.3 → **207.5** | 260.7 → **217.1** |
| cart | 92 → **93** | 3386 → **3232** | 0.040 → **0** | 0 → 7 | 282.3 → **207.7** | 256.0 → **211.4** |

GraphQL payloads ([graphql.md](graphql.md) vs [baseline](../baseline/graphql.md)): category listing 20.7 → **4.5 KB**, newest listing 29.8 → **5.7 KB**, product page 17.4 → **8.7 KB**. Latency per uncached query is unchanged (~0.6 s, backend-bound) — which is why every catalog fetch is now cached and tagged; a cached category render takes ~10 ms vs ~1.2 s uncached.

## What changed
**Data layer**
- `src/lib/repo/live/client.ts`: `server-only`; URL from `WORDPRESS_API_URL` only (hardcoded fallback removed here and in `next.config.ts`); 8 s timeout at runtime / 30 s during `next build`; one retry on timeout, network error or 5xx; typed `GraphQLRequestError`; every call must pass `{ revalidate, tags }`.
- `src/lib/repo/live/cache.ts`: `REVALIDATE` (products 1 h, categories 1 h, static 24 h) and `TAGS` (`products`, `categories`, `menu`, `settings`, `product:{slug}`, `category:{slug}`).
- `queries.ts`: separate card vs detail field sets. Listings and related products no longer fetch descriptions, galleries, attributes or variations.
- Product page: related products stream in a `<Suspense>` boundary.

**Revalidation**
- `POST /api/revalidate` (Bearer `REVALIDATE_SECRET`, constant-time compare) → `revalidateTag(tag, { expire: 0 })` + sitemap path.
- `wp-backend/mu-plugins/onyx-revalidate.php` + install guide `wp-backend/README.md`.

**Never-cached user data**
- `/api/store/*` proxy: `force-dynamic`, `Cache-Control: private, no-store` on every response (incl. errors); error body is now a code, not Serbian text.
- Cart/checkout/confirmation pages in all locales: `Cache-Control: private, no-store` via `next.config` headers.

**Bundle**
- Footer newsletter form rewritten without zod/react-hook-form, as its own small client leaf; Footer is now a server component. (It forced a 317 KB-raw zod chunk onto every page.)
- All forms: classic `zod` → `zod/mini` with namespace import (`import * as z`) — the forms chunk went 317 KB → 75 KB raw; it's still prefetched by header links, now cheaply.
- Cart drawer loads via `next/dynamic` on browser idle (or on first open). The cookie banner was tried lazy too but reverted: it's often the LCP element on first visits and lazy-loading delayed it.

**Images / CLS**
- `ImageSlot` `priority` → `loading="eager"` + `fetchPriority="high"` (Next 16 deprecates `priority`). Only real LCP images keep it: SplitPromo (home — measured LCP on mobile) and the product gallery main image. Removed from the Hero (it has no image).
- `sizes` corrected on product cards.
- Guard `rewriteWpHtml()`: `<img>` inside WP descriptions is routed through `/_next/image` (none exist today).
- `.container-onyx` gets `width: 100%` — as a flex child it shrank to its content, so the cart column re-centered after hydration (CLS 0.04 → 0).
- `remotePatterns`: `WORDPRESS_API_URL` host + `cms.onyx.com` + current Cloudways host.

**Deploy prep**
- `vercel.json` → `regions: ["fra1"]` (**TODO: confirm Cloudways server location**).
- Security headers (HSTS, nosniff, Referrer-Policy, X-Frame-Options, Permissions-Policy), `poweredByHeader: false`; `X-Robots-Tag: noindex, nofollow` on **non-production only**.
- `.env.example` documents `WORDPRESS_API_URL`, `NEXT_PUBLIC_SITE_URL`, `REVALIDATE_SECRET`, `SITE_INDEXABLE`, `DATA_SOURCE`.

## Not changed (and why)
- **Header** stays a client component: search, cart count, active category and the mobile drawer are all interactive; splitting it would save little (<5 KB).
- **Category page** remains dynamically rendered: it reads `searchParams` (filters/sort/page). Its data is cached, so a render costs ~10 ms, not a WordPress round trip.
- Remaining JS (~205 KB gzip) is mostly React + Next runtime + next-intl — framework floor.
