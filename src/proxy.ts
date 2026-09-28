import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Skip static files, images, and API routes (including our /api/store/**
  // WooCommerce proxy — that must never get a locale prefix or redirect).
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
