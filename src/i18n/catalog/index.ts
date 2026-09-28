import type { Locale } from "@/i18n/routing";
import de from "./de.json";
import en from "./en.json";

/**
 * Translations for WooCommerce catalog content (product/category names and
 * descriptions), which the backend only holds in Serbian. Keyed by the
 * WooCommerce slug. Applied in src/lib/repo/localize.ts — pages and
 * components never read these files directly.
 *
 * Anything missing here falls back to the Serbian original, so a product
 * added in WooCommerce shows up (untranslated) straight away; add an entry
 * to en.json/de.json to translate it.
 */
export interface ProductTranslation {
  name?: string;
  shortDescription?: string;
  /** HTML, same structure as the WooCommerce description it replaces. */
  description?: string;
  /** WooCommerce `modified` date of the Serbian source this translation was
   * made from. If WooCommerce's date is newer, the translation may be out
   * of date (the SEO audit flags it). Set by `npm run i18n:stamp`. */
  sourceModified?: string;
}

export interface CategoryTranslation {
  name?: string;
  description?: string;
}

export interface CatalogTranslations {
  categories: Record<string, CategoryTranslation>;
  products: Record<string, ProductTranslation>;
  /** Attribute labels and option values (spec rows, variant pickers),
   * translated verbatim wherever they appear — e.g. "1 kom" → "1 pc". */
  terms: Record<string, string>;
}

const catalogs: Partial<Record<Locale, CatalogTranslations>> = { en, de };

// Test-only: the SEO suite (playwright.config.ts) hides one translation to
// verify untranslated items 404 in EN/DE and drop out of hreflang/sitemap —
// every real product is translated, so there's nothing else to test with.
// Never set in real deployments.
const hidden = new Set((process.env.SEO_TEST_HIDE_TRANSLATION ?? "").split(",").filter(Boolean));
if (hidden.size > 0) {
  for (const locale of ["en", "de"] as const) {
    const catalog = catalogs[locale]!;
    catalogs[locale] = {
      ...catalog,
      products: Object.fromEntries(Object.entries(catalog.products).filter(([slug]) => !hidden.has(slug))),
      categories: Object.fromEntries(Object.entries(catalog.categories).filter(([slug]) => !hidden.has(slug))),
    };
  }
}

/** `null` for Serbian — the WooCommerce data already is the Serbian copy. */
export function getCatalogTranslations(locale: Locale): CatalogTranslations | null {
  return catalogs[locale] ?? null;
}
