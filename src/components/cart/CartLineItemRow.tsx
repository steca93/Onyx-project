import Link from "next/link";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { ImageSlot } from "@/components/ui/ImageSlot";
import type { CartLineItem } from "@/lib/cart/types";
import { formatPrice } from "@/lib/utils/format-price";

export interface CartLineItemRowProps {
  item: CartLineItem;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}

export function CartLineItemRow({
  item,
  onQuantityChange,
  onRemove,
}: CartLineItemRowProps) {
  const lineTotal = Number.parseFloat(item.price) * item.quantity;

  return (
    <div className="flex flex-col gap-5 border-b border-hairline py-6 sm:flex-row sm:items-center sm:gap-6">
      <Link
        href={`/proizvod/${item.slug}`}
        className="relative h-20 w-20 shrink-0 border border-hairline bg-onyx-800"
      >
        <ImageSlot image={item.image} fill sizes="80px" />
      </Link>

      <div className="min-w-0 flex-1">
        <Link
          href={`/proizvod/${item.slug}`}
          className="text-product-name block text-text hover:text-accent"
        >
          {item.name}
        </Link>
        {item.attributes && item.attributes.length > 0 && (
          <div className="mt-1.5 font-mono text-[10px] tracking-[.1em] text-text-40 uppercase">
            {item.attributes.map((a) => `${a.label}: ${a.value}`).join(" · ")}
          </div>
        )}
        <button
          type="button"
          onClick={onRemove}
          className="mt-2 cursor-pointer font-mono text-[10px] tracking-[.16em] text-text-40 uppercase transition-colors duration-200 hover:text-danger"
        >
          UKLONI
        </button>
      </div>

      <QuantityStepper value={item.quantity} onChange={onQuantityChange} />

      <div className="text-price w-28 shrink-0 text-right text-accent sm:text-left">
        {formatPrice(lineTotal)}
      </div>
    </div>
  );
}
