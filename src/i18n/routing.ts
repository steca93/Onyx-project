import { hasLocale } from "next-intl";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["sr", "en", "de"],
  defaultLocale: "sr",
  // Serbian stays unprefixed (onyxevolution.rs/kasa), en/de get a prefix
  // (onyxevolution.rs/en/kasa) — matches how the business actually
  // operates: Serbian is the primary market, EN/DE are secondary.
  localePrefix: "as-needed",
  // Don't auto-redirect "/" based on the browser's Accept-Language header.
  // A device set to English doesn't mean the visitor isn't a Serbian
  // customer (very common locally) — bare "/" should always be Serbian;
  // visitors switch language explicitly via the picker.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];

/**
 * Narrows a route param's `string` locale to the typed `Locale` union
 * (`getTranslations({ locale, ... })` requires the narrow type). The
 * middleware guarantees this is always one of routing.locales in practice —
 * this only exists to satisfy the type checker, with defaultLocale as a
 * harmless fallback for the type-level "what if it isn't" case.
 */
export function toLocale(requested: string): Locale {
  return hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
}
