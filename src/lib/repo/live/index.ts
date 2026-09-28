import type { Repo } from "../contract";
import type {
  AnyProduct,
  ProductListOptions,
  ProductListResult,
  ProductSort,
  SearchIndexProduct,
} from "../types";
import { graphqlFetch } from "./client";
import { mapCategory, mapProduct, mapProducts, type RawProductNode } from "./mappers";
import {
  ALL_PRODUCT_SLUGS_QUERY,
  CATEGORIES_QUERY,
  CATEGORY_BY_SLUG_QUERY,
  PRODUCTS_QUERY,
  PRODUCT_BY_SLUG_QUERY,
  SEARCH_INDEX_QUERY,
} from "./queries";

interface SearchIndexNode {
  id: string;
  name: string;
  slug: string;
  image: { sourceUrl: string; altText: string } | null;
  price?: string | null;
}

interface SearchIndexData {
  products: {
    nodes: SearchIndexNode[];
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
  };
}

const KIT_CATEGORY_SLUG = "setovi";
const DEFAULT_PER_PAGE = 6;

interface ProductsData {
  products: { nodes: RawProductNode[]; pageInfo: { hasNextPage: boolean; endCursor: string | null } };
}

// `where.orderby` is a *list* of ProductsOrderbyInput, not a bare object —
// confirmed against the live schema (a single object is silently rejected
// with a confusing "expected to be an object" coercion error).
function orderByFromSort(sort: ProductSort | undefined) {
  switch (sort) {
    case "price-asc":
      return [{ field: "PRICE", order: "ASC" }];
    case "price-desc":
      return [{ field: "PRICE", order: "DESC" }];
    case "name-asc":
      return [{ field: "NAME", order: "ASC" }];
    case "newest":
      return [{ field: "DATE", order: "DESC" }];
    case "featured":
    default:
      return [{ field: "MENU_ORDER", order: "ASC" }];
  }
}

function buildWhere(opts: ProductListOptions, extra?: Record<string, unknown>) {
  return {
    ...extra,
    minPrice: opts.minPrice,
    maxPrice: opts.maxPrice,
    stockStatus: opts.inStockOnly ? "IN_STOCK" : undefined,
    orderby: orderByFromSort(opts.sort),
  };
}

/**
 * WPGraphQL is cursor-paginated — there's no "give me page N" or a total
 * count. To support the app's page-number URLs (?page=3) and numbered
 * Pagination UI, this over-fetches up to `page * perPage + 1` nodes (the
 * `+1` detects whether a next page exists) and slices the current page's
 * window out of that. Fine for a realistic catalog size; not built for
 * thousands of products deep-paginated.
 */
async function fetchPage(
  where: Record<string, unknown>,
  opts: ProductListOptions,
): Promise<{ products: AnyProduct[]; hasNextPage: boolean; softTotal: number }> {
  const page = opts.page ?? 1;
  const perPage = opts.perPage ?? DEFAULT_PER_PAGE;
  const limit = page * perPage + 1;

  const data = await graphqlFetch<ProductsData>(PRODUCTS_QUERY, { first: limit, where });
  const nodes = data?.products.nodes ?? [];
  const start = (page - 1) * perPage;
  const windowNodes = nodes.slice(start, start + perPage);
  const hasNextPage = nodes.length > start + perPage;

  return {
    products: mapProducts(windowNodes),
    hasNextPage,
    // Not a real count — just enough for `total ? ceil(total/perPage) : 1`
    // to produce a correct next/stop pagination UI without a native
    // total-count field in this schema.
    softTotal: hasNextPage ? page * perPage + 1 : start + windowNodes.length,
  };
}

function buildListResult(
  result: { products: AnyProduct[]; hasNextPage: boolean; softTotal: number },
  page: number,
  category: ProductListResult["category"],
): ProductListResult {
  return {
    products: result.products,
    pageInfo: {
      hasNextPage: result.hasNextPage,
      endCursor: result.hasNextPage ? String(page + 1) : null,
    },
    category,
    total: result.softTotal,
  };
}

