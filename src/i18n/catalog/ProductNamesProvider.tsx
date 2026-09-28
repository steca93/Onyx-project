"use client";

import { createContext, useContext } from "react";

const ProductNamesContext = createContext<Record<string, string>>({});

/**
 * Cart lines come from the WooCommerce Store API, which only knows the
 * Serbian product name. The root layout hands down slug → translated name
 * for the active locale (names only, not the full catalog), so cart UI can
 * show the visitor's language.
 */
export function ProductNamesProvider({
  names,
  children,
}: {
  names: Record<string, string>;
  children: React.ReactNode;
}) {
  return <ProductNamesContext.Provider value={names}>{children}</ProductNamesContext.Provider>;
}

/** Translated name for a product slug, or `fallback` (the Serbian name). */
export function useProductName(slug: string, fallback: string): string {
  return useContext(ProductNamesContext)[slug] ?? fallback;
}
