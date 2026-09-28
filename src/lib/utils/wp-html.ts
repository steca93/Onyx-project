/**
 * WordPress-authored HTML (product/category descriptions) is rendered with
 * dangerouslySetInnerHTML. Any <img> an editor pastes in would point at the
 * WordPress host — whose responses carry `X-Robots-Tag: noindex` and which
 * isn't the storefront's domain. Route those through the Next.js image
 * optimizer instead (same allowlist as next/image), and lazy-load them.
 */
import { optimizedImagePath } from "./image-url";

export function rewriteWpHtml(html: string | null | undefined): string {
  if (!html) return "";
  return html.replace(/<img\b[^>]*>/gi, (tag) => {
    const src = /\ssrc=["']([^"']+)["']/i.exec(tag)?.[1];
    if (!src || !/\/wp-content\/uploads\//.test(src)) return tag;
    return tag
      .replace(/\ssrcset=["'][^"']*["']/gi, "")
      .replace(/\ssizes=["'][^"']*["']/gi, "")
      .replace(/\ssrc=["'][^"']+["']/i, ` src="${optimizedImagePath(src)}"`)
      .replace(/<img\b/i, (m) => (/\sloading=/i.test(tag) ? m : `${m} loading="lazy" decoding="async"`));
  });
}
