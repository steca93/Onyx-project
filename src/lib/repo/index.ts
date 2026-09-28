import { getLocale } from "next-intl/server";
import { getCatalogTranslations } from "@/i18n/catalog";
import { routing, type Locale } from "@/i18n/routing";
import type { Repo } from "./contract";
import type { AnyProduct, ProductListOptions, ProductListResult } from "./types";
import { STATIC_PRODUCTS_LIMIT } from "./live/cache";
import {
  isTranslated,
  localizeCategory,
  localizeListResult,
  localizeProduct,
  localizeSearchIndexItem,
  normalizeForSearch,
} from "./localize";
import { mockRepo } from "./mock";
import { liveRepo } from "./live";

const repo: Repo = process.env.DATA_SOURCE === "live" ? liveRepo : mockRepo;

/**
 * Every export below returns catalog data in the current request's locale:
 * the adapter fetches the (Serbian) WooCommerce data, then the EN/DE
 * overlay from src/i18n/catalog is applied on top. Pages keep calling these
 * exactly as before — no locale argument needed.
 */
async function catalog() {
  return getCatalogTranslations((await getLocale()) as Locale);
}

type Catalog = NonNullable<ReturnType<typeof getCatalogTranslations>>;

/** Slugs that exist in this locale (EN/DE: translated ones only). */
function translatedSlugs(c: Catalog, kind: "product" | "category"): string[] {
  const entries = kind === "product" ? c.products : c.categories;
  return Object.keys(entries).filter((slug) => isTranslated(c, kind, slug));
}

const EMPTY_LIST: ProductListResult = {
  products: [],
  pageInfo: { hasNextPage: false, endCursor: null },
  category: null,
  total: 0,
};

/** Restricts a listing query to products that exist in this locale — done
 * in the backend query (not by filtering afterwards) so pagination and
 * totals stay correct. `null` = nothing can match. */
function restrictToTranslated(c: Catalog, opts: ProductListOptions): ProductListOptions | null {
  const allowed = translatedSlugs(c, "product");
  const slugs = opts.slugs ? opts.slugs.filter((s) => allowed.includes(s)) : allowed;
  return slugs.length > 0 ? { ...opts, slugs } : null;
}

const onlyTranslated = (c: Catalog, products: AnyProduct[]) =>
  products.filter((p) => isTranslated(c, "product", p.slug)).map((p) => localizeProduct(c, p));

export async function getAllCategories() {
  const [categories, c] = await Promise.all([repo.getAllCategories(), catalog()]);
  if (!c) return categories;
  return categories.filter((cat) => isTranslated(c, "category", cat.slug)).map((cat) => localizeCategory(c, cat));
}

/** `null` for an untranslated category in EN/DE → the page 404s. */
export async function getCategoryBySlug(slug: string) {
  const [category, c] = await Promise.all([repo.getCategoryBySlug(slug), catalog()]);
  if (!c || !category) return category;
  return isTranslated(c, "category", slug) ? localizeCategory(c, category) : null;
}

export async function getProductsByCategory(...[slug, opts = {}]: Parameters<Repo["getProductsByCategory"]>) {
  const c = await catalog();
  if (!c) return repo.getProductsByCategory(slug, opts);
  if (!isTranslated(c, "category", slug)) return EMPTY_LIST;
  const restricted = restrictToTranslated(c, opts);
  if (!restricted) return { ...EMPTY_LIST, category: await getCategoryBySlug(slug) };
  return localizeListResult(c, await repo.getProductsByCategory(slug, restricted));
}

export async function getFeaturedProducts(limit: number) {
  const [products, c] = await Promise.all([repo.getFeaturedProducts(limit), catalog()]);
  return c ? onlyTranslated(c, products) : products;
}

export async function getKits(limit?: number) {
  const [products, c] = await Promise.all([repo.getKits(limit), catalog()]);
  return c ? onlyTranslated(c, products) : products;
}

/** `null` for an untranslated product in EN/DE → the page 404s. */
export async function getProductBySlug(slug: string) {
  const [product, c] = await Promise.all([repo.getProductBySlug(slug), catalog()]);
  if (!c || !product) return product;
  return isTranslated(c, "product", slug) ? localizeProduct(c, product) : null;
}

