import { expect, test } from "@playwright/test";
import { HIDDEN_TRANSLATION } from "../../playwright.config";
import { allTypes, byType, fetchPage, FIXTURES } from "./helpers";

const { productSlug, categorySlug } = FIXTURES;

const PAGES = [
  { name: "home (sr)", path: "/", locale: "sr", og: "sr_RS", ld: ["Organization", "WebSite"] },
  { name: "home (en)", path: "/en", locale: "en", og: "en_US", ld: ["Organization", "WebSite"] },
  { name: "home (de)", path: "/de", locale: "de", og: "de_DE", ld: ["Organization", "WebSite"] },
  { name: "category (sr)", path: `/kategorija/${categorySlug}`, locale: "sr", og: "sr_RS", ld: ["CollectionPage", "BreadcrumbList", "ItemList"] },
  { name: "category (en)", path: `/en/category/${categorySlug}`, locale: "en", og: "en_US", ld: ["CollectionPage", "BreadcrumbList", "ItemList"] },
  { name: "category (de)", path: `/de/kategorie/${categorySlug}`, locale: "de", og: "de_DE", ld: ["CollectionPage", "BreadcrumbList", "ItemList"] },
  { name: "product (sr)", path: `/proizvod/${productSlug}`, locale: "sr", og: "sr_RS", ld: ["WebPage", "Product", "BreadcrumbList"] },
  { name: "product (en)", path: `/en/product/${productSlug}`, locale: "en", og: "en_US", ld: ["WebPage", "Product", "BreadcrumbList"] },
  { name: "product (de)", path: `/de/produkt/${productSlug}`, locale: "de", og: "de_DE", ld: ["WebPage", "Product", "BreadcrumbList"] },
] as const;

const OG_LOCALES = { sr: "sr_RS", en: "en_US", de: "de_DE" } as const;

