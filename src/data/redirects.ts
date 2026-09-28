/**
 * Permanent (301) redirects for URLs that changed — typically a product or
 * category slug edited in WordPress after it was already indexed/linked.
 * Each entry is expanded to every locale's URL in next.config.ts.
 *
 * When you change a slug in wp-admin, add a line here:
 *   { type: "product", from: "old-slug", to: "new-slug" },
 *   { type: "category", from: "old-cat", to: "new-cat" },
 *   { type: "path", from: "/stara-strana", to: "/kontakt" },   // Serbian paths only
 */
export type RedirectEntry =
  | { type: "product" | "category"; from: string; to: string }
  | { type: "path"; from: string; to: string };

export const redirects: RedirectEntry[] = [];
