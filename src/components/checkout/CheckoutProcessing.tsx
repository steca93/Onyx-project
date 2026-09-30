"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";

/**
 * The mark's six facets (same geometry as src/app/icon.svg), listed
 * clockwise from the left so the gleam travels around the stone. Shading
 * comes from the accent token at different opacities instead of the icon's
 * own hexes, so it stays on the palette.
 */
const FACETS = [
  { points: "32,10 12,32 32,32", shade: 0.2 },
  { points: "32,10 20,21 32,24", shade: 0.32 },
  { points: "32,10 44,21 32,24", shade: 0.95 },
  { points: "32,10 32,32 52,32", shade: 0.68 },
  { points: "32,32 52,32 32,54", shade: 0.88 },
  { points: "12,32 32,32 32,54", shade: 0.46 },
];
/** Must match the facet-gleam duration in globals.css. */
const GLEAM_CYCLE_S = 2.4;

/** After these, the status line tells the customer to keep waiting. */
const LONG_AFTER_MS = 4_000;
const SLOW_AFTER_MS = 15_000;

export interface CheckoutProcessingProps {
  /**
   * True once the order went through. Drops the leave-page warning so the
   * redirect to the confirmation page is never blocked by it (e.g. when
   * Next falls back to a full browser navigation).
   */
  placed?: boolean;
}

/**
 * Full-screen overlay while an order is being placed (the WooCommerce
 * checkout call can take ~10 s). Stays up through the redirect to the
 * confirmation page; the caller unmounts it only on failure.
 */
export function CheckoutProcessing({ placed = false }: CheckoutProcessingProps) {
  const t = useTranslations("CheckoutPage");
  const [phase, setPhase] = useState<"start" | "long" | "slow">("start");
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase("long"), LONG_AFTER_MS),
      setTimeout(() => setPhase("slow"), SLOW_AFTER_MS),
    ];

    // Move focus off the (now inert) submit button and lock page scroll.
    dialogRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      timers.forEach(clearTimeout);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  // Ask before a reload or tab close interrupts an order still in flight.
  useEffect(() => {
    if (placed) return;
    const warnBeforeUnload = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warnBeforeUnload);
    return () => window.removeEventListener("beforeunload", warnBeforeUnload);
  }, [placed]);

  const status = {
    start: t("processingStatus"),
    long: t("processingStatusLong"),
    slow: t("processingStatusSlow"),
  }[phase];

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-processing-heading"
      tabIndex={-1}
      className="fixed inset-0 z-50 flex items-center justify-center bg-onyx-900/95 px-6 backdrop-blur-[14px] focus:outline-none"
    >
      <div className="flex max-w-[520px] flex-col items-center text-center">
        <svg viewBox="0 0 64 64" className="size-24 sm:size-30" aria-hidden>
          {FACETS.map((facet) => (
            <polygon key={facet.points} points={facet.points} className="fill-accent" fillOpacity={facet.shade} />
          ))}
          {FACETS.map((facet, i) => (
            <polygon
              key={facet.points}
              points={facet.points}
              className="animate-facet-gleam fill-accent-hi opacity-0"
              style={{ animationDelay: `${(i * GLEAM_CYCLE_S) / FACETS.length}s` }}
            />
          ))}
        </svg>

        <div className="relative mt-10 h-px w-[220px] overflow-hidden bg-hairline" aria-hidden>
          <span className="absolute inset-y-0 left-0 w-[30%] animate-hairline-scan bg-accent motion-reduce:hidden" />
        </div>

        <Eyebrow className="mt-10 mb-5">{t("processingEyebrow")}</Eyebrow>
        <h2 id="checkout-processing-heading" className="text-[32px] sm:text-h2">
          {t("processingHeadingLine1")}
          <br />
          <span className="text-accent">{t("processingHeadingLine2")}</span>
        </h2>
        <p
          role="status"
          aria-live="polite"
          className="mt-7 min-h-[3.5em] font-mono text-[12px] leading-relaxed tracking-[.16em] text-text-60 uppercase"
        >
          {status}
        </p>
      </div>
    </div>
  );
}
