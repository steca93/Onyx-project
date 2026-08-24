import type { ProductImage } from "@/lib/repo/types";

export interface CartLineItem {
  /** Keys the line item: `${productId}:${variationId ?? "-"}` */
  key: string;
  productId: string;
  variationId: string | null;
  slug: string;
  name: string;
  image: ProductImage | null;
  /** Raw Woo-style price string, e.g. "142900". Format with formatPrice(). */
  price: string;
  quantity: number;
  attributes?: { name: string; value: string }[];
}

export interface AddToCartInput {
  productId: string;
  variationId: string | null;
  slug: string;
  name: string;
  image: ProductImage | null;
  price: string;
  attributes?: { name: string; value: string }[];
}
