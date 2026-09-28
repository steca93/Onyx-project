/**
 * Cache policy for public catalog data. Only these tags/lifetimes are ever
 * attached to fetches — cart, checkout and anything carrying a session go
 * through src/app/api/store (always no-store) and never touch this file.
 *
 * On-demand invalidation: WordPress calls /api/revalidate (see
 * wp-backend/mu-plugins/onyx-revalidate.php), which expires these tags.
 * The time-based values are only the fallback if a webhook is missed.
 */
export const REVALIDATE = {
  products: 60 * 60,
  categories: 60 * 60,
  static: 60 * 60 * 24,
} as const;

export const TAGS = {
  products: "products",
  categories: "categories",
  menu: "menu",
  settings: "settings",
  product: (slug: string) => `product:${slug}`,
  category: (slug: string) => `category:${slug}`,
} as const;