export async function getRelatedProducts(slug: string, limit: number) {
  const [products, c] = await Promise.all([repo.getRelatedProducts(slug, limit), catalog()]);
  return c ? onlyTranslated(c, products) : products;
}

export type UntranslatedSlugs = Partial<Record<Locale, { products: string[]; categories: string[] }>>;

/** Per EN/DE locale, the product/category slugs that have no translation
 * (usually none) — lets the language switcher avoid linking to a 404. */
export async function getUntranslatedSlugs(): Promise<UntranslatedSlugs> {
  const [productSlugs, categories] = await Promise.all([repo.getAllProductSlugs(), repo.getAllCategories()]);
  return Object.fromEntries(
    routing.locales.flatMap((locale) => {
      const c = getCatalogTranslations(locale);
      if (!c) return [];
      return [
        [
          locale,
          {
            products: productSlugs.filter((slug) => !isTranslated(c, "product", slug)),
            categories: categories.map((cat) => cat.slug).filter((slug) => !isTranslated(c, "category", slug)),
          },
        ],
      ];
    }),
  );
}

/**
 * Locales in which a product/category exists: Serbian always, EN/DE when
 * translated. Drives hreflang, the sitemap and the language switcher.
 */
export function availableLocales(kind: "product" | "category", slug: string): Locale[] {
  return routing.locales.filter((locale) => {
    const c = getCatalogTranslations(locale);
    return !c || isTranslated(c, kind, slug);
  });
}

export const getAllProductSlugs = repo.getAllProductSlugs;
export const getProductSitemapEntries = repo.getProductSitemapEntries;

/** Product slugs to prerender for a locale: at most STATIC_PRODUCTS_LIMIT
 * (catalog order), and for EN/DE only those that are translated. */
export async function getStaticProductSlugs(locale: Locale): Promise<string[]> {
  const c = getCatalogTranslations(locale);
  const slugs = await repo.getAllProductSlugs();
  return (c ? slugs.filter((slug) => isTranslated(c, "product", slug)) : slugs).slice(0, STATIC_PRODUCTS_LIMIT);
}

export async function searchProducts(...[query, opts = {}]: Parameters<Repo["searchProducts"]>) {
  const c = await catalog();
  if (!c) return repo.searchProducts(query, opts);

  // WooCommerce only knows the Serbian text, so an English/German query
  // ("towel", "Handtuch") would find nothing there. Match against both the
  // translated and the original names ourselves, then ask the backend for
  // exactly those products (translated ones only).
  const needle = normalizeForSearch(query.trim());
  if (needle) {
    const index = await repo.getSearchIndex();
    const slugs = index
      .filter((item) => {
        const t = c.products[item.slug];
        return [item.name, t?.name, t?.shortDescription].some(
          (text) => text && normalizeForSearch(text).includes(needle),
        );
      })
      .map((item) => item.slug);
    if (slugs.length > 0) {
      const restricted = restrictToTranslated(c, { ...opts, slugs });
      return restricted ? localizeListResult(c, await repo.searchProducts("", restricted)) : EMPTY_LIST;
    }
  }
  const restricted = restrictToTranslated(c, opts);
  return restricted ? localizeListResult(c, await repo.searchProducts(query, restricted)) : EMPTY_LIST;
}

/** Takes the locale explicitly — its only caller is the /api/search-index
 * route handler, which sits outside the [locale] segment. */
export async function getSearchIndex(locale: Locale) {
  const index = await repo.getSearchIndex();
  const c = getCatalogTranslations(locale);
  return c
    ? index.filter((item) => isTranslated(c, "product", item.slug)).map((item) => localizeSearchIndexItem(c, item))
    : index;
}

/** Slug → translated product name for the given locale, for client
 * components (the cart) that only have the name WooCommerce gave them. */
export function getProductNameTranslations(locale: Locale): Record<string, string> {
  const c = getCatalogTranslations(locale);
  if (!c) return {};
  return Object.fromEntries(
    Object.entries(c.products).flatMap(([slug, t]) => (t.name ? [[slug, t.name]] : [])),
  );
}

export type * from "./types";
