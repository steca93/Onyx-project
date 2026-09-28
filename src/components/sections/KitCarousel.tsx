"use client";

import { useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { KitCard } from "@/components/ui/KitCard";
import type { AnyProduct } from "@/lib/repo/types";

export interface KitCarouselProps {
  kits: { product: AnyProduct; kicker: string }[];
}

export function KitCarousel({ kits }: KitCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const lastPage = 1;

  function scrollToPage(next: number) {
    const clamped = Math.max(0, Math.min(lastPage, next));
    setPage(clamped);
    const track = trackRef.current;
    const card = track?.firstElementChild as HTMLElement | null;
    if (!track || !card) return;
    const step = card.offsetWidth + 24;
    track.scrollTo({ left: clamped * step, behavior: "smooth" });
  }

  return (
    <section className="container-onyx mt-19 lg:mt-24">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <Eyebrow className="mb-4">IZDVOJENO</Eyebrow>
          <h2 className="text-[32px] sm:text-h2">Setovi za montažu</h2>
        </div>
        <div className="hidden gap-2.5 sm:flex">
          <button
            type="button"
            aria-label="Prethodni setovi"
            disabled={page === 0}
            onClick={() => scrollToPage(page - 1)}
            className="flex h-11.5 w-11.5 items-center justify-center border border-hairline-strong text-text-60 transition-colors duration-200 hover:border-accent hover:text-accent disabled:opacity-30"
          >
            <ChevronLeftIcon />
          </button>
          <button
            type="button"
            aria-label="Sledeći setovi"
            disabled={page === lastPage}
            onClick={() => scrollToPage(page + 1)}
            className="flex h-11.5 w-11.5 items-center justify-center border border-hairline-strong text-text-60 transition-colors duration-200 hover:border-accent hover:text-accent disabled:opacity-30"
          >
            <ChevronRightIcon />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {kits.map(({ product, kicker }) => (
          <div key={product.id} className="snap-start">
            <KitCard product={product} kicker={kicker} />
          </div>
        ))}
      </div>

      <div className="mt-7 hidden gap-2 sm:flex">
        {[0, 1].map((i) => (
          <button
            key={i}
            type="button"
            aria-label={`Idi na stranicu ${i + 1}`}
            aria-current={page === i}
            onClick={() => scrollToPage(i)}
            className={`h-0.5 w-8.5 ${page === i ? "bg-accent" : "bg-[rgba(255,255,255,.18)]"}`}
          />
        ))}
      </div>
    </section>
  );
}
