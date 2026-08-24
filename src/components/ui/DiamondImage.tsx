import type { ProductImage } from "@/lib/repo/types";
import { ImageSlot } from "./ImageSlot";

export interface DiamondImageProps {
  image: ProductImage | null;
  size?: number;
  className?: string;
}

export function DiamondImage({ image, size = 320, className = "" }: DiamondImageProps) {
  return (
    <ImageSlot
      image={image}
      width={size}
      height={size}
      diamond
      className={className}
    />
  );
}
