"use client";

import { Link } from "@/i18n/navigation";
import { useEffect } from "react";
import { CloseIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import type { CartLineItem } from "@/lib/cart/types";
import { cartItemCount, cartSubtotal, useCartStore } from "@/lib/cart/store";
import { formatPrice } from "@/lib/utils/format-price";

interface CartDrawerLineItemProps {
  item: CartLineItem;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}

function CartDrawerLineItem({
  item,
  onQuantityChange,
  onRemove,
}: CartDrawerLineItemProps) {
  const lineTotal = Number.parseFloat(item.price) * item.quantity;

  return (
    <div className="flex gap-4 border-b border-hairline py-5">
      <Link
        href={`/proizvod/${item.slug}`}
        className="relative h-16 w-16 shrink-0 border border-hairline bg-onyx-800"
      >
        <ImageSlot image={item.image} fill sizes="64px" />
      </Link>

      <div className="min-w-0 flex-1">
        <Link
          href={`/proizvod/${item.slug}`}
          className="text-product-name line-clamp-2 text-text hover:text-accent"
        >
          {item.name}
        </Link>
        {item.attributes && item.attributes.length > 0 && (
          <div className="mt-1.5 font-mono text-[10px] tracking-[.1em] text-text-40 uppercase">
            {item.attributes.map((a) => `${a.label}: ${a.value}`).join(" · ")}
          </div>
        )}

        <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
          <QuantityStepper value={item.quantity} onChange={onQuantityChange} />
          <div className="flex shrink-0 items-center gap-3">
            <span className="text-price text-accent whitespace-nowrap">
              {formatPrice(lineTotal)}
            </span>
            <button
              type="button"
              aria-label="Ukloni"
              onClick={onRemove}
              className="cursor-pointer text-text-40 transition-colors duration-200 hover:text-danger"
            >
              <CloseIcon size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isDrawerOpen);
  const hasHydrated = useCartStore((s) => s.hasHydrated);
  const items = useCartStore((s) => s.items);
  const closeDrawer = useCartStore((s) => s.closeDrawer);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const count = hasHydrated ? cartItemCount(items) : 0;
  const subtotal = cartSubtotal(items);

  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeDrawer();
    }
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, closeDrawer]);

  return (
    <div
      className={`fixed inset-0 z-50 ${isOpen ? "" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
    >
      <div
        onClick={closeDrawer}
        className={`absolute inset-0 cursor-pointer bg-onyx-900/70 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Korpa"
        className={`absolute top-0 right-0 flex h-full w-full flex-col border-l border-hairline bg-onyx-850 transition-transform duration-300 ease-[cubic-bezier(.22,.61,.36,1)] lg:max-w-[420px] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-hairline px-6">
          <span className="label-nav text-text">
            KORPA <span className="text-text-40">({count})</span>
          </span>
          <button
            type="button"
            aria-label="Zatvori korpu"
            onClick={closeDrawer}
            className="cursor-pointer text-text-60 transition-colors duration-200 hover:text-text"
          >
            <CloseIcon />
          </button>
        </div>

        {!hasHydrated ? (
          <div className="flex-1" />
        ) : items.length === 0 ? (
          <div className="flex flex-1 flex-col items-start gap-6 px-6 py-12">
            <p className="font-mono text-[11px] tracking-[.1em] text-text-40 uppercase">
              Vaša korpa je prazna
            </p>
            <Button href="/" trailingArrow onClick={closeDrawer}>
              NASTAVI KUPOVINU
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6">
              {items.map((item) => (
                <CartDrawerLineItem
                  key={item.key}
                  item={item}
                  onQuantityChange={(q) => updateQuantity(item.key, q)}
                  onRemove={() => removeItem(item.key)}
                />
              ))}
            </div>

            <div className="shrink-0 border-t border-hairline px-6 py-6">
              <div className="flex items-center justify-between">
                <span className="text-body text-text">Međuzbir</span>
                <span className="text-price text-accent">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <div className="mt-5 flex flex-col gap-3">
                <Button
                  href="/kasa"
                  trailingArrow
                  className="w-full"
                  onClick={closeDrawer}
                >
                  NASTAVI NA PLAĆANJE
                </Button>
                <Button
                  href="/korpa"
                  variant="secondary"
                  className="w-full"
                  onClick={closeDrawer}
                >
                  PRIKAŽI KORPU
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
