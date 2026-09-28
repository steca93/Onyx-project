import type { MetadataRoute } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getAllCategories, getAllProductSlugs } from "@/lib/repo";

type SitemapHref = Parameters<typeof getPathname>[0]["href"];

const SITE_URL = "https://onyxevolution.rs";

const STATIC_ROUTES = [
  "/",
  "/korpa",
  "/garancija",
  "/ovlasceni-centri",
  "/postani-instalater",
  "/dostava-i-povracaj",
  "/uputstva-za-montazu",
  "/cesta-pitanja",
  "/kontakt",
] as const;

/** One entry per page, keyed on the Serbian (default-locale) URL, with the
 * translated EN/DE URLs listed as hreflang alternates. */
function entry(
  href: SitemapHref,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  priority: number,
): MetadataRoute.Sitemap[number] {
  const url = (locale: (typeof routing.locales)[number]) =>
    `${SITE_URL}${getPathname({ href, locale })}`;
  return {
    url: url(routing.defaultLocale),
    changeFrequency,
    priority,
    alternates: {
      languages: Object.fromEntries(routing.locales.map((l) => [l, url(l)])),
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [productSlugs, categories] = await Promise.all([
    getAllProductSlugs(),
    getAllCategories(),
  ]);

  const staticEntries = STATIC_ROUTES.map((path) =>
    entry(path, path === "/" ? "daily" : "weekly", path === "/" ? 1 : 0.6),
  );

  const categoryEntries = categories.map((c) =>
    entry({ pathname: "/kategorija/[slug]", params: { slug: c.slug } }, "daily", 0.8),
  );

  const productEntries = productSlugs.map((slug) =>
    entry({ pathname: "/proizvod/[slug]", params: { slug } }, "weekly", 0.7),
  );

  return [...staticEntries, ...categoryEntries, ...productEntries];
}
