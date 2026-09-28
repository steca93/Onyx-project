import Link from "next/link";
import { ImageSlot } from "@/components/ui/ImageSlot";
import type { CartLineItem } from "@/lib/cart/types";
import { formatPrice } from "@/lib/utils/format-price";

export interface OrderItemRowProps {
  item: CartLineItem;
}

/**
 * Read-only line item — image, name, selected attributes, quantity and line
 * total. Used wherever an order needs to be reviewed rather than edited
 * (checkout sidebar, order confirmation), as opposed to CartLineItemRow /
 * the cart drawer's row, which both let the shopper change quantity or
 * remove the item.
 */
export function OrderItemRow({ item }: OrderItemRowProps) {
  const lineTotal = Number.parseFloat(item.price) * item.quantity;

  return (
    <div className="flex gap-3.5">
      <Link
        href={`/proizvod/${item.slug}`}
        className="relative h-14 w-14 shrink-0 border border-hairline bg-onyx-900"
      >
        <ImageSlot image={item.image} fill sizes="56px" />
      </Link>

      <div className="min-w-0 flex-1">
        <Link
          href={`/proizvod/${item.slug}`}
          className="text-product-name line-clamp-2 text-text hover:text-accent"
        >
          {item.name}
        </Link>
        {item.attributes && item.attributes.length > 0 && (
          <div className="mt-1 font-mono text-[10px] tracking-[.1em] text-text-40 uppercase">
            {item.attributes.map((a) => `${a.label}: ${a.value}`).join(" · ")}
          </div>
        )}
        <div className="mt-1 font-mono text-[10px] tracking-[.1em] text-text-40 uppercase">
          Količina: {item.quantity}
        </div>
      </div>

      <div className="text-price-sm shrink-0 text-text">{formatPrice(lineTotal)}</div>
    </div>
  );
}
