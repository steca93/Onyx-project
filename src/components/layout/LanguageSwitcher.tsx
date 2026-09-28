"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

const LABELS: Record<Locale, string> = { sr: "SR", en: "EN", de: "DE" };

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex items-center gap-1.5" aria-label="Jezik / Language / Sprache">
      {routing.locales.map((loc, index) => (
        <span key={loc} className="flex items-center gap-1.5">
          {index > 0 && <span className="text-text-34">/</span>}
          <button
            type="button"
            onClick={() => router.replace(pathname, { locale: loc })}
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
