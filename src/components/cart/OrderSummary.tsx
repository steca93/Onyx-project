import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { OrderItemRow } from "@/components/cart/OrderItemRow";
import { siteSettings } from "@/data/site-settings";
import type { CartLineItem } from "@/lib/cart/types";
import { cartSubtotal } from "@/lib/cart/store";
import { formatPrice } from "@/lib/utils/format-price";

export interface OrderSummaryProps {
  items: CartLineItem[];
  showShippingProgress?: boolean;
  /** Checkout needs the actual items (image, variant, qty) visible the whole
   * time it's on screen — /korpa already lists them in the main column, so
   * it leaves this off to avoid showing the same list twice. */
  showItems?: boolean;
  children?: ReactNode;
}

export function OrderSummary({
  items,
  showShippingProgress = false,
  showItems = false,
  children,
}: OrderSummaryProps) {
  const t = useTranslations("OrderSummary");
  const subtotal = cartSubtotal(items);
  const threshold = siteSettings.freeShippingThresholdRsd;
  const remaining = Math.max(0, threshold - subtotal);
  const progress = Math.min(100, (subtotal / threshold) * 100);

  return (
    <div className="bg-promo-panel border border-hairline p-7 sm:p-8">
      <div className="eyebrow mb-6">{t("heading")}</div>

      {showItems && (
        <div className="mb-6 flex flex-col gap-5 border-b border-hairline pb-6">
          {items.map((item) => (
            <OrderItemRow key={item.key} item={item} />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between text-body-sm text-text-60">
        <span>{t("subtotal")}</span>
        <span className="text-price-sm text-text">{formatPrice(subtotal)}</span>
      </div>

      {showShippingProgress && (
        <div className="mt-6">
          {remaining > 0 ? (
            <p className="font-mono text-[10px] tracking-[.1em] text-text-40 uppercase">
              {t("remainingForFreeShipping", { amount: formatPrice(remaining) })}
            </p>
          ) : (
            <p className="font-mono text-[10px] tracking-[.1em] text-success uppercase">
              {t("freeShippingReached")}
            </p>
          )}
          <div className="mt-2.5 h-1 w-full border border-hairline bg-onyx-800">
            <div
              className="h-full bg-accent transition-[width] duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="mt-6 flex items-center justify-between border-t border-hairline pt-6">
        <span className="text-body text-text">{t("total")}</span>
        <span className="text-price text-accent">{formatPrice(subtotal)}</span>
      </div>

      {children && <div className="mt-7">{children}</div>}
    </div>
  );
}