export const liveRepo: Repo = {
  async getAllCategories() {
    const data = await graphqlFetch<{ productCategories: { nodes: Parameters<typeof mapCategory>[0][] } }>(
      CATEGORIES_QUERY,
      { first: 50 },
    );
    return (data?.productCategories.nodes ?? [])
      .filter((c) => c.slug !== "uncategorized")
      .map(mapCategory);
  },

  async getCategoryBySlug(slug) {
    const data = await graphqlFetch<{ productCategory: Parameters<typeof mapCategory>[0] | null }>(
      CATEGORY_BY_SLUG_QUERY,
      { slug },
    );
    return data?.productCategory ? mapCategory(data.productCategory) : null;
  },

  async getProductsByCategory(slug, opts = {}) {
    const page = opts.page ?? 1;
    const where = buildWhere(opts, { categoryIn: [slug] });
    // Category info and the product page are independent fetches (the
    // product query only needs `slug`, not the category object) — run them
    // in parallel instead of paying two sequential round-trips to WPGraphQL.
    // Not `this.getCategoryBySlug` — repo/index.ts destructures these
    // methods off the object, which drops `this` binding entirely.
    const [category, result] = await Promise.all([
      opts.skipCategory ? Promise.resolve(null) : liveRepo.getCategoryBySlug(slug),
      fetchPage(where, opts),
    ]);
    return buildListResult(result, page, category);
  },

  async getFeaturedProducts(limit) {
    const data = await graphqlFetch<ProductsData>(PRODUCTS_QUERY, {
      first: limit,
      where: { featured: true, orderby: [{ field: "DATE", order: "DESC" }] },
    });
    return mapProducts(data?.products.nodes ?? []);
  },

  async getKits(limit) {
    const data = await graphqlFetch<ProductsData>(PRODUCTS_QUERY, {
      first: limit ?? 50,
      where: { categoryIn: [KIT_CATEGORY_SLUG], orderby: [{ field: "MENU_ORDER", order: "ASC" }] },
    });
    return mapProducts(data?.products.nodes ?? []);
  },

  async getProductBySlug(slug) {
    const data = await graphqlFetch<{ product: RawProductNode | null }>(PRODUCT_BY_SLUG_QUERY, {
      slug,
    });
    if (!data?.product) return null;
    return mapProduct(data.product);
  },

  async getRelatedProducts(slug, limit) {
    // Same query+variables as getProductBySlug — Next's fetch memoization
    // dedupes this against that call within a single render, so calling
    // both from the same page costs one network round-trip, not two.
    const data = await graphqlFetch<{ product: RawProductNode | null }>(PRODUCT_BY_SLUG_QUERY, {
      slug,
    });
    const related = data?.product?.related?.nodes ?? [];
    return mapProducts(related).slice(0, limit);
  },

  async getAllProductSlugs() {
    const slugs: string[] = [];
    let after: string | null = null;
    let hasNextPage = true;

    while (hasNextPage) {
      const data: { products: { nodes: { slug: string }[]; pageInfo: { hasNextPage: boolean; endCursor: string | null } } } | null =
        await graphqlFetch(ALL_PRODUCT_SLUGS_QUERY, { first: 100, after });
      const nodes = data?.products.nodes ?? [];
      slugs.push(...nodes.map((n) => n.slug));
      hasNextPage = data?.products.pageInfo.hasNextPage ?? false;
      after = data?.products.pageInfo.endCursor ?? null;
      if (!after) break;
    }

    return slugs;
  },

  async searchProducts(query, opts = {}) {
    const page = opts.page ?? 1;
    const trimmed = query.trim();
    const where = buildWhere(opts, trimmed ? { search: trimmed } : {});
    const result = await fetchPage(where, opts);
    return buildListResult(result, page, null);
  },

  async getSearchIndex() {
    const index: SearchIndexProduct[] = [];
    let after: string | null = null;
    let hasNextPage = true;

    while (hasNextPage) {
      const data: SearchIndexData | null = await graphqlFetch(
        SEARCH_INDEX_QUERY,
        { first: 100, after },
        // Rebuilt at most once an hour — the whole point is to avoid a
        // WPGraphQL round trip on every keystroke, see SearchBar.tsx.
        3600,
      );
      const nodes = data?.products.nodes ?? [];
      for (const n of nodes) {
        index.push({
          id: n.id,
          name: n.name,
          slug: n.slug,
          price: n.price ?? null,
          image: n.image ?? null,
        });
      }
      hasNextPage = data?.products.pageInfo.hasNextPage ?? false;
      after = data?.products.pageInfo.endCursor ?? null;
      if (!after) break;
    }

    return index;
  },
};
