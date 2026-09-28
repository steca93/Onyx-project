/**
 * Read-only SEO content audit of the live WooCommerce catalog, per locale.
 * Serbian comes from WooCommerce; EN/DE from the storefront's translation
 * overlay (src/i18n/catalog). Writes reports/seo-content-audit.csv (one row
 * per issue per item per locale; `all` = locale-independent) and
 * reports/seo-content-audit.json (raw data, input for suggestions).
 * Never writes to WordPress.
 *
 *   WORDPRESS_API_URL=https://… node scripts/seo-audit.mts
 */
import { readFileSync, writeFileSync } from "node:fs";

const base = process.env.WORDPRESS_API_URL;
if (!base) throw new Error("Set WORDPRESS_API_URL");

const QUERY = /* GraphQL */ `
  query SeoAudit {
    products(first: 200) {
      nodes {
        __typename
        name
        slug
        status
        modified
        shortDescription
        description
        image { sourceUrl altText }
        galleryImages { nodes { sourceUrl altText } }
        productCategories { nodes { slug name } }
        ... on SimpleProduct { sku price(format: RAW) }
        ... on VariableProduct { price(format: RAW) }
      }
    }
    productCategories(first: 200, where: { hideEmpty: false }) {
      nodes { name slug count description image { sourceUrl altText } parent { node { slug } } }
    }
  }
`;

interface Img { sourceUrl: string; altText: string | null }
interface P {
  __typename: string; name: string; slug: string; status: string; modified: string;
  shortDescription: string | null; description: string | null;
  image: Img | null; galleryImages: { nodes: Img[] };
  productCategories: { nodes: { slug: string; name: string }[] };
  sku?: string | null; price?: string | null;
}
interface C { name: string; slug: string; count: number | null; description: string | null; image: Img | null; parent: { node: { slug: string } } | null }

const res = await fetch(`${base.replace(/\/$/, "")}/graphql`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query: QUERY }),
});
const json = await res.json();
if (json.errors) throw new Error(JSON.stringify(json.errors));
const products: P[] = json.data.products.nodes;
const categories: C[] = json.data.productCategories.nodes.filter((c: C) => c.slug !== "uncategorized");

