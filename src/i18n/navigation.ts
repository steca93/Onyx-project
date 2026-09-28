import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Locale-aware Link/router/redirect — use these instead of next/link and
// next/navigation everywhere in the app so hrefs automatically get the
// right locale prefix (or none, for sr).
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
