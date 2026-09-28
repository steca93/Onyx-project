import type { APIRequestContext } from "@playwright/test";

/** Real live-catalog items the tests rely on (override if they change). */
export const FIXTURES = {
  productSlug: process.env.SEO_TEST_PRODUCT ?? "onyx-evo-clear-ppf-zastitna-folija",
  categorySlug: process.env.SEO_TEST_CATEGORY ?? "ulozak-za-poliranje",
};

export interface ParsedPage {
  status: number;
  headers: Record<string, string>;
  html: string;
  lang: string | null;
  title: string | null;
  description: string | null;
  canonical: string | null;
  robots: string | null;
  ogImage: string | null;
  ogLocale: string | null;
  hreflang: Record<string, string>;
  jsonLd: Record<string, unknown>[];
  h1Count: number;
}

const decode = (s: string) =>
  s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");

function meta(head: string, attr: "name" | "property", key: string): string | null {
  const m =
    new RegExp(`<meta ${attr}="${key}" content="([^"]*)"`).exec(head) ??
    new RegExp(`<meta content="([^"]*)" ${attr}="${key}"`).exec(head);
  return m ? decode(m[1]) : null;
}

export async function fetchPage(request: APIRequestContext, path: string): Promise<ParsedPage> {
  const res = await request.get(path, { maxRedirects: 0 });
  const html = await res.text();
  const head = html.split("</head>")[0] ?? "";
  const hreflang: Record<string, string> = {};
  for (const m of head.matchAll(/<link rel="alternate" hrefLang="([^"]+)" href="([^"]+)"/g)) hreflang[m[1]] = decode(m[2]);
  const jsonLd = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap((m) => {
    const parsed = JSON.parse(m[1]);
    return Array.isArray(parsed) ? parsed : [parsed];
  });
  return {
    status: res.status(),
    headers: res.headers(),
    html,
    lang: /<html[^>]* lang="([^"]+)"/.exec(html)?.[1] ?? null,
    title: /<title>([^<]*)<\/title>/.exec(head)?.[1] ? decode(/<title>([^<]*)<\/title>/.exec(head)![1]) : null,
    description: meta(head, "name", "description"),
    canonical: /<link rel="canonical" href="([^"]+)"/.exec(head)?.[1] ? decode(/<link rel="canonical" href="([^"]+)"/.exec(head)![1]) : null,
    robots: meta(head, "name", "robots"),
    ogImage: meta(head, "property", "og:image"),
    ogLocale: meta(head, "property", "og:locale"),
    hreflang,
    jsonLd,
    h1Count: (html.split("<body")[1] ?? "").match(/<h1[\s>]/g)?.length ?? 0,
  };
}

/** Every JSON-LD node of a type, including nested ones (Product lives in
 * WebPage.mainEntity, BreadcrumbList in WebPage.breadcrumb). */
export function byType(page: ParsedPage, type: string): Record<string, unknown>[] {
  const found: Record<string, unknown>[] = [];
  const walk = (value: unknown) => {
    if (Array.isArray(value)) return value.forEach(walk);
    if (value && typeof value === "object") {
      const obj = value as Record<string, unknown>;
      if (obj["@type"] === type) found.push(obj);
      Object.values(obj).forEach(walk);
    }
  };
  walk(page.jsonLd);
  return found;
}

export const allTypes = (page: ParsedPage) =>
  ["Product", "BreadcrumbList", "ItemList", "Organization", "WebSite", "WebPage", "CollectionPage"].filter(
    (type) => byType(page, type).length > 0,
  );
