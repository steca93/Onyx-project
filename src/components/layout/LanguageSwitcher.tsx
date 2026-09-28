"use client";

import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

const LABELS: Record<Locale, string> = { sr: "SR", en: "EN", de: "DE" };

export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations("LanguageSwitcher");
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams<{ slug?: string }>();

  function switchTo(loc: Locale) {
    // `pathname` is the internal route template (e.g. "/proizvod/[slug]") —
    // re-supply the current params and query so the same page opens under
    // the target locale's translated path.
    // Read at click time rather than via useSearchParams(), which would
    // force a Suspense boundary around the whole utility bar.
    const query = Object.fromEntries(new URLSearchParams(window.location.search));
    const href =
      pathname === "/kategorija/[slug]" || pathname === "/proizvod/[slug]"
        ? { pathname, params: { slug: params.slug ?? "" }, query }
        : { pathname, query };
    router.replace(href, { locale: loc });
  }

  return (
    <div className="flex items-center gap-1.5" role="group" aria-label={t("label")}>
      {routing.locales.map((loc, index) => (
        <span key={loc} className="flex items-center gap-1.5">
          {index > 0 && <span className="text-text-34">/</span>}
          <button
            type="button"
            onClick={() => switchTo(loc)}
            aria-current={loc === locale ? "true" : undefined}
            className={
              loc === locale
                ? "text-accent"
                : "cursor-pointer text-text-60 transition-colors duration-200 hover:text-text"
            }
          >
            {LABELS[loc]}
          </button>
        </span>
      ))}
    </div>
  );
}
