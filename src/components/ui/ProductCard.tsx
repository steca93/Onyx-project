import { Link } from "@/i18n/navigation";
import type { AnyProduct } from "@/lib/repo/types";
import { formatPrice } from "@/lib/utils/format-price";
import { Badge } from "./Badge";
import { ImageSlot } from "./ImageSlot";

export interface ProductCardProps {
  product: AnyProduct;
  badge?: string;
}

export function ProductCard({ product, badge }: ProductCardProps) {
  const displayBadge = badge ?? (product.newArrival ? "NOVO" : undefined);

  return (
    <Link
      href={`/proizvod/${product.slug}`}
      className="group notch notch-18 flex min-w-0 flex-col border border-hairline bg-onyx-800 transition-colors duration-200 hover:border-[rgba(42,179,230,.4)]"
    >
      <div className="relative h-[232px] border-b border-hairline">
        <ImageSlot image={product.image} fill sizes="(min-width: 1200px) 25vw, 50vw" />
        {displayBadge && (
          <Badge className="absolute top-0 left-0">{displayBadge}</Badge>
        )}
      </div>
      <div className="flex flex-col gap-3 p-5">
        <div className="text-product-name text-text">{product.name}</div>
        <div className="text-price-sm text-accent">
          {formatPrice(product.price ?? product.regularPrice)}
        </div>
      </div>
    </Link>
  );
}
