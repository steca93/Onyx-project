import { defineConfig } from "@playwright/test";

/**
 * SEO test suite (tests/seo). Builds and serves the app twice, from separate
 * dist dirs, against live WooCommerce data:
 *  - "production": SITE_INDEXABLE=true — what onyx.com will serve
 *  - "preview":    SITE_INDEXABLE=false — local / Vercel preview behavior
 * Most tests only need HTTP + HTML (no browser).
 *
 *   npm run test:seo            (build + serve + test)
 *   SEO_SKIP_BUILD=1 npm run test:seo   (reuse the last test builds)
 */
const PROD_PORT = 3210;
const PREVIEW_PORT = 3211;
const build = process.env.SEO_SKIP_BUILD ? "" : "next build && ";

function server(port: number, indexable: boolean, distDir: string) {
  return {
    command: `${build}next start -p ${port}`,
    url: `http://localhost:${port}/robots.txt`,
    timeout: 600_000,
    reuseExistingServer: !process.env.CI,
    env: {
      NEXT_DIST_DIR: distDir,
      SITE_INDEXABLE: String(indexable),
      NEXT_PUBLIC_SITE_URL: `http://localhost:${port}`,
    },
  };
}

export default defineConfig({
  testDir: "tests",
  timeout: 60_000,
  // Live backend: keep load modest, and allow one retry — the very first
  // (uncached) render of a dynamic page waits on WordPress, which is
  // occasionally slow enough to hit the storefront's 8 s fetch timeout.
  workers: 2,
  retries: 1,
  reporter: [["list"]],
  webServer: [
    server(PROD_PORT, true, ".next-seo-prod"),
    server(PREVIEW_PORT, false, ".next-seo-preview"),
  ],
  use: {
    // Next streams metadata into <body> for regular browsers on dynamically
    // rendered pages, and renders it in <head> for crawlers. Test what
    // search engines see.
    userAgent: "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
  },
  projects: [
    { name: "production", testMatch: /seo\/.*\.prod\.spec\.ts/, use: { baseURL: `http://localhost:${PROD_PORT}` } },
    { name: "preview", testMatch: /seo\/.*\.preview\.spec\.ts/, use: { baseURL: `http://localhost:${PREVIEW_PORT}` } },
  ],
});
