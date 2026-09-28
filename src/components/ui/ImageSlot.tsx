import Image from "next/image";
import { useTranslations } from "next-intl";
import type { CSSProperties } from "react";
import type { ProductImage } from "@/lib/repo/types";

export interface ImageSlotProps {
  image: ProductImage | null;
  width?: number;
  height?: number;
  aspectRatio?: string;
  fill?: boolean;
  sizes?: string;
  /** Mark only a template's LCP image: loads eagerly with
   * fetchpriority="high" (Next 16 deprecates `priority` for this). */
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
  const t = useTranslations("ImageSlot");
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
          {image?.altText ?? t("placeholder")}
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
          {...(priority ? { loading: "eager" as const, fetchPriority: "high" as const } : {})}
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
        sizes={sizes}
        {...(priority ? { loading: "eager" as const, fetchPriority: "high" as const } : {})}
        className="h-full w-full object-cover"
      />
    </div>
  );
}
