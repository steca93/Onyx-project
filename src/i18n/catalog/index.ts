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

/** `null` for Serbian — the WooCommerce data already is the Serbian copy. */
export function getCatalogTranslations(locale: Locale): CatalogTranslations | null {
  return catalogs[locale] ?? null;
}
