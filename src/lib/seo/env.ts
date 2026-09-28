/**
 * Public storefront origin, from NEXT_PUBLIC_SITE_URL (no trailing slash).
 * Canonicals, hreflang, Open Graph, sitemap and robots.txt all derive from
 * it — nothing hardcodes a domain.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/+$/, "");

/**
 * Only the production deployment may be indexed. Local and Vercel preview
 * builds get noindex (meta + X-Robots-Tag header in next.config.ts) and
 * `Disallow: /`. SITE_INDEXABLE=true|false overrides (e.g. SEO tests).
 * Keep in sync with next.config.ts.
 */
export const IS_INDEXABLE =
  process.env.SITE_INDEXABLE === "true" ||
  (process.env.SITE_INDEXABLE !== "false" && process.env.VERCEL_ENV === "production");

export const BRAND = "ONYX EVOLUTION";
export const TITLE_SUFFIX = ` | ${BRAND}`;
