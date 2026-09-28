"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { getPathname, type AppHref } from "@/i18n/navigation";
import { matchRoute } from "@/i18n/match-route";
import { routing, type Locale } from "@/i18n/routing";
import type { UntranslatedSlugs } from "@/lib/repo";

const LABELS: Record<Locale, string> = { sr: "SR", en: "EN", de: "DE" };

/**
 * Plain `<a href>` links (crawlable, work without JS) to the same page in
 * each other language — the translated product/category URL, not the home
 * page. If that item has no translation in a language, its link goes to
 * that language's home page instead of a 404. Switching language is a full
 * page load, so every string on the page comes from the new locale.
 */
export function LanguageSwitcher({ untranslated }: { untranslated: UntranslatedSlugs }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("LanguageSwitcher");
  const realPath = usePathname();
  const route = matchRoute(realPath, locale);

  function hrefFor(target: Locale): string {
    let href: AppHref = "/";
    if (route) {
      const slug = route.params.slug;
      const missing =
        (route.pathname === "/proizvod/[slug]" && untranslated[target]?.products.includes(slug)) ||
        (route.pathname === "/kategorija/[slug]" && untranslated[target]?.categories.includes(slug));
      if (!missing) href = (slug ? { pathname: route.pathname, params: { slug } } : route.pathname) as AppHref;
    }
    return getPathname({ href: href as Parameters<typeof getPathname>[0]["href"], locale: target });
  }

  return (
    <nav className="flex items-center gap-1.5" aria-label={t("label")}>
      {routing.locales.map((loc, index) => (
        <span key={loc} className="flex items-center gap-1.5">
          {index > 0 && <span className="text-text-34">/</span>}
          {loc === locale ? (
            <span aria-current="true" lang={loc} className="text-accent">
              {LABELS[loc]}
            </span>
          ) : (
            <a
              href={hrefFor(loc)}
              hrefLang={loc}
              lang={loc}
              className="text-text-60 transition-colors duration-200 hover:text-text"
            >
              {LABELS[loc]}
            </a>
          )}
        </span>
      ))}
    </nav>
  );
}
