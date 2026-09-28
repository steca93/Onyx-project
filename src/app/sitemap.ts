import type { MetadataRoute } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { availableLocales, getAllCategories, getProductSitemapEntries } from "@/lib/repo";
import { SITE_URL } from "@/lib/seo/env";

type SitemapHref = Parameters<typeof getPathname>[0]["href"];

// Well under the 50,000-URL protocol limit even at 3 locales; switch to
// `generateSitemaps` (one sitemap per N products) if the catalog grows past
// a few thousand products.
const STATIC_ROUTES = [
  "/",
  "/garancija",
  "/ovlasceni-centri",
  "/postani-instalater",
  "/dostava-i-povracaj",
  "/uputstva-za-montazu",
  "/cesta-pitanja",
  "/kontakt",
  "/uslovi-koriscenja",
] as const;

const url = (href: SitemapHref, locale: Locale) => `${SITE_URL}${getPathname({ href, locale })}`;

/**
 * One <url> per page per locale, each listing all language versions
 * (hreflang + x-default → Serbian) as alternates, as Google expects.
 */
function entries(
  href: SitemapHref,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  priority: number,
  lastModified?: string | null,
  locales: readonly Locale[] = routing.locales,
): MetadataRoute.Sitemap {
  // Only locales where the page actually exists (untranslated EN/DE
  // products/categories 404 and must not be listed or linked).
  const languages = {
    ...Object.fromEntries(locales.map((l) => [l, url(href, l)])),
    "x-default": url(href, routing.defaultLocale),
  };
  return locales.map((locale) => ({
    url: url(href, locale),
    ...(lastModified ? { lastModified } : {}),
    changeFrequency,
    priority,
    alternates: { languages },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([getProductSitemapEntries(), getAllCategories()]);

  return [
    ...STATIC_ROUTES.flatMap((path) =>
      entries(path, path === "/" ? "daily" : "monthly", path === "/" ? 1 : 0.5),
    ),
    ...categories.flatMap((c) =>
      entries(
        { pathname: "/kategorija/[slug]", params: { slug: c.slug } },
        "weekly",
        0.8,
        null,
        availableLocales("category", c.slug),
      ),
    ),
    ...products.flatMap((p) =>
      entries(
        { pathname: "/proizvod/[slug]", params: { slug: p.slug } },
        "weekly",
        0.7,
        p.modified,
        availableLocales("product", p.slug),
      ),
    ),
  ];
}
