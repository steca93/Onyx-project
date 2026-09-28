import type { CartLineItem } from "@/lib/cart/types";
import { submitLiveOrder } from "./live-client";
import type { CheckoutFormValues } from "./schema";

/** Client-visible mirror of the server-only `DATA_SOURCE` — both must be
 * set together (see .env.example), same pattern as src/lib/cart/store.ts. */
const IS_LIVE = process.env.NEXT_PUBLIC_DATA_SOURCE === "live";

export interface OrderSnapshot {
  orderNumber: string;
  delivery: CheckoutFormValues;
  items: CartLineItem[];
  total: number;
}

export interface SubmitOrderInput {
  delivery: CheckoutFormValues;
  items: CartLineItem[];
  total: number;
}

/**
 * TODO(payments): wire a real payment gateway here (Banka Intesa card
 * processing arrives later) — only "cod" actually places a real order today.
 * In live mode this posts the cart's real WooCommerce session to the Store
 * API's checkout endpoint, so the order shows up in wp-admin. In mock mode
 * it stays a pure client-side stub that manufactures an order number, since
 * there is no backend to talk to.
 */
export async function submitOrder(input: SubmitOrderInput): Promise<OrderSnapshot> {
  if (IS_LIVE) {
    const order = await submitLiveOrder(input.delivery);
    return {
      orderNumber: `#${order.orderNumber}`,
      delivery: input.delivery,
      items: input.items,
      // The real total WooCommerce charged (items + shipping + tax), not
      // the pre-checkout client-side subtotal in input.total — see
      // fetchCartTotal() in live-client.ts for why those can differ.
      total: order.total,
    };
  }

  const orderNumber = `ONX-${Date.now().toString(36).toUpperCase()}`;

  return {
    orderNumber,
    delivery: input.delivery,
    items: input.items,
    total: input.total,
  };
}

const ORDER_STORAGE_KEY = "onyx-last-order";

export function storeLastOrder(order: OrderSnapshot): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(order));
}

export function readLastOrder(): OrderSnapshot | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(ORDER_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as OrderSnapshot;
  } catch {
    return null;
  }
}
