import { routing, type AppPathname, type Locale } from "./routing";

/**
 * Maps the browser's real path (e.g. "/de/produkt/abc") back to the
 * internal route key ("/proizvod/[slug]") and its params. next-intl's
 * usePathname() returns the filled-in internal path ("/proizvod/abc"),
 * not the template, so it can't be compared against route keys directly.
 */
export function matchRoute(
  realPath: string,
  locale: Locale,
): { pathname: AppPathname; params: Record<string, string> } | null {
  // Strip the locale prefix — including "/sr", which appears in the
  // internal path seen while statically prerendering.
  const prefix = `/${locale}`;
  const path = (realPath === prefix ? "/" : realPath.startsWith(`${prefix}/`) ? realPath.slice(prefix.length) : realPath) || "/";
  const candidates = (Object.entries(routing.pathnames) as [AppPathname, string | Record<Locale, string>][]).flatMap(
    ([key, localized]) =>
      // The public (localized) path in the browser, or the internal
      // (file-system) path during static prerendering.
      [typeof localized === "string" ? localized : localized[locale], key].map((pattern) => [key, pattern] as const),
  );
  for (const [key, pattern] of candidates) {
    const names: string[] = [];
    const regex = new RegExp(
      `^${pattern.replace(/\[([^\]]+)\]/g, (_, name: string) => {
        names.push(name);
        return "([^/]+)";
      })}/?$`,
    );
    const match = regex.exec(path);
    if (match) {
      return { pathname: key, params: Object.fromEntries(names.map((n, i) => [n, decodeURIComponent(match[i + 1])])) };
    }
  }
  return null;
}
