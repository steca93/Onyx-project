"use client";

import { useState } from "react";
import { ImageSlot } from "@/components/ui/ImageSlot";
import type { ProductImage } from "@/lib/repo/types";

export interface ProductGalleryProps {
  mainImage: ProductImage | null;
  gallery: ProductImage[];
}

export function ProductGallery({ mainImage, gallery }: ProductGalleryProps) {
  const images = [mainImage, ...gallery].filter(
    (img): img is ProductImage => Boolean(img),
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex] ?? null;
  const thumbnails = images.slice(0, 4);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-[4/3.6] border border-hairline bg-onyx-800">
        <ImageSlot image={active} fill sizes="(min-width: 1200px) 50vw, 100vw" priority />
      </div>
      {thumbnails.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {thumbnails.map((img, i) => (
            <button
              key={img.sourceUrl + img.altText + i}
              type="button"
              aria-label={`Prikaži sliku ${i + 1}`}
              aria-current={i === activeIndex}
              onClick={() => setActiveIndex(i)}
              className={`relative aspect-square border transition-colors duration-200 ${
                i === activeIndex ? "border-accent" : "border-hairline hover:border-hairline-strong"
              }`}
            >
              <ImageSlot image={img} fill sizes="120px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
