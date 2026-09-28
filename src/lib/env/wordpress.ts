import "server-only";

/**
 * WordPress/WooCommerce base URL (no trailing slash, no /graphql suffix).
 * Read from env only — the backend moves from the Cloudways URL to
 * cms.onyx.com without a code change. Resolved lazily so mock-mode builds
 * don't need it set.
 */
export function wordpressBaseUrl(): string {
  const url = process.env.WORDPRESS_API_URL;
  if (!url) {
    throw new Error(
      "WORDPRESS_API_URL is not set — required when DATA_SOURCE=live (see .env.example).",
    );
  }
  return url.replace(/\/+$/, "");
}

export const wpGraphqlUrl = () => `${wordpressBaseUrl()}/graphql`;
export const wcStoreApiUrl = () => `${wordpressBaseUrl()}/wp-json/wc/store/v1`;