const text = (html: string | null) =>
  (html ?? "").replace(/<[^>]+>/g, " ").replace(/&[a-z#0-9]+;/gi, " ").replace(/\s+/g, " ").trim();
const words = (s: string) => (s ? s.split(" ").length : 0);
const TITLE_SUFFIX_LEN = " | ONYX EVOLUTION".length;

type Row = { type: string; slug: string; locale: string; name: string; severity: "high" | "medium" | "low"; issue: string; detail: string };
const rows: Row[] = [];
const add = (r: Row) => rows.push(r);

// Duplicate-content helpers.
const byShort = new Map<string, string[]>();
const byName = new Map<string, string[]>();

for (const p of products) {
  const base = { type: "product", slug: p.slug, name: p.name, locale: "sr" };
  const shared = { ...base, locale: "all" };
  const short = text(p.shortDescription);
  const long = text(p.description);
  if (!short) add({ ...base, severity: "medium", issue: "missing_short_description", detail: "Used for meta description + listing snippet" });
  if (!long) add({ ...base, severity: "high", issue: "missing_description", detail: "No product copy at all" });
  else if (words(long) < 150) add({ ...base, severity: "medium", issue: "thin_content", detail: `${words(long)} words in description (< 150)` });
  if (!p.image?.sourceUrl) add({ ...shared, severity: "high", issue: "missing_image", detail: "No featured image" });
  else if (!p.image.altText?.trim()) add({ ...shared, severity: "low", issue: "missing_image_alt", detail: "Featured image has no alt (storefront falls back to product name)" });
  const galleryNoAlt = p.galleryImages.nodes.filter((g) => !g.altText?.trim()).length;
  if (galleryNoAlt) add({ ...shared, severity: "low", issue: "missing_gallery_alt", detail: `${galleryNoAlt} of ${p.galleryImages.nodes.length} gallery images without alt` });
  if (p.__typename === "SimpleProduct" && !p.sku) add({ ...shared, severity: "medium", issue: "missing_sku", detail: "Needed for Product structured data" });
  if (!p.price) add({ ...shared, severity: "high", issue: "missing_price", detail: "No Offer in structured data; not purchasable" });
  if (p.productCategories.nodes.length === 0 || p.productCategories.nodes.every((c) => c.slug === "uncategorized"))
    add({ ...shared, severity: "high", issue: "missing_category", detail: "Only 'Uncategorized'" });
  const titleLen = p.name.length + TITLE_SUFFIX_LEN;
  if (p.name.length < 20) add({ ...base, severity: "medium", issue: "title_too_short", detail: `Name is ${p.name.length} chars — weak as a page title` });
  if (titleLen > 70) add({ ...base, severity: "low", issue: "title_too_long", detail: `Name is ${p.name.length} chars (${titleLen} with brand) — truncated in search results` });
  const metaSource = short || long;
  if (metaSource && metaSource.length < 70) add({ ...base, severity: "medium", issue: "meta_description_too_short", detail: `Best available description text is ${metaSource.length} chars` });
  if (/[^\x00-\x7f]/.test(p.slug)) add({ ...shared, severity: "medium", issue: "slug_non_ascii", detail: p.slug });
  if (p.slug.length > 60) add({ ...shared, severity: "low", issue: "slug_too_long", detail: `${p.slug.length} chars` });
  if (/(^|-)(sundjer|sunder)(-|$)/.test(p.slug) && /sundjer/.test(p.slug))
    add({ ...shared, severity: "low", issue: "slug_spelling_variant", detail: "Uses 'sundjer' — other slugs use 'sunder' (from 'sunđer'); pick one form" });
  if (/NAPOMENA/i.test(long) || /NAPOMENA/i.test(short)) add({ ...base, severity: "high", issue: "internal_note_in_copy", detail: "Contains an internal 'NAPOMENA' note visible to customers" });
  if (short) byShort.set(short, [...(byShort.get(short) ?? []), p.slug]);
  byName.set(p.name.toLowerCase(), [...(byName.get(p.name.toLowerCase()) ?? []), p.slug]);
  // Product whose name is identical to a category name = likely a placeholder.
  if (categories.some((c) => c.name.toLowerCase() === p.name.toLowerCase()))
    add({ ...shared, severity: "high", issue: "placeholder_product", detail: "Product has the same name as a category and almost no content — likely a placeholder; publish-check or remove" });
}
for (const [, slugs] of byShort) if (slugs.length > 1)
  for (const slug of slugs) add({ type: "product", slug, locale: "sr", name: products.find((p) => p.slug === slug)!.name, severity: "high", issue: "duplicate_short_description", detail: `Same short description as: ${slugs.filter((s) => s !== slug).join(", ")}` });
for (const [, slugs] of byName) if (slugs.length > 1)
  for (const slug of slugs) add({ type: "product", slug, locale: "sr", name: products.find((p) => p.slug === slug)!.name, severity: "high", issue: "duplicate_title", detail: `Same name as: ${slugs.filter((s) => s !== slug).join(", ")}` });

for (const c of categories) {
  const base = { type: "category", slug: c.slug, name: c.name, locale: "sr" };
  if (!text(c.description)) add({ ...base, severity: "medium", issue: "missing_description", detail: "No intro text — category page is a bare product grid" });
  if (!c.image?.sourceUrl) add({ ...base, locale: "all", severity: "low", issue: "missing_image", detail: "No category image (used for OG image and category tiles)" });
  if (!c.count && !categories.some((x) => x.parent?.node.slug === c.slug))
    add({ ...base, locale: "all", severity: "medium", issue: "empty_category", detail: "No products and no subcategories" });
}

// Near-duplicate slugs (same after removing digits/dashes).
const norm = (s: string) => s.replace(/[^a-z]/g, "");
const seen = new Map<string, string>();
for (const x of [...products.map((p) => ({ t: "product", s: p.slug, n: p.name })), ...categories.map((c) => ({ t: "category", s: c.slug, n: c.name }))]) {
  const k = `${x.t}:${norm(x.s)}`;
  if (seen.has(k)) add({ type: x.t, slug: x.s, locale: "all", name: x.n, severity: "medium", issue: "slug_near_duplicate", detail: `Near-duplicate of ${seen.get(k)}` });
  else seen.set(k, x.s);
}
// Product slug identical to a category slug (e.g. /proizvod/poliranje vs /kategorija/poliranje).
for (const p of products) if (categories.some((c) => c.slug === p.slug))
  add({ type: "product", slug: p.slug, locale: "all", name: p.name, severity: "medium", issue: "slug_same_as_category", detail: `Product and category share slug '${p.slug}'` });

// ---------- EN/DE (translation overlay) ----------
interface T { name?: string; shortDescription?: string; description?: string; sourceModified?: string }
interface Overlay { products: Record<string, T>; categories: Record<string, { name?: string; description?: string }> }
// Serbian-only letters, or common Serbian function words, inside EN/DE text.
const SERBIAN = /[čćđšžČĆĐŠŽ]|\b(je|i|za|sa|od|koji|koja|ili|nije|kao|se)\b/;
const serbianHits = (value: string | undefined) => {
  const t = text(value ?? null);
  const words = t.match(new RegExp(SERBIAN.source, "g")) ?? [];
  return words.length >= 3 || /[čćđšžČĆĐŠŽ]/.test(t) ? words.slice(0, 5).join(" ") : "";
};

for (const locale of ["en", "de"] as const) {
  const overlay: Overlay = JSON.parse(readFileSync(`src/i18n/catalog/${locale}.json`, "utf8"));
  for (const p of products) {
    const t = overlay.products[p.slug];
    const base = { type: "product", slug: p.slug, locale, name: t?.name ?? p.name };
    if (!t?.name) {
      add({ ...base, severity: "high", issue: "missing_translation", detail: "No translation — page 404s in this locale and is excluded from hreflang/sitemap" });
      continue;
    }
    if (t.sourceModified && new Date(p.modified) > new Date(t.sourceModified))
      add({ ...base, severity: "medium", issue: "stale_translation", detail: `Serbian source modified ${p.modified}, translation made from ${t.sourceModified}` });
    else if (!t.sourceModified)
      add({ ...base, severity: "low", issue: "translation_not_stamped", detail: "Unknown source version — run npm run i18n:stamp" });
    if (text(p.shortDescription) && !text(t.shortDescription ?? null))
      add({ ...base, severity: "medium", issue: "missing_short_description", detail: "Serbian has one; this locale shows none and uses the meta template" });
    if (text(p.description) && !text(t.description ?? null))
      add({ ...base, severity: "high", issue: "missing_description", detail: "Serbian has one; this locale shows 'coming soon'" });
    if (/\b(NAPOMENA|NOTE|HINWEIS)\s*:/.test(`${t.shortDescription ?? ""} ${t.description ?? ""}`))
      add({ ...base, severity: "high", issue: "internal_note_in_copy", detail: "Translated copy contains an internal note visible to customers" });
    for (const field of ["name", "shortDescription", "description"] as const) {
      const hits = serbianHits(t[field]);
      if (hits) add({ ...base, severity: "medium", issue: "serbian_text_in_translation", detail: `${field}: ${hits}` });
    }
    const titleLen = t.name.length + TITLE_SUFFIX_LEN;
    if (titleLen > 70) add({ ...base, severity: "low", issue: "title_too_long", detail: `Name is ${t.name.length} chars (${titleLen} with brand)` });
    const meta = text(t.shortDescription ?? null) || text(t.description ?? null);
    if (meta && meta.length < 70) add({ ...base, severity: "medium", issue: "meta_description_too_short", detail: `${meta.length} chars` });
    if (text(t.description ?? null) && words(text(t.description ?? null)) < 150)
      add({ ...base, severity: "medium", issue: "thin_content", detail: `${words(text(t.description ?? null))} words in description (< 150)` });
  }
  for (const c of categories) {
    const t = overlay.categories[c.slug];
    const base = { type: "category", slug: c.slug, locale, name: t?.name ?? c.name };
    if (!t?.name) add({ ...base, severity: "high", issue: "missing_translation", detail: "No translation — category 404s in this locale" });
    else if (!t.description) add({ ...base, severity: "medium", issue: "missing_description", detail: "No intro text in this locale" });
  }
}

// ---------- UI strings (messages/*.json) ----------
const flatten = (obj: unknown, prefix = ""): Record<string, string> =>
  Object.entries(obj as Record<string, unknown>).reduce<Record<string, string>>((acc, [k, v]) => {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object") Object.assign(acc, flatten(v, key));
    else acc[key] = String(v);
    return acc;
  }, {});
const sr = flatten(JSON.parse(readFileSync("messages/sr.json", "utf8")));
for (const locale of ["en", "de"] as const) {
  const msgs = flatten(JSON.parse(readFileSync(`messages/${locale}.json`, "utf8")));
  for (const key of Object.keys(sr)) {
    if (!(key in msgs)) add({ type: "ui-string", slug: key, locale, name: key, severity: "high", issue: "missing_translation", detail: "Key missing in this locale" });
    else if (msgs[key] === sr[key] && /[a-zčćđšž]{4,}/i.test(sr[key]) && serbianHits(sr[key]))
      add({ type: "ui-string", slug: key, locale, name: key, severity: "medium", issue: "serbian_text_in_translation", detail: `Identical to Serbian: "${sr[key].slice(0, 60)}"` });
  }
}

const order = { high: 0, medium: 1, low: 2 };
rows.sort(
  (a, b) =>
    order[a.severity] - order[b.severity] || a.type.localeCompare(b.type) || a.slug.localeCompare(b.slug) || a.locale.localeCompare(b.locale),
);
const csv = (v: string) => `"${v.replace(/"/g, '""')}"`;
writeFileSync(
  "reports/seo-content-audit.csv",
  "\uFEFF" +
    ["type,slug,locale,name,severity,issue,detail", ...rows.map((r) => [r.type, r.slug, r.locale, r.name, r.severity, r.issue, r.detail].map(csv).join(","))].join("\n") +
    "\n",
);
writeFileSync("reports/seo-content-audit.json", JSON.stringify({ products, categories, issues: rows }, null, 2));
const counts = rows.reduce<Record<string, number>>(
  (acc, r) => ((acc[`${r.locale} ${r.type}:${r.issue}`] = (acc[`${r.locale} ${r.type}:${r.issue}`] ?? 0) + 1), acc),
  {},
);
console.log(`${products.length} products, ${categories.length} categories, ${rows.length} issues`);
console.table(counts);
