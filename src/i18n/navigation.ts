import type { ComponentProps } from "react";
import { createNavigation } from "next-intl/navigation";
import { routing, type AppPathname } from "./routing";

// Locale-aware Link/router/redirect — use these instead of next/link and
// next/navigation everywhere in the app so hrefs automatically get the
// right locale prefix (or none, for sr).
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

/** Anything `<Link href>` accepts — a static pathname, or an object with
 * `params`/`query`/`hash` for dynamic routes. Use this (not `string`) for
 * href props so links stay checked against routing.pathnames. */
export type AppHref =
  | Exclude<ComponentProps<typeof Link>["href"], string>
  | Exclude<AppPathname, `${string}[${string}`>;
