/**
 * URL of a WordPress image served through the storefront's own Next.js
 * image optimizer (same allowlist as next/image). Anything shown to users
 * or crawlers — <img> in WP HTML, og:image, JSON-LD — must use this rather
 * than the raw WordPress URL: that host sends `X-Robots-Tag: noindex` and
 * will move to cms.onyx.com.
 */
export const OPTIMIZER_QUALITY = 75; // Next 16's default (and only) allowed quality

export function optimizedImagePath(src: string, width: 640 | 1080 | 1200 | 1920 = 1080): string {
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${OPTIMIZER_QUALITY}`;
}
