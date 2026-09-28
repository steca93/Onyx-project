import "server-only";
import { wpGraphqlUrl } from "@/lib/env/wordpress";

/**
 * Visitors shouldn't wait long on a stuck backend (8 s, then the page's
 * error handling takes over). During `next build`, though, dozens of pages
 * prerender at once against a backend with no GraphQL caching of its own —
 * slow answers are expected there, and a timeout would fail the deploy.
 */
const IS_BUILD = process.env.NEXT_PHASE === "phase-production-build";
const TIMEOUT_MS = IS_BUILD ? 30_000 : 8_000;
/** One retry (after a short pause) for timeouts, network errors and 5xx. */
const RETRY_DELAY_MS = IS_BUILD ? 2_000 : 300;

export class GraphQLRequestError extends Error {
  constructor(
    message: string,
    readonly status?: number,
    readonly retryable = false,
  ) {
    super(message);
    this.name = "GraphQLRequestError";
  }
}

interface GraphQLResponse<T> {
  data: T | null;
  errors?: { message: string }[];
}

export interface GraphQLCacheOptions {
  /** Seconds — see REVALIDATE in ./cache.ts. */
  revalidate: number;
  /** See TAGS in ./cache.ts. */
  tags: string[];
}

/**
 * Posts a query to WPGraphQL. Every call is cached by Next's data cache
 * (Varnish skips /graphql on the backend, so this is the only cache in
 * front of WordPress) and tagged for on-demand revalidation.
 *
 * Never throws on GraphQL-level errors — some queries (e.g. "find product
 * by slug") return a real error alongside a legitimately-null `data` for an
 * expected not-found case, and the caller decides what that means.
 * Transport failures (timeout, non-2xx) do throw.
 */
export async function graphqlFetch<T>(
  query: string,
  variables: Record<string, unknown> | undefined,
  cache: GraphQLCacheOptions,
): Promise<T | null> {
  let res: Response;
  try {
    res = await postOnce(query, variables, cache);
  } catch (error) {
    if (!(error instanceof GraphQLRequestError) || !error.retryable) throw error;
    await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    res = await postOnce(query, variables, cache);
  }

  const json = (await res.json()) as GraphQLResponse<T>;

  if (json.errors?.length) {
    const messages = json.errors.map((e) => e.message).join("; ");
    console.warn(`repo/live: GraphQL returned errors — ${messages}`);
  }

  return json.data;
}

async function postOnce(
  query: string,
  variables: Record<string, unknown> | undefined,
  cache: GraphQLCacheOptions,
): Promise<Response> {
  let res: Response;
  try {
    res = await fetch(wpGraphqlUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
      next: { revalidate: cache.revalidate, tags: cache.tags },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (error) {
    const reason =
      error instanceof Error && error.name === "TimeoutError"
        ? `timed out after ${TIMEOUT_MS} ms`
        : `failed: ${String(error)}`;
    throw new GraphQLRequestError(`WPGraphQL request ${reason}`, undefined, true);
  }

  if (!res.ok) {
    throw new GraphQLRequestError(
      `WPGraphQL request failed: ${res.status} ${res.statusText}`,
      res.status,
      res.status >= 500,
    );
  }
  return res;
}
