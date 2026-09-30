/**
 * Lighthouse accessibility audit (mobile) across the main templates, all
 * three locales. Prints every failing audit with the offending elements,
 * so contrast or labelling regressions show up page by page.
 *
 *   BASE_URL=http://localhost:3000 node scripts/a11y-audit.mts
 *   A11Y_PAGES=/de,/kontakt BASE_URL=… node scripts/a11y-audit.mts
 */
import * as chromeLauncher from "chrome-launcher";
import lighthouse from "lighthouse";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
/** Comma-separated paths to audit instead of the default list. */
const ONLY = process.env.A11Y_PAGES?.split(",");
const DEFAULT_PAGES = [
  "/",
  "/en",
  "/de",
  "/kategorija/ulozak-za-poliranje",
  "/proizvod/onyx-evo-clear-ppf-zastitna-folija",
  "/pretraga?q=krpa",
  "/korpa",
  "/garancija",
  "/ovlasceni-centri",
  "/postani-instalater",
  "/kontakt",
  "/cesta-pitanja",
  "/dostava-i-povracaj",
  "/uputstva-za-montazu",
  "/uslovi-koriscenja",
];
// No 404 page: Lighthouse refuses to audit non-2xx responses.
const PAGES = ONLY ?? DEFAULT_PAGES;

interface AuditItem {
  node?: { snippet?: string; nodeLabel?: string; explanation?: string };
}

const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless=new", "--no-sandbox"] });
let failures = 0;
try {
  for (const path of PAGES) {
    const result = await lighthouse(`${BASE_URL}${path}`, {
      port: chrome.port,
      onlyCategories: ["accessibility"],
      logLevel: "error",
    });
    if (!result) throw new Error(`no result for ${path}`);
    const { lhr } = result;
    const score = Math.round((lhr.categories.accessibility.score ?? 0) * 100);
    const failed = Object.values(lhr.audits).filter(
      (a) => a.score !== null && a.score < 1 && a.scoreDisplayMode === "binary",
    );
    console.log(`\n${path} — accessibility ${score}`);
    for (const audit of failed) {
      failures++;
      console.log(`  ✘ ${audit.id}: ${audit.title}`);
      const items = ((audit.details as { items?: AuditItem[] } | undefined)?.items ?? []).slice(0, 12);
      for (const item of items) {
        const label = item.node?.nodeLabel?.replace(/\s+/g, " ").slice(0, 60);
        const why = item.node?.explanation?.match(/contrast of ([\d.]+)/)?.[1];
        console.log(`      - ${label ?? item.node?.snippet?.slice(0, 80)}${why ? `  (contrast ${why})` : ""}`);
      }
    }
  }
} finally {
  await chrome.kill();
}
console.log(`\n${failures} failing audits`);
