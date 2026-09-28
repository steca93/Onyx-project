import Link from "next/link";
import type { AnyProduct } from "@/lib/repo/types";
import { formatPrice } from "@/lib/utils/format-price";
import { ImageSlot } from "./ImageSlot";

export interface KitCardProps {
  product: AnyProduct;
  kicker: string;
  className?: string;
}

export function KitCard({ product, kicker, className = "" }: KitCardProps) {
  return (
    <Link
      href={`/proizvod/${product.slug}`}
      className={`group notch notch-22 flex w-[424px] shrink-0 flex-col border border-hairline bg-onyx-800 transition-colors duration-200 hover:border-[rgba(42,179,230,.4)] ${className}`}
    >
      <div className="relative h-[300px] border-b border-hairline">
        <ImageSlot image={product.image} fill sizes="424px" />
      </div>
      <div className="flex flex-col gap-4 p-[26px]">
        <div className="label-column text-text-40">{kicker}</div>
        <div className="text-kit-name text-text">{product.name}</div>
        <div className="text-price text-accent">
          {formatPrice(product.price ?? product.regularPrice)}
        </div>
      </div>
    </Link>
  );
}