for (const p of PAGES) {
  test.describe(p.name, () => {
    test("is indexable with complete head metadata", async ({ request, baseURL }) => {
      const page = await fetchPage(request, p.path);
      expect(page.status).toBe(200);
      expect(page.lang).toBe(p.locale);

      expect(page.title, "title").toBeTruthy();
      expect(page.title!.length).toBeGreaterThanOrEqual(20);
      expect(page.title!.length).toBeLessThanOrEqual(70);

      expect(page.description, "meta description").toBeTruthy();
      expect(page.description!.length).toBeGreaterThanOrEqual(50);
      expect(page.description!.length).toBeLessThanOrEqual(160);

      expect(page.canonical).toBe(`${baseURL}${p.path === "/" ? "" : p.path}`);
      expect(page.robots ?? "").not.toContain("noindex");
      expect(page.headers["x-robots-tag"]).toBeUndefined();

      // Share image must come from the storefront itself, never WordPress.
      expect(page.ogImage, "og:image").toBeTruthy();
      expect(new URL(page.ogImage!).origin).toBe(baseURL);
      expect(page.ogLocale).toBe(p.og);
      expect(page.ogLocaleAlternates.sort()).toEqual(
        Object.entries(OG_LOCALES)
          .filter(([l]) => l !== p.locale)
          .map(([, og]) => og)
          .sort(),
      );

      expect(Object.keys(page.hreflang).sort()).toEqual(["de", "en", "sr", "x-default"]);
      expect(page.hreflang[p.locale]).toBe(page.canonical);

      expect(page.h1Count, "exactly one <h1>").toBe(1);
    });

    test("hreflang is reciprocal (every alternate links back)", async ({ request }) => {
      const page = await fetchPage(request, p.path);
      for (const [lang, url] of Object.entries(page.hreflang)) {
        if (lang === "x-default") continue;
        const alt = await fetchPage(request, new URL(url).pathname);
        expect(alt.status, `${lang} alternate loads`).toBe(200);
        expect(alt.lang).toBe(lang);
        expect(alt.canonical, `${lang} alternate is self-canonical`).toBe(url);
        expect(alt.hreflang, `${lang} alternate lists the same set`).toEqual(page.hreflang);
      }
    });

    test("language switcher links to the hreflang alternates", async ({ request, baseURL }) => {
      const page = await fetchPage(request, p.path);
      const links = Object.fromEntries(
        [...page.html.matchAll(/<a href="([^"]+)" hrefLang="([^"]+)"/g)].map((m) => [m[2], m[1]]),
      );
      for (const [lang, url] of Object.entries(page.hreflang)) {
        if (lang === "x-default" || lang === p.locale) continue;
        expect(links[lang], `switcher link to ${lang}`).toBe(url.replace(baseURL!, "") || "/");
      }
    });

    test("has valid JSON-LD", async ({ request }) => {
      const page = await fetchPage(request, p.path);
      const types = allTypes(page);
      for (const type of p.ld) expect(types).toContain(type);
      for (const obj of page.jsonLd) expect(obj["@context"]).toBe("https://schema.org");
      // The page's language rides on the WebPage/CollectionPage/WebSite node.
      for (const type of ["WebPage", "CollectionPage", "WebSite"])
        for (const node of byType(page, type)) expect(node.inLanguage, `${type}.inLanguage`).toBe(p.locale);

      for (const crumbs of byType(page, "BreadcrumbList")) {
        const items = crumbs.itemListElement as { position: number; name: string; item: string }[];
        expect(items.length).toBeGreaterThanOrEqual(2);
        items.forEach((it, i) => {
          expect(it.position).toBe(i + 1);
          expect(it.name).toBeTruthy();
          expect(it.item).toMatch(/^https?:\/\//);
        });
      }
    });
  });
}

test("Product JSON-LD has a valid Offer", async ({ request, baseURL }) => {
  const page = await fetchPage(request, `/proizvod/${productSlug}`);
  const [product] = byType(page, "Product") as unknown as {
    name: string;
    brand: unknown;
    url: string;
    image: string[];
    aggregateRating?: unknown;
    offers: { "@type": string; priceCurrency: string; price?: unknown; lowPrice?: unknown; availability: string };
  }[];
  expect(product.name).toBeTruthy();
  expect(product.brand).toEqual({ "@type": "Brand", name: "ONYX EVOLUTION" });
  expect(product.url).toBe(page.canonical);
  for (const img of product.image) expect(new URL(img).origin).toBe(baseURL);
  const offer = product.offers;
  expect(["Offer", "AggregateOffer"]).toContain(offer["@type"]);
  expect(offer.priceCurrency).toBe("RSD");
  expect(typeof (offer.price ?? offer.lowPrice)).toBe("number");
  expect(offer.availability).toMatch(/^https:\/\/schema\.org\/(InStock|OutOfStock|BackOrder)$/);
  expect(product.aggregateRating, "no fabricated ratings").toBeUndefined();
});

test("Home WebSite JSON-LD has a working SearchAction", async ({ request }) => {
  const page = await fetchPage(request, "/");
  const [site] = byType(page, "WebSite") as unknown as { potentialAction: { target: { urlTemplate: string } } }[];
  const template = site.potentialAction.target.urlTemplate;
  expect(template).toContain("{search_term_string}");
  const search = await request.get(new URL(template.replace("{search_term_string}", "krpa")).pathname + "?q=krpa");
  expect(search.status()).toBe(200);
});

test.describe("status codes", () => {
  for (const path of [`/proizvod/${productSlug}-does-not-exist`, "/en/product/nope-nope", `/kategorija/${categorySlug}-nope`, "/de/kategorie/nope", "/this-page-does-not-exist"]) {
    test(`404 for ${path}`, async ({ request }) => {
      const page = await fetchPage(request, path);
      expect(page.status).toBe(404);
      expect(page.robots ?? "").toContain("noindex");
    });
  }
});

test.describe("query-param variants", () => {
  test("sorted/filtered category canonicalizes to the clean URL", async ({ request, baseURL }) => {
    const page = await fetchPage(request, `/kategorija/${categorySlug}?sort=price-asc&inStock=1`);
    expect(page.canonical).toBe(`${baseURL}/kategorija/${categorySlug}`);
  });
  test("search results are noindex, follow", async ({ request }) => {
    const page = await fetchPage(request, "/pretraga?q=krpa");
    expect(page.robots).toMatch(/noindex/);
    expect(page.robots).toMatch(/(^|, )follow/);
  });
});

test("robots.txt allows the site, blocks private paths, links the sitemap", async ({ request, baseURL }) => {
  const body = await (await request.get("/robots.txt")).text();
  expect(body).toMatch(/^Allow: \/$/m);
  expect(body).not.toMatch(/^Disallow: \/$/m);
  for (const p of ["/korpa", "/kasa", "/en/cart", "/de/kasse", "/pretraga"]) expect(body).toContain(`Disallow: ${p}\n`);
  expect(body).toContain(`Sitemap: ${baseURL}/sitemap.xml`);
});

test("sitemap lists products in every locale with alternates", async ({ request, baseURL }) => {
  const res = await request.get("/sitemap.xml");
  expect(res.status()).toBe(200);
  const xml = await res.text();
  expect(xml).toContain(`<loc>${baseURL}/proizvod/${productSlug}</loc>`);
  expect(xml).toContain(`<loc>${baseURL}/en/product/${productSlug}</loc>`);
  expect(xml).toContain(`hreflang="x-default"`);
  expect(xml).not.toContain("cloudwaysapps.com");
});

test.describe("user-specific responses are never cached", () => {
  test("Store API proxy (cart) sends private, no-store", async ({ request }) => {
    const res = await request.get("/api/store/cart");
    const cacheControl = res.headers()["cache-control"] ?? "";
    expect(cacheControl).toContain("no-store");
    expect(cacheControl).toContain("private");
    expect(cacheControl).not.toMatch(/s-maxage|public/);
  });
  for (const path of ["/korpa", "/en/checkout", "/de/bestellbestaetigung"]) {
    test(`${path} sends private, no-store`, async ({ request }) => {
      const res = await request.get(path);
      expect(res.headers()["cache-control"]).toContain("no-store");
    });
  }
});

test.describe("no automatic language redirects", () => {
  const cases = [
    { path: "/", acceptLanguage: "de-DE,de;q=0.9", lang: "sr" },
    { path: "/", acceptLanguage: "en-US,en;q=0.9", lang: "sr" },
    { path: `/en/product/${productSlug}`, acceptLanguage: "sr-RS,sr;q=0.9", lang: "en" },
    { path: `/de/kategorie/${categorySlug}`, acceptLanguage: "en-US,en;q=0.9", lang: "de" },
    { path: "/en", acceptLanguage: "", lang: "en" },
  ];
  for (const c of cases) {
    test(`${c.path} with Accept-Language "${c.acceptLanguage}" is served as-is`, async ({ request }) => {
      const res = await request.get(c.path, {
        maxRedirects: 0,
        headers: c.acceptLanguage ? { "Accept-Language": c.acceptLanguage } : {},
      });
      expect(res.status()).toBe(200);
      expect(/<html[^>]* lang="([^"]+)"/.exec(await res.text())?.[1]).toBe(c.lang);
    });
  }
});

