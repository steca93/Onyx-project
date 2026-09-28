import type { CheckoutFormValues } from "./schema";

/**
 * Browser-side call to our own same-origin proxy (`src/app/api/store/**`)
 * — never to the WordPress host directly. The checkout request body matches
 * the WooCommerce Store API's documented `POST /checkout` endpoint: it
 * accepts full billing/shipping addresses directly in the request and
 * places the order against whatever cart is already attached to the
 * Cart-Token/Nonce cookies our proxy manages — the same real WooCommerce
 * cart session src/lib/cart/live-client.ts has been adding items to. Its
 * *response*, confirmed against a real order placed on this store, carries
 * order_id/order_key/order_number/status and nothing else — no totals, no
 * line items — hence fetchCartTotal() below.
 */

export interface LiveOrderResult {
  orderId: number;
  orderKey: string;
  orderNumber: string;
  status: string;
  /** Real total (items + shipping + tax) as WooCommerce calculated it on
   * the cart just before checkout — see fetchCartTotal() for why this,
   * and not anything from the checkout response itself, is the source. */
  total: number;
}

interface StoreApiAddress {
  first_name: string;
  last_name: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
}

interface StoreApiOrderResponse {
  order_id: number;
  order_key: string;
  order_number: string;
  status: string;
}

/**
 * The Store API's checkout response carries no totals at all, and its
 * order-confirmation endpoint (`wc/store/v1/order/{id}`) formats its
 * order-level `totals` block off by a factor of 100 from every other money
 * value in the Store API (confirmed against a real order: an item's own
 * `line_total` was "300" — correct — while that same response's top-level
 * `totals.total_price` was "30000" for the same order). Rather than lean on
 * that inconsistency, this reads the cart's own totals — already proven
 * correctly scaled by src/lib/cart/live-client.ts — right before submitting
 * checkout; WooCommerce charges exactly that cart, unchanged, seconds later.
 */
async function fetchCartTotal(): Promise<number> {
  const res = await fetch("/api/store/cart");
  const body = await res.json().catch(() => null);
  const totals = body?.totals;
  const amount = Number.parseInt(totals?.total_price, 10);
  const minorUnit = Number(totals?.currency_minor_unit ?? 0);
  if (Number.isNaN(amount)) return 0;
  return amount / 10 ** minorUnit;
}

/** Store API wants first/last name split — the form only collects one field. */
function splitFullName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/);
  const firstName = parts[0] ?? "";
  const lastName = parts.slice(1).join(" ") || firstName;
  return { firstName, lastName };
}

export async function submitLiveOrder(
  delivery: CheckoutFormValues,
): Promise<LiveOrderResult> {
  const total = await fetchCartTotal();
  const { firstName, lastName } = splitFullName(delivery.fullName);

  const address: StoreApiAddress = {
    first_name: firstName,
    last_name: lastName,
    address_1: delivery.address,
    address_2: "",
    city: delivery.city,
    state: "",
    postcode: delivery.postalCode,
    country: "RS",
  };

  const res = await fetch("/api/store/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      billing_address: { ...address, email: delivery.email, phone: delivery.phone },
      shipping_address: address,
      payment_method: delivery.paymentMethod,
      payment_data: [],
      customer_note: delivery.notes ?? "",
    }),
  });

  const body = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(
      body?.message ?? "Greška prilikom slanja porudžbine. Pokušaj ponovo.",
    );
  }

  const order = body as StoreApiOrderResponse;
  return {
    orderId: order.order_id,
    orderKey: order.order_key,
    orderNumber: order.order_number,
    status: order.status,
    total,
  };
}
