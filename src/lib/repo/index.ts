import { getLocale } from "next-intl/server";
import { getCatalogTranslations } from "@/i18n/catalog";
import type { Locale } from "@/i18n/routing";
import type { Repo } from "./contract";
import {
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

export async function getAllCategories() {
  const [categories, c] = await Promise.all([repo.getAllCategories(), catalog()]);
  return c ? categories.map((cat) => localizeCategory(c, cat)) : categories;
}

export async function getCategoryBySlug(slug: string) {
  const [category, c] = await Promise.all([repo.getCategoryBySlug(slug), catalog()]);
  return c && category ? localizeCategory(c, category) : category;
}

export async function getProductsByCategory(...args: Parameters<Repo["getProductsByCategory"]>) {
  const [result, c] = await Promise.all([repo.getProductsByCategory(...args), catalog()]);
  return c ? localizeListResult(c, result) : result;
}

export async function getFeaturedProducts(limit: number) {
  const [products, c] = await Promise.all([repo.getFeaturedProducts(limit), catalog()]);
  return c ? products.map((p) => localizeProduct(c, p)) : products;
}

export async function getKits(limit?: number) {
  const [products, c] = await Promise.all([repo.getKits(limit), catalog()]);
  return c ? products.map((p) => localizeProduct(c, p)) : products;
}

export async function getProductBySlug(slug: string) {
  const [product, c] = await Promise.all([repo.getProductBySlug(slug), catalog()]);
  return c && product ? localizeProduct(c, product) : product;
}

export async function getRelatedProducts(slug: string, limit: number) {
  const [products, c] = await Promise.all([repo.getRelatedProducts(slug, limit), catalog()]);
  return c ? products.map((p) => localizeProduct(c, p)) : products;
}

export const getAllProductSlugs = repo.getAllProductSlugs;
export const getProductSitemapEntries = repo.getProductSitemapEntries;

export async function searchProducts(...[query, opts = {}]: Parameters<Repo["searchProducts"]>) {
  const c = await catalog();
  if (!c) return repo.searchProducts(query, opts);

  // WooCommerce only knows the Serbian text, so an English/German query
  // ("towel", "Handtuch") would find nothing there. Match against both the
  // translated and the original names ourselves, then ask the backend for
  // exactly those products.
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
      return localizeListResult(c, await repo.searchProducts("", { ...opts, slugs }));
    }
  }
  return localizeListResult(c, await repo.searchProducts(query, opts));
}

/** Takes the locale explicitly — its only caller is the /api/search-index
 * route handler, which sits outside the [locale] segment. */
export async function getSearchIndex(locale: Locale) {
  const index = await repo.getSearchIndex();
  const c = getCatalogTranslations(locale);
  return c ? index.map((item) => localizeSearchIndexItem(c, item)) : index;
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
