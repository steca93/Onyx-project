/**
 * JS shipped per route: fetches each page's HTML from a running server,
 * collects every same-origin <script src>, and sums raw + gzip sizes.
 * (Turbopack builds don't print per-route sizes, and @next/bundle-analyzer
 * only understands webpack builds.)
 *
 *   node scripts/route-js.mts reports/baseline
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { BASE_URL, PAGES } from "./pages.mts";

const outDir = process.argv[2] ?? "reports";
mkdirSync(outDir, { recursive: true });

const cache = new Map<string, number[]>();
async function sizeOf(src: string): Promise<number[]> {
  if (!cache.has(src)) {
    const buf = Buffer.from(await (await fetch(new URL(src, BASE_URL))).arrayBuffer());
    cache.set(src, [buf.length, gzipSync(buf).length]);
  }
  return cache.get(src)!;
}

const rows: { page: string; scripts: number; rawKb: number; gzipKb: number }[] = [];
for (const page of PAGES) {
  const html = await (await fetch(`${BASE_URL}${page.path}`)).text();
  const srcs = [...new Set([...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map((m) => m[1]))].filter(
    (s) => s.startsWith("/"),
  );
  let raw = 0;
  let gz = 0;
  for (const s of srcs) {
    const [r, g] = await sizeOf(s);
    raw += r;
    gz += g;
  }
  rows.push({ page: `${page.id} (${page.path})`, scripts: srcs.length, rawKb: raw / 1024, gzipKb: gz / 1024 });
}
writeFileSync(`${outDir}/bundle.json`, JSON.stringify(rows, null, 2));
writeFileSync(
  `${outDir}/bundle.md`,
  "# JS per route (initial HTML <script> tags)\n\n| Page | Scripts | Raw KB | Gzip KB |\n|---|---|---|---|\n" +
    rows.map((r) => `| ${r.page} | ${r.scripts} | ${r.rawKb.toFixed(1)} | ${r.gzipKb.toFixed(1)} |`).join("\n") +
    "\n",
);
console.table(rows);
