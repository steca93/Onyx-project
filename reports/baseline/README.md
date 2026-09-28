# Baseline — Phase 1

Measured on `perf-seo` before any optimization, `next build && next start` (live WooCommerce data), local machine. Build throttled (`experimental.cpus: 2`, `staticGenerationMaxConcurrency: 2`) — build-time only, needed because an unthrottled build took the Cloudways server down.

- [`lighthouse.md`](lighthouse.md) — Lighthouse mobile (simulated 4G + 4× CPU), median of 3; raw reports `lighthouse-*.json`
- [`bundle.md`](bundle.md) — JS per route (script tags in initial HTML)
- [`graphql.md`](graphql.md) — every WPGraphQL query: median latency, size, node count
- [`architecture.md`](architecture.md) — routes, data flow, client/server split, cart/session

## Key findings
1. **~980 KB raw / 282 KB gzip JS on every route.** Largest chunk (317 KB raw) is **zod + react-hook-form**, pulled onto every page by the footer newsletter form (one email field). Lighthouse flags ~84 KB unused JS.
2. **Mobile LCP 3.1–3.4 s** (score 92–94). Home LCP element is the SplitPromo image (y≈725 on a 412×823 viewport) — it has `priority` but **no `fetchpriority=high` on its preload** and an empty `alt`. LCP subparts are dominated by throttled image download, not TTFB.
3. **WPGraphQL floor ≈ 500 ms per query** regardless of size (backend/PHP bootstrap + network); search index 1.1–2.7 s. Uncached, a cold category page took **5.2 s** TTFB (dynamic route, sequential misses).
4. **Listing over-fetch:** 7 products = 20.7 KB, 9 = 29.8 KB — full HTML descriptions + galleries on cards that only show name/price/image.
5. CLS 0 everywhere except cart (0.04).
6. Variable products: none exist live (all 32 are simple) — no live variable PDP to measure.
