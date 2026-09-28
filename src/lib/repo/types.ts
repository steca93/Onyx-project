/**
 * Shapes mirror WooCommerce's GraphQL schema (WPGraphQL + WooGraphQL) on
 * purpose — keep the odd nesting. When src/lib/repo/live replaces
 * src/lib/repo/mock, these types stay unchanged; only the resolvers change.
 */

export type StockStatus = "IN_STOCK" | "OUT_OF_STOCK" | "ON_BACKORDER";

export interface ProductImage {
  sourceUrl: string;
  altText: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  count: number | null;
  description?: string | null;
  image?: ProductImage | null;
  /** Only populated by getCategoryBySlug (category page breadcrumbs/links). */
  parent?: ProductCategoryRef | null;
  children?: (ProductCategoryRef & { count: number | null })[];
}

export interface ProductCategoryRef {
  name: string;
  slug: string;
}

export interface ProductAttribute {
  name: string;
  label: string;
  /** Raw option values — what variations and the Store API match on. */
  options: string[];
  /** Display text per raw option, when it differs (translated storefront
   * locales). Absent means show the raw option as-is. */
  optionLabels?: Record<string, string>;
}

export interface VariationAttributeValue {
  name: string;
  value: string;
}

export interface ProductVariation {
  id: string;
  /** WooCommerce's own numeric post ID — absent in mock data, present (and
   * required by the Store API's cart/add-item call) once live. */
  databaseId?: number;
  sku: string | null;
  price: string | null;
  regularPrice: string | null;
  salePrice: string | null;
  stockStatus: StockStatus;
  image: ProductImage | null;
  attributes: VariationAttributeValue[];
}

/** A single row in the mono spec list on the product detail page. */
export interface ProductSpec {
  label: string;
  value: string;
}

interface BaseProduct {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  image: ProductImage | null;
  galleryImages: { nodes: ProductImage[] };
  productCategories: { nodes: ProductCategoryRef[] };
  specs: ProductSpec[];
  installationNotes: string | null;
  warrantyNotes: string | null;
  featured: boolean;
  newArrival: boolean;
  /** ISO date the current sale price ends (WooCommerce "sale to"), if any. */
  saleEndsAt?: string | null;
}

export interface SimpleProduct extends BaseProduct {
  __typename: "SimpleProduct";
  price: string | null;
  regularPrice: string | null;
  salePrice: string | null;
  stockStatus: StockStatus;
  sku: string | null;
}

export interface VariableProduct extends BaseProduct {
  __typename: "VariableProduct";
  price: string | null;
  regularPrice: string | null;
  salePrice: string | null;
  stockStatus: StockStatus;
  attributes: { nodes: ProductAttribute[] };
  variations: { nodes: ProductVariation[] };
}

export type AnyProduct = SimpleProduct | VariableProduct;

export interface PageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
}

export interface ProductListResult {
  products: AnyProduct[];
  pageInfo: PageInfo;
  category: ProductCategory | null;
  total: number | null;
}

export type ProductSort =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "newest";

export interface ProductListOptions {
  page?: number;
  perPage?: number;
  sort?: ProductSort;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  /** Attribute-slug -> selected option values, e.g. { sirina: ["152cm"] } */
  attributes?: Record<string, string[]>;
  /** Skip the category lookup and return `category: null` — for callers
   * (e.g. the homepage) that only want the product list and would otherwise
   * pay for a category fetch whose result they'd immediately discard. */
  skipCategory?: boolean;
  /** Restrict results to these product slugs — used by translated-locale
   * search, which matches on translated names this backend doesn't know. */
  slugs?: string[];
}

/** Minimal per-product shape for the header's live search dropdown — just
 * enough to render a result row, fetched once as a flat list and filtered
 * entirely client-side (see src/components/layout/SearchBar.tsx). */
export interface SearchIndexProduct {
  id: string;
  name: string;
  slug: string;
  price: string | null;
  image: ProductImage | null;
}

export interface ProductSitemapEntry {
  slug: string;
  /** ISO date-time from WordPress, or null when unknown (mock data). */
  modified: string | null;
}
