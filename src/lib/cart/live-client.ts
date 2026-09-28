import type { AddToCartInput, CartLineItem } from "./types";

/**
 * Browser-side calls to our own same-origin proxy (`src/app/api/store/**`)
 * — never to the WordPress host directly. Shapes here match the WooCommerce
 * Store API's documented cart-item schema exactly (verified against
 * woocommerce/woocommerce-blocks' StoreApi/docs/cart-items.md), not guessed.
 */

interface RawCartItem {
  key: string;
  id: number;
  quantity: number;
  name: string;
  permalink: string;
  images: { src: string; alt: string }[];
  variation: { attribute: string; value: string }[];
  prices: {
    price: string;
    currency_minor_unit: number;
  };
}

interface RawCart {
  items: RawCartItem[];
}

function slugFromPermalink(permalink: string): string {
  try {
    const path = new URL(permalink).pathname;
    const segments = path.split("/").filter(Boolean);
    return segments[segments.length - 1] ?? "";
  } catch {
    return "";
  }
}

/** Store API prices are strings in the currency's minor unit (cents). */
function minorToMajorPrice(price: string, minorUnit: number): string {
  const amount = Number.parseInt(price, 10);
  if (Number.isNaN(amount)) return "0";
  return (amount / 10 ** minorUnit).toString();
}

function mapCartItem(raw: RawCartItem): CartLineItem {
  const hasVariation = raw.variation.length > 0;
  const image = raw.images[0];

  return {
    key: raw.key,
    productId: String(raw.id),
    variationId: hasVariation ? String(raw.id) : null,
    slug: slugFromPermalink(raw.permalink),
    name: raw.name,
    image: image ? { sourceUrl: image.src, altText: image.alt } : null,
    price: minorToMajorPrice(raw.prices.price, raw.prices.currency_minor_unit),
    quantity: raw.quantity,
    // WC's cart response only gives one (already display-formatted) string
    // per attribute — there's no separate raw slug to recover here, so
    // name/label are the same. Only matters for re-adding, which doesn't
    // happen from an already-in-cart line.
    attributes: hasVariation
      ? raw.variation.map((v) => ({ name: v.attribute, label: v.attribute, value: v.value }))
      : undefined,
  };
}

/**
 * The Store API session lives in the `Cart-Token`/`Nonce` cookies our proxy
 * sets from each response (see src/app/api/store/[...path]/route.ts). Those
 * cookies only settle once a response has fully landed — if two calls are
 * in flight at once (e.g. the initial `fetchLiveCart()` on mount racing a
 * click on "Dodaj u korpu"), both go out with whatever cookie existed
 * before either finished, WooCommerce opens two separate cart sessions,
 * and whichever response's Set-Cookie is processed last "wins" — silently
 * orphaning any item added under the other session. That surfaces later as
 * "Cart item no longer exists" on update/remove. Funneling every call
 * through one queue means a request only ever starts once the previous
 * one's cookies have already been applied, so this can't happen.
 */
let requestQueue: Promise<unknown> = Promise.resolve();

function enqueueRequest<T>(task: () => Promise<T>): Promise<T> {
  const run = requestQueue.then(task, task);
  requestQueue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

async function storeApiFetch(path: string, init?: RequestInit): Promise<RawCart> {
  return enqueueRequest(async () => {
    const res = await fetch(`/api/store/${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
    });

    const body = await res.json();
    if (!res.ok) {
      throw new Error(body?.message ?? "Greška u komunikaciji sa korpom.");
    }
    return body as RawCart;
  });
}

export async function fetchLiveCart(): Promise<CartLineItem[]> {
  const cart = await storeApiFetch("cart");
  return cart.items.map(mapCartItem);
}

export async function addLiveCartItem(
  input: AddToCartInput,
  quantity: number,
): Promise<CartLineItem[]> {
  if (!input.databaseId) {
    throw new Error("Proizvod nema važeći WooCommerce ID — nije moguće dodati u korpu.");
  }

  const body: { id: number; quantity: number; variation?: { attribute: string; value: string }[] } = {
    id: input.databaseId,
    quantity,
  };
  if (input.attributes?.length) {
    body.variation = input.attributes.map((a) => ({ attribute: a.name, value: a.value }));
  }

  const cart = await storeApiFetch("cart/add-item", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return cart.items.map(mapCartItem);
}

export async function updateLiveCartItem(
  key: string,
  quantity: number,
): Promise<CartLineItem[]> {
  const cart = await storeApiFetch("cart/update-item", {
    method: "POST",
    body: JSON.stringify({ key, quantity }),
  });
  return cart.items.map(mapCartItem);
}

export async function removeLiveCartItem(key: string): Promise<CartLineItem[]> {
  const cart = await storeApiFetch("cart/remove-item", {
    method: "POST",
    body: JSON.stringify({ key }),
  });
  return cart.items.map(mapCartItem);
}

export async function clearLiveCart(): Promise<void> {
  // Unlike every other cart endpoint, DELETE /cart/items responds with the
  // (now-empty) items array directly, not a wrapped `{ items }` cart object
  // — storeApiFetch's RawCart typing doesn't fit, so this calls fetch raw.
  // Still funneled through the same queue as every other call (see above).
  await enqueueRequest(async () => {
    const res = await fetch("/api/store/cart/items", { method: "DELETE" });
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      throw new Error(body?.message ?? "Greška prilikom pražnjenja korpe.");
    }
  });
}
