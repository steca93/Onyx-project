import type { NextConfig } from "next";

// Product images are served from the WordPress/WooCommerce media library —
// next/image refuses unconfigured remote hosts, so it must be allowlisted
// here. Falls back to the known Cloudways URL, same as src/lib/repo/live/client.ts.
const wpHostname = new URL(
  process.env.WP_API_URL ?? "https://woocommerce-1614143-6633101.cloudwaysapps.com",
).hostname;

const nextConfig: NextConfig = {
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

export default nextConfig;
