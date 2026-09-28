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
  // Keys are the internal (file-system) routes — the Serbian folder names
  // under src/app/[locale]. EN/DE visitors see translated URL segments;
  // product/category slugs themselves stay as WooCommerce's (Serbian)
  // slugs, since those are the backend's identifiers.
  pathnames: {
    "/": "/",
    "/kasa": { sr: "/kasa", en: "/checkout", de: "/kasse" },
    "/korpa": { sr: "/korpa", en: "/cart", de: "/warenkorb" },
    "/garancija": { sr: "/garancija", en: "/warranty", de: "/garantie" },
    "/kontakt": { sr: "/kontakt", en: "/contact", de: "/kontakt" },
    "/ovlasceni-centri": {
      sr: "/ovlasceni-centri",
      en: "/authorized-centers",
      de: "/autorisierte-center",
    },
    "/postani-instalater": {
      sr: "/postani-instalater",
      en: "/become-an-installer",
      de: "/installateur-werden",
    },
    "/potvrda-porudzbine": {
      sr: "/potvrda-porudzbine",
      en: "/order-confirmation",
      de: "/bestellbestaetigung",
    },
    "/pretraga": { sr: "/pretraga", en: "/search", de: "/suche" },
    "/uputstva-za-montazu": {
      sr: "/uputstva-za-montazu",
      en: "/installation-guides",
      de: "/montageanleitungen",
    },
    "/uslovi-koriscenja": {
      sr: "/uslovi-koriscenja",
      en: "/terms",
      de: "/nutzungsbedingungen",
    },
    "/cesta-pitanja": { sr: "/cesta-pitanja", en: "/faq", de: "/faq" },
    "/dostava-i-povracaj": {
      sr: "/dostava-i-povracaj",
      en: "/shipping-and-returns",
      de: "/versand-und-rueckgabe",
    },
    "/kategorija/[slug]": {
      sr: "/kategorija/[slug]",
      en: "/category/[slug]",
      de: "/kategorie/[slug]",
    },
    "/proizvod/[slug]": {
      sr: "/proizvod/[slug]",
      en: "/product/[slug]",
      de: "/produkt/[slug]",
    },
  },
});

export type AppPathname = keyof typeof routing.pathnames;

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
