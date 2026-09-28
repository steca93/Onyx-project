/**
 * Lighthouse (mobile preset, simulated throttling) against a running
 * `next start`. 3 runs per page; the run with the median performance score
 * is kept.
 *
 *   node scripts/lighthouse.mts reports/baseline
 */
import { mkdirSync, writeFileSync } from "node:fs";
import * as chromeLauncher from "chrome-launcher";
import lighthouse from "lighthouse";
import type { Result as LHResult } from "lighthouse";
import { BASE_URL, PAGES } from "./pages.mts";

const outDir = process.argv[2] ?? "reports/lighthouse";
const RUNS = 3;
mkdirSync(outDir, { recursive: true });

interface Summary {
  page: string;
  score: number;
  lcp: number;
  cls: number;
  tbt: number;
  fcp: number;
  si: number;
  jsKb: number;
  totalKb: number;
}

const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless=new", "--no-sandbox"] });
const summaries: Summary[] = [];

try {
  for (const page of PAGES) {
    const runs: { lhr: LHResult; report: string }[] = [];
    for (let i = 0; i < RUNS; i++) {
      const result = await lighthouse(`${BASE_URL}${page.path}`, {
        port: chrome.port,
        output: "json",
        onlyCategories: ["performance", "seo", "best-practices", "accessibility"],
        logLevel: "error",
      });
      if (!result) throw new Error(`no result for ${page.path}`);
      runs.push({ lhr: result.lhr, report: result.report as string });
    }
    runs.sort((a, b) => (a.lhr.categories.performance.score ?? 0) - (b.lhr.categories.performance.score ?? 0));
    const { lhr, report } = runs[Math.floor(RUNS / 2)];
    writeFileSync(`${outDir}/lighthouse-${page.id}.json`, report);

    const a = lhr.audits;
    const byType = (type: string) =>
      ((a["resource-summary"].details as unknown as { items: unknown[] }).items as { resourceType: string; transferSize: number }[]).find(
        (i) => i.resourceType === type,
      )?.transferSize ?? 0;
    const s: Summary = {
      page: `${page.id} (${page.path})`,
      score: Math.round((lhr.categories.performance.score ?? 0) * 100),
      lcp: a["largest-contentful-paint"].numericValue ?? 0,
      cls: a["cumulative-layout-shift"].numericValue ?? 0,
      tbt: a["total-blocking-time"].numericValue ?? 0,
      fcp: a["first-contentful-paint"].numericValue ?? 0,
      si: a["speed-index"].numericValue ?? 0,
      jsKb: byType("script") / 1024,
      totalKb: byType("total") / 1024,
    };
    summaries.push(s);
    console.log(s);
  }
} finally {
  await chrome.kill();
}

writeFileSync(`${outDir}/lighthouse-summary.json`, JSON.stringify(summaries, null, 2));
writeFileSync(
  `${outDir}/lighthouse.md`,
  `# Lighthouse (mobile, median of ${RUNS}) — ${new Date().toISOString()}\n\nBase URL: ${BASE_URL}\n\n` +
    "| Page | Perf | LCP ms | CLS | TBT ms | FCP ms | SI ms | JS KB (transfer) | Total KB |\n|---|---|---|---|---|---|---|---|---|\n" +
    summaries
      .map(
        (s) =>
          `| ${s.page} | ${s.score} | ${s.lcp.toFixed(0)} | ${s.cls.toFixed(3)} | ${s.tbt.toFixed(0)} | ${s.fcp.toFixed(0)} | ${s.si.toFixed(0)} | ${s.jsKb.toFixed(1)} | ${s.totalKb.toFixed(1)} |`,
      )
      .join("\n") +
    "\n",
);
console.log(`wrote ${outDir}/lighthouse.md`);
