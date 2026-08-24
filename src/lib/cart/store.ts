import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AddToCartInput, CartLineItem } from "./types";

function lineKey(productId: string, variationId: string | null): string {
  return `${productId}:${variationId ?? "-"}`;
}

interface CartState {
  items: CartLineItem[];
  hasHydrated: boolean;
  addItem: (input: AddToCartInput, quantity?: number) => void;
  updateQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
  setHasHydrated: (value: boolean) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      hasHydrated: false,

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
            };
          }

          return {
            items: [...state.items, { ...input, key, quantity }],
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
    }),
    {
      name: "onyx-cart",
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

export function cartSubtotal(items: CartLineItem[]): number {
  return items.reduce(
    (sum, item) => sum + Number.parseFloat(item.price) * item.quantity,
    0,
  );
}

export function cartItemCount(items: CartLineItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}
