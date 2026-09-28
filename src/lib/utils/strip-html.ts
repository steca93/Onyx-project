/**
 * WordPress/WooCommerce rich-text fields (product & category descriptions)
 * come back as HTML, not plain text. Use this wherever tags would be wrong —
 * <meta name="description">, JSON-LD, or a truthiness check before rendering
 * a block — never for on-page display, where the HTML should render as
 * markup (see the `.prose-onyx` utility in globals.css).
 */
export function stripHtml(html: string | null | undefined): string {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
