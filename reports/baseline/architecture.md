# Architecture map (baseline, branch `perf-seo` @ start)

**Stack:** Next.js 16.3.2 (App Router, Turbopack), React 19.2, next-intl 4 (sr default/unprefixed, en/de prefixed, localized pathnames), Tailwind 4, zustand (cart), react-hook-form + zod (forms). No Cache Components; caching = `fetch(..., { next: { revalidate } })`.

## Routes
| Route (internal) | Rendering | Data |
|---|---|---|
| `/[locale]` (home) | SSG ×3 locales | categories, kits, featured, polishing-pads (1), newest fallback — parallel `Promise.all` |
| `/[locale]/kategorija/[slug]` | **Dynamic** (reads `searchParams` for filters/sort/page) | products page (+1 over-fetch) ∥ category |
| `/[locale]/proizvod/[slug]` | SSG (`generateStaticParams` from all slugs) | product (+ related embedded in same query; fetched twice, deduped) |
| `/[locale]/pretraga` | Dynamic | search (EN/DE: search index → `slugIn`) |
| `/[locale]/{korpa,kasa,potvrda-porudzbine}` | Static shell + client cart store | Store API via proxy (client) |
| static pages (garancija, kontakt, …) | SSG | none / message catalogs |
| `/api/search-index/[locale]` | SSG + revalidate 3600 | full product index (id, name, slug, price, image) |
| `/api/store/[...path]` | Dynamic proxy | WooCommerce **Store API** (`/wp-json/wc/store/v1`) |
| `sitemap.xml`, `robots.txt` | on demand / static | slugs + categories |

Root layout (`[locale]/layout.tsx`) fetches **all categories on every page** (nav + footer).

## Data layer
- `src/lib/repo/index.ts` — locale-aware facade (applies EN/DE catalog overlay from `src/i18n/catalog`). Pages import only from here.
- `src/lib/repo/live/client.ts` — `graphqlFetch`: POST to `${WP_API_URL}/graphql`, `next.revalidate` 60s default, **no timeout, no tags, hardcoded fallback URL**, not marked `server-only`.
- `src/lib/repo/live/queries.ts` — one product field set (`SHARED_FIELDS` incl. full `description`, all gallery images, 50 variations) used for **both listings and PDP**.
- `src/lib/repo/mock` — fixtures (`DATA_SOURCE=mock`).

## Cart / session / CORS
- Browser → same-origin `/api/store/*` → WooCommerce Store API. `Cart-Token` + `Nonce` stored in **httpOnly cookies** by the proxy; never exposed to JS. Upstream fetch is `cache: "no-store"`.
- **The browser never calls WordPress or `/graphql` directly → no CORS needed.** ✅
- Gaps: proxy responses carry no explicit `Cache-Control`; route not explicitly `force-dynamic`.
- Cart UI state: zustand store (`src/lib/cart/store.ts`) hydrated from `/api/store/cart`.

## Client components (921 lines below)
- `src/app/[locale]/garancija/page.tsx`
- `src/app/[locale]/kasa/page.tsx`
- `src/app/[locale]/kontakt/page.tsx`
- `src/app/[locale]/korpa/page.tsx`
- `src/app/[locale]/ovlasceni-centri/page.tsx`
- `src/app/[locale]/postani-instalater/page.tsx`
- `src/app/[locale]/potvrda-porudzbine/page.tsx`
- `src/components/cart/CartDrawer.tsx`
- `src/components/cart/CartLineItemRow.tsx`
- `src/components/cart/OrderItemRow.tsx`
- `src/components/layout/CookieConsent.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/layout/Header.tsx`
- `src/components/layout/LanguageSwitcher.tsx`
- `src/components/layout/SearchBar.tsx`
- `src/components/sections/KitCarousel.tsx`
- `src/components/sections/ProductGallery.tsx`
- `src/components/sections/ProductPurchasePanel.tsx`
- `src/components/ui/Accordion.tsx`
- `src/components/ui/Tabs.tsx`
- `src/components/ui/VariantSelector.tsx`
- `src/i18n/catalog/ProductNamesProvider.tsx`

Layout-level client components (ship on **every** page): Header (+SearchBar, MobileMenuDrawer), UtilityBar/LanguageSwitcher, **Footer NewsletterForm (zod + RHF)**, CartDrawer, CookieConsent, ProductNamesProvider.

## Images / fonts / scripts
- All product imagery via `next/image` (`ImageSlot`), remote pattern = Cloudways host `/wp-content/uploads/**`, AVIF+WebP on.
- Fonts: `next/font/google` Questrial + Space Mono, latin + latin-ext, `display: swap`.
- No third-party scripts.
