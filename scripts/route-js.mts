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

const rows: {
  page: string;
  scripts: number;
  rawKb: number;
  gzipKb: number;
  htmlKb: number;
  htmlGzipKb: number;
  /** Serialized next-intl messages embedded in the page (RSC payload). */
  messagesKb: number;
}[] = [];

/** Size of the `messages` object the NextIntlClientProvider serializes into
 * the RSC payload, found via a key every page's messages contain. */
function embeddedMessagesKb(html: string): number {
  const payload = [...html.matchAll(/self\.__next_f\.push\(\[1,"((?:[^"\\]|\\.)*)"\]\)/g)]
    .map((m) => JSON.parse(`"${m[1]}"`) as string)
    .join("");
  const start = payload.indexOf('"messages":{');
  if (start === -1) return 0;
  let depth = 0;
  for (let i = start + '"messages":'.length; i < payload.length; i++) {
    const ch = payload[i];
    if (ch === "{") depth++;
    else if (ch === "}" && --depth === 0) return Buffer.byteLength(payload.slice(start, i + 1)) / 1024;
    else if (ch === '"') {
      // skip string contents
      for (i++; i < payload.length && payload[i] !== '"'; i++) if (payload[i] === "\\") i++;
    }
  }
  return 0;
}

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
  rows.push({
    page: `${page.id} (${page.path})`,
    scripts: srcs.length,
    rawKb: raw / 1024,
    gzipKb: gz / 1024,
    htmlKb: Buffer.byteLength(html) / 1024,
    htmlGzipKb: gzipSync(html).length / 1024,
    messagesKb: embeddedMessagesKb(html),
  });
}
writeFileSync(`${outDir}/bundle.json`, JSON.stringify(rows, null, 2));
writeFileSync(
  `${outDir}/bundle.md`,
  "# JS per route (initial HTML <script> tags) + HTML and embedded translation messages\n\n" +
    "| Page | Scripts | JS raw KB | JS gzip KB | HTML KB | HTML gzip KB | Embedded messages KB |\n|---|---|---|---|---|---|---|\n" +
    rows
      .map(
        (r) =>
          `| ${r.page} | ${r.scripts} | ${r.rawKb.toFixed(1)} | ${r.gzipKb.toFixed(1)} | ${r.htmlKb.toFixed(1)} | ${r.htmlGzipKb.toFixed(1)} | ${r.messagesKb.toFixed(1)} |`,
      )
      .join("\n") +
    "\n",
);
console.table(rows);
