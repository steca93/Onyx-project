# After — Phase 5 measurements

Same method as [`../baseline`](../baseline): `next build && next start`, live WooCommerce data, Lighthouse mobile preset (simulated slow 4G + 4× CPU), median of 3 runs.

- `lighthouse*.{json,md}`, `bundle.*`, `graphql.md`: local mode (non-indexable, like the baseline run). Measured before the final accessibility-only tweak (`inert` on closed drawers, social link labels), which doesn't change performance.
- `production-mode/`: the final code built as production (`SITE_INDEXABLE=true`) — the SEO and accessibility scores that matter.

## Before → after

| Page | Perf score | LCP (ms) | CLS | TBT (ms)¹ | JS transfer (KB)² | Initial JS gzip (KB)³ | Initial JS raw (KB)³ |
|---|---|---|---|---|---|---|---|
| Home | 92 → **95** | 3391 → **2921** (−14%) | 0 → 0 | 0 → 3 | 256.0 → **211.9** | 281.7 → **207.1** (−26%) | 978.5 → **666.1** |
| Category | 94 → **96** | 3080 → **2846** (−8%) | 0 → 0 | 0 → 3 | 258.3 → **214.7** | 280.4 → **205.9** (−27%) | 975.3 → **662.8** |
| Product | 93 → **95** | 3161 → **2909** (−8%) | 0 → 0 | 0 → 1 | 260.7 → **214.7** | 282.3 → **208.0** (−26%) | 980.0 → **668.7** |
| Cart | 92 → **94** | 3386 → **3088** (−9%) | 0.040 → **0** | 0 → 10 | 256.0 → **211.9** | 282.3 → **208.2** (−26%) | 981.4 → **670.6** |

¹ TBT is the lab proxy for INP (INP needs real user interactions; watch it in Vercel Speed Insights / CrUX after launch). All values stay far below the 200 ms "good" threshold.
² Everything Lighthouse downloaded, including background route prefetches.
³ Scripts referenced by the initial HTML (`scripts/route-js.mts`).

### Lighthouse category scores (production mode)
| Page | SEO | Accessibility | Best practices |
|---|---|---|---|
| Home | 92 → **100** | 90 → **96** | 100 → 100 |
| Category | 92 → **100** | 93 → **96** | 100 → 100 |
| Product | 100 → **100** | 93 → **96** | 100 → 100 |
| Cart | 63 → 63 (intentionally `noindex`) | 92 → **96** | 100 → 100 |

Remaining Lighthouse flags: text color contrast of the `text-40`/`text-34` tokens (a design decision), and the logo link's aria-label not matching its visible text. Both were already there before this work.

### WPGraphQL (per query, uncached)
| Query | Size before → after | Median latency before → after |
|---|---|---|
| Category listing (7) | 20.7 → **4.5 KB** (−78%) | 608 → 578 ms |
| Newest listing (9) | 29.8 → **5.7 KB** (−81%) | 605 → 624 ms |
| Product page (+related) | 17.4 → **8.7 KB** (−50%) | 607 → 629 ms |
| Search index | 8.4 → 8.4 KB | 1537 → 617 ms⁴ |

Uncached latency is backend-bound (~0.6 s floor per request on Cloudways). What changed is how often visitors pay it: catalog data is now cached for 1 h with tag-based invalidation from WordPress. A cached category render takes **~10 ms** vs ~1.2 s uncached.

⁴ The baseline search-index number was taken while the backend was under load. Same query, not an optimization.
