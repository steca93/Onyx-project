"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useCartStore } from "@/lib/cart/store";

/**
 * Layout-level UI that isn't needed for first paint, split out of the
 * initial JS bundle every page ships. (Not the cookie banner: on first
 * visits it's often the largest element on screen, i.e. the LCP, and
 * lazy-loading it measurably delayed LCP.)
 */

const CartDrawer = dynamic(
  () => import("@/components/cart/CartDrawer").then((m) => m.CartDrawer),
  { ssr: false },
);

/** Mounts the (closed) drawer once the browser is idle, so its slide-in
 * animation works on the first open — or immediately if the drawer gets
 * opened before that (e.g. an early "add to cart"). */
export function DeferredCartDrawer() {
  const isDrawerOpen = useCartStore((s) => s.isDrawerOpen);
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(() => setIdle(true), { timeout: 3000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(() => setIdle(true), 1500);
    return () => clearTimeout(id);
  }, []);

  return idle || isDrawerOpen ? <CartDrawer /> : null;
}
