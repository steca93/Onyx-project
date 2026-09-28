import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { redirects as redirectMap } from "./src/data/redirects";
import { routing } from "./src/i18n/routing";

/**
 * Indexable only in production. Everything else (local, Vercel previews)
 * sends `X-Robots-Tag: noindex` on every response — pages, images, JS —
 * on top of the robots meta tag and robots.txt. Must match
 * src/lib/seo/env.ts.
 */
const isIndexable =
  process.env.SITE_INDEXABLE === "true" ||
  (process.env.SITE_INDEXABLE !== "false" && process.env.VERCEL_ENV === "production");

// next/image only fetches from allowlisted hosts. Images are always served
// through /_next/image on the storefront's own domain — never linked from
// WordPress directly, whose responses carry `X-Robots-Tag: noindex`.
const wordpressHosts = [
  process.env.WORDPRESS_API_URL,
  "https://cms.onyx.com",
  "https://woocommerce-1614143-6633101.cloudwaysapps.com",
]
  .filter((u): u is string => Boolean(u))
  .map((u) => new URL(u).hostname);

/** Every locale's spelling of the per-visitor pages (cart, checkout, confirmation). */
const privatePaths = (["/korpa", "/kasa", "/potvrda-porudzbine"] as const).flatMap((route) =>
  routing.locales.map((locale) => {
    const localized = routing.pathnames[route];
    const path = typeof localized === "string" ? localized : localized[locale];
    return locale === routing.defaultLocale ? path : `/${locale}${path}`;
  }),
);

/** Locale-prefixed path for a dynamic route in a given locale. */
function localizedDynamicPath(route: "/proizvod/[slug]" | "/kategorija/[slug]", locale: string, slug: string) {
  const localized = routing.pathnames[route];
  const path = (typeof localized === "string" ? localized : localized[locale as keyof typeof localized]).replace(
    "[slug]",
    slug,
  );
  return locale === routing.defaultLocale ? path : `/${locale}${path}`;
}

const slugRedirects = redirectMap.flatMap((entry) => {
  if (entry.type === "path") return [{ source: entry.from, destination: entry.to, permanent: true }];
  const route = entry.type === "product" ? "/proizvod/[slug]" : "/kategorija/[slug]";
  return (entry.locales ?? routing.locales).map((locale) => ({
    source: localizedDynamicPath(route, locale, entry.from),
    destination: localizedDynamicPath(route, locale, entry.to),
    permanent: true,
  }));
});

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
];

const nextConfig: NextConfig = {
  experimental: {
    // Build-time only: cap how many pages prerender at once. Every page
    // prerender queries WPGraphQL (uncached at the backend — Varnish skips
    // /graphql), and an unthrottled build of ~150 pages × several queries
    // was enough to make the Cloudways server stop responding. Runtime
    // behavior is unaffected.
    cpus: 2,
    staticGenerationMaxConcurrency: 2,
    staticGenerationRetryCount: 1,
  },
  // Lets the SEO test suite build production-mode and preview-mode copies
  // side by side (see playwright.config.ts). Unset everywhere else.
  // Its own tsconfig too, so Next doesn't rewrite tsconfig.json with the
  // test dist dirs' type paths.
  ...(process.env.NEXT_DIST_DIR
    ? { distDir: process.env.NEXT_DIST_DIR, typescript: { tsconfigPath: "tsconfig.seo-test.json" } }
    : {}),
  poweredByHeader: false,
  // Crawlers get <title>/canonical/hreflang in <head>, never streamed into
  // <body>. Next's default list (reproduced first) leaves out Googlebot —
  // on a cold dynamic render (e.g. category pages) its metadata arrived in
  // the body. Browsers keep streaming metadata.
  htmlLimitedBots:
    /[\w-]+-Google|Google-[\w-]+|Chrome-Lighthouse|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti|googleweblight|Googlebot|bot\b|crawler|spider/i,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [...new Set(wordpressHosts)].map((hostname) => ({
      protocol: "https" as const,
      hostname,
      pathname: "/wp-content/uploads/**",
    })),
  },
  async redirects() {
    return slugRedirects;
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          ...securityHeaders,
          ...(isIndexable ? [] : [{ key: "X-Robots-Tag", value: "noindex, nofollow" }]),
        ],
      },
      ...privatePaths.map((source) => ({
        source,
        headers: [{ key: "Cache-Control", value: "private, no-store, max-age=0" }],
      })),
    ];
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(nextConfig);
