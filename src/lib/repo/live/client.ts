/**
 * Server-only. Every repo/live call runs in a Server Component or Route
 * Handler — the browser never talks to WordPress directly, so this URL is
 * never exposed to the client bundle.
 */
const WP_API_URL =
  process.env.WP_API_URL ?? "https://woocommerce-1614143-6633101.cloudwaysapps.com";

export const WP_GRAPHQL_URL = `${WP_API_URL}/graphql`;
export const WC_STORE_API_URL = `${WP_API_URL}/wp-json/wc/store/v1`;

interface GraphQLResponse<T> {
  data: T | null;
  errors?: { message: string }[];
}

/**
 * Posts a query to WPGraphQL. Never throws on GraphQL-level errors — some
 * queries (e.g. "find product by slug") return a real error alongside a
 * legitimately-null `data` field for an expected not-found case, and the
 * caller is in a better position to decide what that means than this
 * function is. Unexpected errors are logged so they aren't silently lost.
 */
export async function graphqlFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
  revalidateSeconds = 60,
): Promise<T | null> {
  const res = await fetch(WP_GRAPHQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: revalidateSeconds },
  });

  if (!res.ok) {
    throw new Error(`WPGraphQL request failed: ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as GraphQLResponse<T>;

  if (json.errors?.length) {
    const messages = json.errors.map((e) => e.message).join("; ");
    console.warn(`repo/live: GraphQL returned errors — ${messages}`);
  }

  return json.data;
}