test.describe("untranslated item (EN/DE translation hidden in the test build)", () => {
  const slug = HIDDEN_TRANSLATION;
  test("Serbian page exists and advertises only itself", async ({ request, baseURL }) => {
    const page = await fetchPage(request, `/proizvod/${slug}`);
    expect(page.status).toBe(200);
    expect(page.hreflang).toEqual({ sr: `${baseURL}/proizvod/${slug}`, "x-default": `${baseURL}/proizvod/${slug}` });
  });
  for (const path of [`/en/product/${slug}`, `/de/produkt/${slug}`]) {
    test(`${path} is a 404`, async ({ request }) => {
      expect((await fetchPage(request, path)).status).toBe(404);
    });
  }
  test("left out of the sitemap in EN/DE", async ({ request, baseURL }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    expect(xml).toContain(`<loc>${baseURL}/proizvod/${slug}</loc>`);
    expect(xml).not.toContain(`/en/product/${slug}`);
    expect(xml).not.toContain(`/de/produkt/${slug}`);
  });
  test("language switcher on the Serbian page sends EN/DE to their home pages", async ({ request }) => {
    const page = await fetchPage(request, `/proizvod/${slug}`);
    const links = Object.fromEntries([...page.html.matchAll(/<a href="([^"]+)" hrefLang="([^"]+)"/g)].map((m) => [m[2], m[1]]));
    expect(links).toEqual({ en: "/en", de: "/de" });
  });
});
