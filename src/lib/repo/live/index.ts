import type { Repo } from "../contract";

/**
 * Phase 9 placeholder. Implements the same Repo contract as `../mock`
 * against WPGraphQL + WooGraphQL on the live WooCommerce backend. Until
 * that phase, DATA_SOURCE stays "mock" and this adapter is never selected.
 */
function notImplemented(fn: string): never {
  throw new Error(
    `repo/live: "${fn}" not implemented yet — live WooCommerce integration is Phase 9.`,
  );
}

export const liveRepo: Repo = {
  getAllCategories: () => notImplemented("getAllCategories"),
  getCategoryBySlug: () => notImplemented("getCategoryBySlug"),
  getProductsByCategory: () => notImplemented("getProductsByCategory"),
  getFeaturedProducts: () => notImplemented("getFeaturedProducts"),
  getKits: () => notImplemented("getKits"),
  getProductBySlug: () => notImplemented("getProductBySlug"),
  getRelatedProducts: () => notImplemented("getRelatedProducts"),
  getAllProductSlugs: () => notImplemented("getAllProductSlugs"),
  searchProducts: () => notImplemented("searchProducts"),
};
