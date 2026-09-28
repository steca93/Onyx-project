"use client";

import { useTranslations } from "next-intl";
import { CartLineItemRow } from "@/components/cart/CartLineItemRow";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { useCartStore } from "@/lib/cart/store";

export default function CartPage() {
  const t = useTranslations("CartPage");
  const hasHydrated = useCartStore((s) => s.hasHydrated);
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    // min-h: the cart only renders after the client store hydrates, and the
    // loading/empty/filled states differ in height — keep the footer below
    // the fold in all of them so nothing shifts (CLS).
    <div className="container-onyx min-h-[75vh] py-16 sm:py-20 lg:py-24">
      <Eyebrow className="mb-4">{t("eyebrow")}</Eyebrow>
      <h1 className="text-[32px] sm:text-h2">{t("heading")}</h1>

      {!hasHydrated ? (
        <div className="mt-16 h-40" />
      ) : items.length === 0 ? (
        <div className="mt-16 flex flex-col items-start gap-6 border-t border-hairline pt-12">
          <p className="font-mono text-[11px] tracking-[.1em] text-text-40 uppercase">
            {t("empty")}
          </p>
          <Button href="/" trailingArrow>
            {t("continueShopping")}
          </Button>
        </div>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_380px]">
          <div className="min-w-0 border-t border-hairline">
            {items.map((item) => (
              <CartLineItemRow
                key={item.key}
                item={item}
                onQuantityChange={(q) => updateQuantity(item.key, q)}
                onRemove={() => removeItem(item.key)}
              />
            ))}
          </div>

          <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
            <OrderSummary items={items} showShippingProgress>
              <Button href="/kasa" trailingArrow className="w-full">
                {t("proceedToCheckout")}
              </Button>
            </OrderSummary>
          </div>
        </div>
      )}
    </div>
  );
}
