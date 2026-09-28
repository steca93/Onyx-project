import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { IS_INDEXABLE, SITE_URL } from "@/lib/seo/env";

/** Every locale's URL for an internal (Serbian-named) route. */
function localizedPaths(route: keyof typeof routing.pathnames): string[] {
  return routing.locales.map((locale) => {
    const localized = routing.pathnames[route];
    const path = typeof localized === "string" ? localized : localized[locale];
    return locale === routing.defaultLocale ? path : `/${locale}${path}`;
  });
}

export default function robots(): MetadataRoute.Robots {
  if (!IS_INDEXABLE) {
    // Local and preview deployments: keep everything out of the index.
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        // Per-visitor pages.
        ...localizedPaths("/korpa"),
        ...localizedPaths("/kasa"),
        ...localizedPaths("/potvrda-porudzbine"),
        // Internal search results.
        ...localizedPaths("/pretraga"),
        // Filter/sort variants of category listings (pagination stays crawlable).
        "/*?*sort=",
        "/*?*inStock=",
        "/*?*minPrice=",
        "/*?*maxPrice=",
        "/api/",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
