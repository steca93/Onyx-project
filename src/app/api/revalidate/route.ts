import { timingSafeEqual } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { TAGS } from "@/lib/repo/live/cache";

/**
 * On-demand cache invalidation, called by WordPress
 * (wp-backend/mu-plugins/onyx-revalidate.php) whenever catalog data changes.
 *
 *   POST /api/revalidate
 *   Authorization: Bearer <REVALIDATE_SECRET>
 *   { "type": "product", "id": 123, "slug": "…", "categories": ["…"] }
 *   { "type": "category", "id": 45, "slug": "…" }
 *
 * The slug is the cache key: catalog data is fetched once (Serbian source)
 * and the EN/DE overlay is applied in memory, so one tag covers all three
 * locales' pages. `id` is accepted for logging/traceability.
 *   { "type": "menu" } | { "type": "settings" } | { "type": "all" }
 */
export const dynamic = "force-dynamic";

type Payload =
  | { type: "product"; id?: number; slug?: string; categories?: string[] }
  | { type: "category"; id?: number; slug?: string }
  | { type: "menu" | "settings" | "all" };

function authorized(request: NextRequest): boolean {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) return false;
  const header = request.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const a = Buffer.from(token);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}

function tagsFor(payload: Payload): string[] {
  switch (payload.type) {
    case "product":
      // The product itself, every listing (home, search, category pages)
      // and each category page it appears on.
      return [
        TAGS.products,
        ...(payload.slug ? [TAGS.product(payload.slug)] : []),
        ...(payload.categories ?? []).map(TAGS.category),
      ];
    case "category":
      return [TAGS.categories, TAGS.menu, ...(payload.slug ? [TAGS.category(payload.slug)] : [])];
    case "menu":
      return [TAGS.menu];
    case "settings":
      return [TAGS.settings];
    case "all":
      return [TAGS.products, TAGS.categories, TAGS.menu, TAGS.settings];
  }
}

const noStore = { "Cache-Control": "private, no-store" };

export async function POST(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401, headers: noStore });
  }

  let payload: Payload;
  try {
    payload = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid JSON" }, { status: 400, headers: noStore });
  }

  const validTypes = ["product", "category", "menu", "settings", "all"];
  if (!payload || !validTypes.includes(payload.type)) {
    return NextResponse.json({ ok: false, error: "unknown type" }, { status: 400, headers: noStore });
  }

  const tags = tagsFor(payload);
  // `expire: 0` — webhook case: the next request must see fresh data rather
  // than a stale-while-revalidate copy (Next 16 revalidateTag semantics).
  for (const tag of tags) revalidateTag(tag, { expire: 0 });
  // Sitemap lists every product/category; cheap to regenerate.
  if (payload.type === "product" || payload.type === "category" || payload.type === "all") {
    revalidatePath("/sitemap.xml");
  }

  const id = "id" in payload ? payload.id : undefined;
  console.info(`revalidate: ${payload.type}${id ? ` #${id}` : ""} → ${tags.join(", ")}`);
  return NextResponse.json({ ok: true, tags }, { headers: noStore });
}
