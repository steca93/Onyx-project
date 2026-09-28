import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Product images are served from the WordPress/WooCommerce media library —
// next/image refuses unconfigured remote hosts, so it must be allowlisted
// here. Falls back to the known Cloudways URL, same as src/lib/repo/live/client.ts.
const wpHostname = new URL(
  process.env.WP_API_URL ?? "https://woocommerce-1614143-6633101.cloudwaysapps.com",
).hostname;

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
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: wpHostname,
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(nextConfig);
