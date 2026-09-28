/**
 * Records, per translated product, which version of the Serbian source the
 * EN/DE translation was made from (WooCommerce `modified`), so the SEO
 * audit can flag translations that are older than their source.
 *
 *   node scripts/stamp-translations.mts               stamp entries without a date
 *   node scripts/stamp-translations.mts <slug> [...]  re-stamp after updating these translations
 *
 * Read-only against WordPress.
 */
import { readFileSync, writeFileSync } from "node:fs";

const base = process.env.WORDPRESS_API_URL;
if (!base) throw new Error("Set WORDPRESS_API_URL");
const force = new Set(process.argv.slice(2));

const res = await fetch(`${base.replace(/\/$/, "")}/graphql`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query: "{ products(first: 500) { nodes { slug modified } } }" }),
});
const modified = new Map<string, string>(
  ((await res.json()).data.products.nodes as { slug: string; modified: string }[]).map((p) => [p.slug, p.modified]),
);

for (const locale of ["en", "de"]) {
  const file = `src/i18n/catalog/${locale}.json`;
  const catalog = JSON.parse(readFileSync(file, "utf8"));
  let stamped = 0;
  for (const [slug, entry] of Object.entries<Record<string, string>>(catalog.products)) {
    const date = modified.get(slug);
    if (date && (!entry.sourceModified || force.has(slug))) {
      entry.sourceModified = date;
      stamped++;
    }
  }
  writeFileSync(file, JSON.stringify(catalog, null, 2) + "\n");
  console.log(`${locale}: stamped ${stamped}`);
}
