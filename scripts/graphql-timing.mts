/**
 * Times every WPGraphQL query the storefront issues against the real
 * backend and writes a markdown table. Sequential, with a pause between
 * requests — this runs against the production WordPress, don't hammer it.
 *
 *   WORDPRESS_API_URL=https://… node scripts/graphql-timing.mts reports/baseline/graphql.md
 */
import { writeFileSync } from "node:fs";
import * as Q from "../src/lib/repo/live/queries.ts";

const base = process.env.WORDPRESS_API_URL ?? process.env.WP_API_URL;
if (!base) throw new Error("Set WORDPRESS_API_URL");
const endpoint = `${base.replace(/\/$/, "")}/graphql`;
const out = process.argv[2] ?? "reports/graphql.md";
const RUNS = 3;
const PAUSE_MS = 400;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Representative calls, mirroring what each page actually issues.
const cases: { name: string; usedBy: string; query: string; variables: Record<string, unknown> }[] = [
  { name: "Categories", usedBy: "layout (every page), home, sitemap", query: Q.CATEGORIES_QUERY, variables: { first: 50 } },
  { name: "CategoryBySlug", usedBy: "category page", query: Q.CATEGORY_BY_SLUG_QUERY, variables: { slug: "ulozak-za-poliranje" } },
  { name: "Products (category, 7)", usedBy: "category page p1", query: Q.PRODUCTS_QUERY, variables: { first: 7, where: { categoryIn: ["ulozak-za-poliranje"], orderby: [{ field: "MENU_ORDER", order: "ASC" }] } } },
  { name: "Products (featured, 8)", usedBy: "home bestsellers", query: Q.PRODUCTS_QUERY, variables: { first: 8, where: { featured: true, orderby: [{ field: "DATE", order: "DESC" }] } } },
  { name: "Products (newest, 9)", usedBy: "home fallback / search", query: Q.PRODUCTS_QUERY, variables: { first: 9, where: { orderby: [{ field: "DATE", order: "DESC" }] } } },
  { name: "ProductBySlug (+related)", usedBy: "product page", query: Q.PRODUCT_BY_SLUG_QUERY, variables: { slug: "onyx-evo-clear-ppf-zastitna-folija" } },
  { name: "AllProductSlugs", usedBy: "generateStaticParams, sitemap", query: Q.ALL_PRODUCT_SLUGS_QUERY, variables: { first: 100, after: null } },
  { name: "SearchIndex", usedBy: "/api/search-index, EN/DE search", query: Q.SEARCH_INDEX_QUERY, variables: { first: 100, after: null } },
];

function countNodes(value: unknown): number {
  if (Array.isArray(value)) return value.reduce((n, v) => n + countNodes(v), 0);
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const own = Array.isArray(obj.nodes) ? obj.nodes.length : 0;
    return own + Object.values(obj).reduce<number>((n, v) => n + countNodes(v), 0);
  }
  return 0;
}

const rows: string[] = [];
for (const c of cases) {
  const times: number[] = [];
  let bytes = 0;
  let nodes = 0;
  let errors = "";
  for (let i = 0; i < RUNS; i++) {
    const t0 = performance.now();
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: c.query, variables: c.variables }),
    });
    const text = await res.text();
    times.push(performance.now() - t0);
    bytes = Buffer.byteLength(text);
    const json = JSON.parse(text);
    nodes = countNodes(json.data);
    errors = json.errors?.map((e: { message: string }) => e.message).join("; ") ?? "";
    await sleep(PAUSE_MS);
  }
  times.sort((a, b) => a - b);
  const median = times[Math.floor(RUNS / 2)];
  rows.push(
    `| ${c.name} | ${c.usedBy} | ${median.toFixed(0)} | ${times[0].toFixed(0)}–${times[RUNS - 1].toFixed(0)} | ${(bytes / 1024).toFixed(1)} | ${nodes} | ${errors || "—"} |`,
  );
  console.log(rows.at(-1));
}

writeFileSync(
  out,
  `# WPGraphQL timing\n\nEndpoint: \`${new URL(endpoint).host}\` · ${RUNS} sequential runs each, median shown · ${new Date().toISOString()}\n\n` +
    "| Query | Used by | Median ms | Range ms | Size KB | Nodes | Errors |\n|---|---|---|---|---|---|---|\n" +
    rows.join("\n") +
    "\n",
);
console.log(`wrote ${out}`);
