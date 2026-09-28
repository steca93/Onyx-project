import Image from "next/image";
import type { CSSProperties } from "react";
import type { ProductImage } from "@/lib/repo/types";

export interface ImageSlotProps {
  image: ProductImage | null;
  width?: number;
  height?: number;
  aspectRatio?: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  className?: string;
  diamond?: boolean;
}

export function ImageSlot({
  image,
  width,
  height,
  aspectRatio,
  fill,
  sizes,
  priority,
  className = "",
  diamond,
}: ImageSlotProps) {
  const shapeClass = diamond ? "diamond" : "";
  const sizingStyle: CSSProperties = fill
    ? {}
    : { width, height, aspectRatio };

  if (!image || image.sourceUrl === "") {
    return (
      <div
        className={`flex items-center justify-center overflow-hidden bg-onyx-800 ${fill ? "absolute inset-0" : ""} ${shapeClass} ${className}`}
        style={sizingStyle}
      >
        <span className="px-6 text-center text-[10px] leading-relaxed tracking-[.2em] text-text-40 uppercase font-mono">
          {image?.altText ?? "SLIKA UBRZO"}
        </span>
      </div>
    );
  }

  if (fill) {
    return (
      <div className={`absolute inset-0 overflow-hidden ${shapeClass} ${className}`}>
        <Image
          src={image.sourceUrl}
          alt={image.altText}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`overflow-hidden ${shapeClass} ${className}`}
      style={sizingStyle}
    >
      <Image
        src={image.sourceUrl}
        alt={image.altText}
        width={width}
        height={height}
        priority={priority}
        className="h-full w-full object-cover"
      />
    </div>
  );
}
