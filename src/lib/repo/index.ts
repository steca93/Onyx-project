import type { Repo } from "./contract";
import { mockRepo } from "./mock";
import { liveRepo } from "./live";

const repo: Repo = process.env.DATA_SOURCE === "live" ? liveRepo : mockRepo;

export const {
  getAllCategories,
  getCategoryBySlug,
  getProductsByCategory,
  getFeaturedProducts,
  getKits,
  getProductBySlug,
  getRelatedProducts,
  getAllProductSlugs,
  searchProducts,
  getSearchIndex,
} = repo;

export type * from "./types";
