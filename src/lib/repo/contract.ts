import type {
  AnyProduct,
  ProductCategory,
  ProductListOptions,
  ProductListResult,
} from "./types";

/**
 * The one interface every data-source adapter implements. Pages never import
 * from `mock/` or `live/` directly — only from `src/lib/repo/index.ts`, which
 * picks an adapter based on `DATA_SOURCE`. Swapping backends means writing a
 * new adapter against this contract; no page or component changes.
 */
export interface Repo {
  getAllCategories(): Promise<ProductCategory[]>;
  getCategoryBySlug(slug: string): Promise<ProductCategory | null>;
  getProductsByCategory(
    slug: string,
    opts?: ProductListOptions,
  ): Promise<ProductListResult>;
  getFeaturedProducts(limit: number): Promise<AnyProduct[]>;
  getKits(limit?: number): Promise<AnyProduct[]>;
  getProductBySlug(slug: string): Promise<AnyProduct | null>;
  getRelatedProducts(slug: string, limit: number): Promise<AnyProduct[]>;
  getAllProductSlugs(): Promise<string[]>;
  searchProducts(
    query: string,
    opts?: ProductListOptions,
  ): Promise<ProductListResult>;
}
