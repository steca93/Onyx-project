"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { OrderItemRow } from "@/components/cart/OrderItemRow";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { formatPrice } from "@/lib/utils/format-price";
import { readLastOrder, type OrderSnapshot } from "@/lib/checkout/submit-order";

export default function OrderConfirmationPage() {
  const t = useTranslations("OrderConfirmationPage");
  const [order, setOrder] = useState<OrderSnapshot | null | undefined>(
    undefined,
  );

  useEffect(() => {
    // Read sessionStorage only after mount so the client's first render
    // matches the server-rendered (window-less) markup — reading it during
    // render would desync hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrder(readLastOrder());
  }, []);

  if (order === undefined) {
    return <div className="container-onyx py-24" />;
  }

  if (!order) {
    return (
      <div className="container-onyx py-16 sm:py-20 lg:py-24">
        <Eyebrow className="mb-4">{t("noOrderEyebrow")}</Eyebrow>
        <h1 className="text-[32px] sm:text-h2">{t("noOrderHeading")}</h1>
        <p className="mt-6 max-w-[520px] text-body text-text-60">
          {t("noOrderBody")}
        </p>
        <Button href="/" trailingArrow className="mt-9">
          {t("backHome")}
        </Button>
      </div>
    );
  }

  return (
    <div className="container-onyx py-16 sm:py-20 lg:py-24">
      <Eyebrow className="mb-4">{t("eyebrow")}</Eyebrow>
      <h1 className="text-[32px] sm:text-h2">{t("heading")}</h1>
      <p className="mt-6 max-w-[520px] text-body text-text-60">
        {t("emailNotice", { email: order.delivery.email })}
      </p>

      <div className="mt-9 border border-hairline bg-onyx-800 px-7 py-6 sm:px-8">
        <div className="label-column mb-2 text-text-40">{t("orderNumber")}</div>
        <div className="text-price text-[22px] text-accent">
          {order.orderNumber}
        </div>
      </div>

      <div className="mt-10 max-w-[620px] border-t border-hairline pt-8">
        <div className="label-column mb-5 text-text-40">{t("items")}</div>
        <div className="flex flex-col gap-5">
          {order.items.map((item) => (
            <OrderItemRow key={item.key} item={item} />
          ))}
        </div>
        {order.delivery.notes && (
          <div className="mt-6 border-t border-hairline pt-5">
            <div className="label-column mb-2 text-text-40">{t("notes")}</div>
            <p className="text-body-sm text-text-60">{order.delivery.notes}</p>
          </div>
        )}
        <div className="mt-5 flex items-center justify-between border-t border-hairline pt-5">
          <span className="text-body text-text">{t("total")}</span>
          <span className="text-price text-accent">
            {formatPrice(order.total)}
          </span>
        </div>
      </div>

      <Button href="/" trailingArrow className="mt-10">
        {t("continueShopping")}
      </Button>
    </div>
  );
}
