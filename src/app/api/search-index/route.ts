import { NextResponse } from "next/server";
import { getSearchIndex } from "@/lib/repo";

/**
 * Backs the header's live search dropdown (src/components/layout/SearchBar.tsx).
 * The client fetches this once per page load and filters it entirely
 * client-side — instant, no round trip per keystroke. Cached at the edge so
 * repeat visits across the site don't re-hit WordPress.
 */
export const revalidate = 3600;

export async function GET() {
  const products = await getSearchIndex();
  // Don't cache an empty response — it likely means the upstream query
  // failed transiently. Caching [] would poison every search for an hour.
  const cacheHeader =
    products.length > 0
      ? "public, max-age=3600, stale-while-revalidate=86400"
      : "no-store";
  return NextResponse.json(products, {
    headers: { "Cache-Control": cacheHeader },
  });
}
