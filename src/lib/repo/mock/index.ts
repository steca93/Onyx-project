import { categories } from "@/data/categories";
import { products } from "@/data/products";
import type { Repo } from "../contract";
import type {
  AnyProduct,
  ProductCategory,
  ProductListOptions,
  ProductListResult,
} from "../types";

const KIT_CATEGORY_SLUG = "setovi";
const DEFAULT_PER_PAGE = 6;

function priceNumber(product: AnyProduct): number {
  const raw = product.price ?? product.regularPrice;
  const n = raw ? Number.parseFloat(raw) : Number.NaN;
  return Number.isNaN(n) ? 0 : n;
}

function inCategory(product: AnyProduct, slug: string): boolean {
  return product.productCategories.nodes.some((c) => c.slug === slug);
}

function sortProducts(list: AnyProduct[], sort: ProductListOptions["sort"]) {
  const sorted = [...list];
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => priceNumber(a) - priceNumber(b));
    case "price-desc":
      return sorted.sort((a, b) => priceNumber(b) - priceNumber(a));
    case "name-asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name, "sr"));
    case "newest":
      return sorted.sort(
        (a, b) => Number(b.newArrival) - Number(a.newArrival),
      );
    case "featured":
    default:
      return sorted.sort((a, b) => Number(b.featured) - Number(a.featured));
  }
}

function filterProducts(
  list: AnyProduct[],
  opts: ProductListOptions,
): AnyProduct[] {
  let result = list;

  if (opts.minPrice !== undefined) {
    result = result.filter((p) => priceNumber(p) >= opts.minPrice!);
  }
  if (opts.maxPrice !== undefined) {
    result = result.filter((p) => priceNumber(p) <= opts.maxPrice!);
  }
  if (opts.inStockOnly) {
    result = result.filter((p) => p.stockStatus === "IN_STOCK");
  }
  if (opts.attributes) {
    for (const [attrName, values] of Object.entries(opts.attributes)) {
      if (!values.length) continue;
      result = result.filter((p) => {
        if (p.__typename !== "VariableProduct") return false;
        const attr = p.attributes.nodes.find((a) => a.name === attrName);
        return attr ? attr.options.some((o) => values.includes(o)) : false;
      });
    }
  }

  return result;
}

function paginate(
  list: AnyProduct[],
  page: number,
  perPage: number,
): { pageItems: AnyProduct[]; hasNextPage: boolean } {
  const start = (page - 1) * perPage;
  const pageItems = list.slice(start, start + perPage);
  return { pageItems, hasNextPage: start + perPage < list.length };
}

function buildListResult(
  list: AnyProduct[],
  opts: ProductListOptions,
  category: ProductCategory | null,
): ProductListResult {
  const page = opts.page ?? 1;
  const perPage = opts.perPage ?? DEFAULT_PER_PAGE;

  const filtered = filterProducts(list, opts);
  const sorted = sortProducts(filtered, opts.sort);
  const { pageItems, hasNextPage } = paginate(sorted, page, perPage);

  return {
    products: pageItems,
    pageInfo: { hasNextPage, endCursor: hasNextPage ? String(page + 1) : null },
    category,
    total: filtered.length,
  };
}

export const mockRepo: Repo = {
  async getAllCategories() {
    return categories;
  },

  async getCategoryBySlug(slug) {
    return categories.find((c) => c.slug === slug) ?? null;
  },

  async getProductsByCategory(slug, opts = {}) {
    const category = categories.find((c) => c.slug === slug) ?? null;
    const list = products.filter((p) => inCategory(p, slug));
    return buildListResult(list, opts, category);
  },

  async getFeaturedProducts(limit) {
    return sortProducts(
      products.filter((p) => p.featured),
      "featured",
    ).slice(0, limit);
  },

  async getKits(limit) {
    const kits = sortProducts(
      products.filter((p) => inCategory(p, KIT_CATEGORY_SLUG)),
      "featured",
    );
    return limit ? kits.slice(0, limit) : kits;
  },

  async getProductBySlug(slug) {
    return products.find((p) => p.slug === slug) ?? null;
  },

  async getRelatedProducts(slug, limit) {
    const current = products.find((p) => p.slug === slug);
    if (!current) return [];
    const currentSlugs = new Set(
      current.productCategories.nodes.map((c) => c.slug),
    );
    return products
      .filter(
        (p) =>
          p.slug !== slug &&
          p.productCategories.nodes.some((c) => currentSlugs.has(c.slug)),
      )
      .slice(0, limit);
  },

  async getAllProductSlugs() {
    return products.map((p) => p.slug);
  },

  async searchProducts(query, opts = {}) {
    const needle = query.trim().toLowerCase();
    const list = needle
      ? products.filter(
          (p) =>
            p.name.toLowerCase().includes(needle) ||
            (p.shortDescription ?? "").toLowerCase().includes(needle) ||
            (p.description ?? "").toLowerCase().includes(needle),
        )
      : [];
    return buildListResult(list, opts, null);
  },
};
