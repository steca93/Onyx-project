import { expect, test } from "@playwright/test";
import { fetchPage, FIXTURES } from "./helpers";

// Non-production (local / Vercel preview) must never be indexable.
for (const path of ["/", `/proizvod/${FIXTURES.productSlug}`, `/en/category/${FIXTURES.categorySlug}`]) {
  test(`${path} is noindex outside production`, async ({ request }) => {
    const page = await fetchPage(request, path);
    expect(page.status).toBe(200);
    expect(page.robots).toContain("noindex");
    expect(page.headers["x-robots-tag"]).toContain("noindex");
  });
}

test("robots.txt disallows everything outside production", async ({ request }) => {
  const body = await (await request.get("/robots.txt")).text();
  expect(body).toMatch(/^Disallow: \/$/m);
  expect(body).not.toContain("Sitemap:");
});
