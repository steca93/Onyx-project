import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  addLiveCartItem,
  clearLiveCart,
  fetchLiveCart,
  removeLiveCartItem,
  updateLiveCartItem,
} from "./live-client";
import type { AddToCartInput, CartLineItem } from "./types";

/** Client-visible mirror of the server-only `DATA_SOURCE` — both must be
 * set together (see .env.example). The cart runs entirely in the browser,
 * so it needs its own NEXT_PUBLIC_-prefixed read of the same toggle. */
const IS_LIVE = process.env.NEXT_PUBLIC_DATA_SOURCE === "live";

function lineKey(productId: string, variationId: string | null): string {
  return `${productId}:${variationId ?? "-"}`;
}

function logCartError(action: string, error: unknown) {
  console.error(`onyx-cart(live): ${action} failed`, error);
}

interface CartState {
  items: CartLineItem[];
  hasHydrated: boolean;
  isDrawerOpen: boolean;
  addItem: (input: AddToCartInput, quantity?: number) => void;
  updateQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
  setHasHydrated: (value: boolean) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const useMockCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      hasHydrated: false,
      isDrawerOpen: false,

      addItem: (input, quantity = 1) =>
        set((state) => {
          const key = lineKey(input.productId, input.variationId);
          const existing = state.items.find((item) => item.key === key);

          if (existing) {
            return {
              items: state.items.map((item) =>
                item.key === key
                  ? { ...item, quantity: item.quantity + quantity }
                  : item,
              ),
              isDrawerOpen: true,
            };
          }

          return {
            items: [...state.items, { ...input, key, quantity }],
            isDrawerOpen: true,
          };
        }),

      updateQuantity: (key, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((item) => item.key !== key)
              : state.items.map((item) =>
                  item.key === key ? { ...item, quantity } : item,
                ),
        })),

      removeItem: (key) =>
        set((state) => ({
          items: state.items.filter((item) => item.key !== key),
        })),

      clearCart: () => set({ items: [] }),

      setHasHydrated: (value) => set({ hasHydrated: value }),
      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
    }),
    {
      name: "onyx-cart",
      version: 1,
      partialize: (state) => ({ items: state.items }),
      // Any older/foreign shape in localStorage is discarded rather than
      // trusted — a fresh empty cart beats a console error or a crash.
      migrate: (persisted) => {
        const items = (persisted as Partial<CartState> | undefined)?.items;
        return { items: Array.isArray(items) ? items : [] };
      },
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

/**
 * Live mode: the WooCommerce Store API session (via the httpOnly cookies
 * set by src/app/api/store/**) is the one source of truth, so every action
 * still calls the proxy and replaces `items` with whatever WooCommerce
 * actually returns. But that round-trip is a real network call to a remote
 * host, so each action first applies the same change locally (optimistic
 * update) for instant feedback, snapshotting the prior state to roll back
 * to if the request fails. `hasHydrated` flips true once the initial GET
 * /cart below resolves.
 */
const useLiveCartStore = create<CartState>((set, get) => ({
  items: [],
  hasHydrated: false,
  isDrawerOpen: false,
  setHasHydrated: (value) => set({ hasHydrated: value }),
  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),

  addItem: (input, quantity = 1) => {
    const previousItems = get().items;
    // Live cart items carry WooCommerce's own hash `key`, never the
    // `productId:variationId` shape `lineKey` produces (that's the mock
    // store's key format) — matching on `key` here would never find an
    // already-in-cart item and would add a bogus duplicate row instead of
    // bumping the real one, whose fake key WooCommerce then rejects as soon
    // as it's used in an update/remove call. Match on product identity
    // instead, which every live cart item actually has.
    const existing = previousItems.find(
      (item) =>
        item.productId === input.productId && item.variationId === input.variationId,
    );

    set({
      items: existing
        ? previousItems.map((item) =>
            item === existing ? { ...item, quantity: item.quantity + quantity } : item,
          )
        : [
            ...previousItems,
            { ...input, key: lineKey(input.productId, input.variationId), quantity },
          ],
      isDrawerOpen: true,
    });

    addLiveCartItem(input, quantity)
      .then((items) => set({ items }))
      .catch((error) => {
        logCartError("addItem", error);
        set({ items: previousItems });
      });
  },

  updateQuantity: (key, quantity) => {
    const previousItems = get().items;
    set({
      items:
        quantity <= 0
          ? previousItems.filter((item) => item.key !== key)
          : previousItems.map((item) => (item.key === key ? { ...item, quantity } : item)),
    });

    const request =
      quantity <= 0 ? removeLiveCartItem(key) : updateLiveCartItem(key, quantity);
    request
      .then((items) => set({ items }))
      .catch((error) => {
        logCartError("updateQuantity", error);
        set({ items: previousItems });
      });
  },

  removeItem: (key) => {
    const previousItems = get().items;
    set({ items: previousItems.filter((item) => item.key !== key) });

    removeLiveCartItem(key)
      .then((items) => set({ items }))
      .catch((error) => {
        logCartError("removeItem", error);
        set({ items: previousItems });
      });
  },

  clearCart: () => {
    const previousItems = get().items;
    set({ items: [] });

    clearLiveCart().catch((error) => {
      logCartError("clearCart", error);
      set({ items: previousItems });
    });
  },
}));

if (IS_LIVE && typeof window !== "undefined") {
  fetchLiveCart()
    .then((items) => useLiveCartStore.setState({ items, hasHydrated: true }))
    .catch((error) => {
      logCartError("initial fetch", error);
      // Surface as hydrated-but-empty rather than stuck in a permanent
      // loading state if the very first cart fetch fails.
      useLiveCartStore.setState({ hasHydrated: true });
    });
}

export const useCartStore = IS_LIVE ? useLiveCartStore : useMockCartStore;

export function cartSubtotal(items: CartLineItem[]): number {
  return items.reduce(
    (sum, item) => sum + Number.parseFloat(item.price) * item.quantity,
    0,
  );
}

export function cartItemCount(items: CartLineItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}
