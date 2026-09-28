# SEO content audit — live catalog

Source: live WPGraphQL, read-only (`npm run seo:audit`). **32 products, 11 categories, 194 issues** → full list in [`seo-content-audit.csv`](seo-content-audit.csv) (one row per issue, sorted by severity). Proposed copy fixes in [`seo-suggestions.csv`](seo-suggestions.csv). Nothing was written to WordPress.

## Fix first (high impact)
1. **11 placeholder products are published.** Their names and slugs are the same as a category's (`/proizvod/poliranje`, `/proizvod/ppf-auto-folija`, …). They have no image, no price, only "Uncategorized", and one line of text. They're live pages, in the sitemap, and show up in "newest"/search listings as unpriced items. **Recommendation:** unpublish or delete them in WooCommerce (Products → filter by *Uncategorized*). The mu-plugin will refresh the storefront automatically.
2. **Internal note visible to customers:** the description of the red Hex finishing pad (`hex-sundjer-za-finis-poliranje-onyx-evolution-130mm-crveni-finishing`) ends with "NAPOMENA: …", a note about the short description having been copied from the Hot Wheel product.
3. **Copy-paste content:** the Fish Scale towel's descriptions are the Glass Wipe product's text (it even calls itself "Glass Wipe"). This is duplicate content, and wrong for customers.
4. **All 11 categories have no description and no image.** Category pages are bare product grids with no indexable text, and share cards fall back to the default OG image. `seo-suggestions.csv` has a proposed intro for each.

## Other findings
| Issue | Count | Note |
|---|---|---|
| Missing SKU | 12 | 11 placeholders + 1 real product; SKU goes into Product structured data. |
| Featured image without alt text | 21 | The storefront falls back to the product name, but real alt text is better (suggestions provided). |
| Gallery images without alt | 5 products | Same fallback applies. |
| Name too long for a title | 19 | e.g. "Sundjer za Finiš Poliranje 130mm ONYX Evolution Medium Cut (Crni, Finishing)" — search engines truncate after ~60 chars. The storefront clamps them, but a dedicated SEO title is better (suggestions provided). |
| Name too short | 5 | Placeholder products. |
| Best description text < 70 chars | 10 | Placeholders; meta descriptions fall back to templates. |
| Thin content (< 150 words) | 11 | Placeholders. |
| Slug > 60 chars | 12 | e.g. `sundjer-za-finis-poliranje-130mm-onyx-evolution-medium-cut-crni-finishing` (73). Don't rename already-indexed slugs just for length; if you do, add a 301 in `src/data/redirects.ts`. |
| Inconsistent `sundjer`/`sunder` spelling in slugs | 10 | Both come from "sunđer". Pick one form for **new** products. |
| Contradictory name | 1 | Black finishing pad is named both "Medium Cut" and "Finishing". |
| Non-ASCII slugs | 0 | ✅ |
| Duplicate titles | 0 | ✅ |

## Where should per-product SEO fields live long-term?

**Recommendation: fallback templates + a one-time CSV import into WooCommerce's own fields now; add an SEO plugin only if someone will actively maintain per-page SEO copy.**

### Option A — Templates + native WooCommerce fields (what's built now)
The storefront derives titles from the product name (plus category when short) and descriptions from the short description, falling back to templates. "SEO copy" means writing a good *short description* and *alt text*, both native WooCommerce fields that `seo-suggestions.csv` targets.
- ✅ Zero backend weight: no plugin, no extra GraphQL fields, no extra queries.
- ✅ One source of truth. The short description is both the listing snippet and the meta description, so editors can't forget one.
- ✅ Works in EN/DE automatically (the catalog overlay translates the same fields).
- ❌ No separate SEO title per product. Names double as titles, so long names get clamped.
- ❌ Meta description and on-page short description can't differ.

### Option B — SEO plugin (Yoast / Rank Math) + WPGraphQL extension
- ✅ Editors get per-product SEO title and description fields, a snippet preview, and focus keyword hints.
- ❌ **Backend weight:** Yoast/Rank Math are among the heaviest WP plugins (admin UI, indexables tables, cron jobs, sitemap generation, schema output). Most of that is unused headless, because the storefront already does sitemaps, schema, canonicals and robots. It needs an extra plugin for WPGraphQL (e.g. *WPGraphQL for Yoast*), which adds SEO fields to every product query (bigger payloads, and more PHP per request on a backend already at ~0.6 s per query).
- ❌ Two sources of truth: plugin-generated sitemaps/schema on the (noindexed) WP domain vs the storefront's.
- ❌ Monolingual unless paired with WPML/Polylang. EN/DE SEO copy would still live in the storefront overlay.

### Option C — middle ground if per-product titles become necessary
Two custom product meta fields (`_onyx_seo_title`, `_onyx_seo_description`) registered in a ~40-line mu-plugin (`register_graphql_field` on `Product`), fetched only by the product page query. The storefront uses them when set and falls back to the templates otherwise. It adds per-product control at almost no backend cost; I can write it into `wp-backend/` if you want it.
