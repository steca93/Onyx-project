"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { CheckoutProcessing } from "@/components/checkout/CheckoutProcessing";
import { DeliveryForm } from "@/components/checkout/DeliveryForm";
import { PaymentMethodSection } from "@/components/checkout/PaymentMethodSection";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Textarea } from "@/components/ui/Textarea";
import { siteSettings } from "@/data/site-settings";
import { cartSubtotal, useCartStore } from "@/lib/cart/store";
import { CheckoutError } from "@/lib/checkout/live-client";
import {
  createCheckoutSchema,
  type CheckoutFormValues,
} from "@/lib/checkout/schema";
import { storeLastOrder, submitOrder } from "@/lib/checkout/submit-order";
import { formatPrice } from "@/lib/utils/format-price";

export default function CheckoutPage() {
  const t = useTranslations("CheckoutPage");
  const tErrors = useTranslations("CheckoutErrors");
  const router = useRouter();

  const SECTIONS = [
    { number: "01", title: t("sectionDelivery") },
    { number: "02", title: t("sectionPayment") },
    { number: "03", title: t("sectionReview") },
  ];

  const checkoutSchema = createCheckoutSchema((key) => tErrors(`validation.${key}`));

  const hasHydrated = useCartStore((s) => s.hasHydrated);
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { paymentMethod: "cod", acceptTerms: false },
  });

  const [submitError, setSubmitError] = useState<string | null>(null);
  // Not RHF's isSubmitting: that is also true while validation runs, which
  // would flash the overlay on every invalid submit. Set only once the
  // order is actually being sent, and kept on success until the redirect.
  const [processing, setProcessing] = useState(false);
  const [placed, setPlaced] = useState(false);
  const errorBoxRef = useRef<HTMLDivElement>(null);

  const values = useWatch({ control });
  const errorList = [
    ...Object.values(errors)
      .map((e) => e?.message)
      .filter((m): m is string => Boolean(m)),
    ...(submitError ? [submitError] : []),
  ];

  // The error box sits at the top of the form while "Potvrdi porudžbinu" is
  // in the sticky sidebar, often further down the page (especially on
  // mobile) — without this, a failed submit shows an error the user has to
  // already know to scroll up for.
  useEffect(() => {
    if (submitError) {
      errorBoxRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [submitError]);

  async function onSubmit(delivery: CheckoutFormValues) {
    setSubmitError(null);
    setProcessing(true);
    const total = cartSubtotal(items);
    try {
      const order = await submitOrder({ delivery, items, total });
      storeLastOrder(order);
      setPlaced(true);
      clearCart();
      router.push("/potvrda-porudzbine");
    } catch (error) {
      console.error("onyx-checkout: submitOrder failed", error);
      setProcessing(false);
      setSubmitError(
        tErrors(`submit.${error instanceof CheckoutError ? error.code : "generic"}`),
      );
    }
  }

  // Rendered as the first child of the returned fragment in both branches
  // below, so React keeps the same instance (and its timers) when
  // clearCart() switches the page to the empty-cart branch mid-redirect.
  const overlay = processing ? <CheckoutProcessing placed={placed} /> : null;

  if (!hasHydrated) {
    return <div className="container-onyx py-24" />;
  }

  if (items.length === 0) {
    // clearCart() runs before the redirect to the confirmation page — keep
    // the overlay up instead of flashing the "your cart is empty" screen.
    if (processing) return <>{overlay}</>;
    return (
      <div className="container-onyx py-16 sm:py-20 lg:py-24">
        <Eyebrow className="mb-4">{t("eyebrow")}</Eyebrow>
        <h1 className="text-[32px] sm:text-h2">{t("heading")}</h1>
        <div className="mt-16 flex flex-col items-start gap-6 border-t border-hairline pt-12">
          <p className="font-mono text-[11px] tracking-[.1em] text-text-40 uppercase">
            {t("emptyCart")}
          </p>
          <Button href="/korpa" trailingArrow>
            {t("backToCart")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {overlay}
      <div className="container-onyx py-16 sm:py-20 lg:py-24">
        <Eyebrow className="mb-4">{t("eyebrow")}</Eyebrow>
        <h1 className="text-[32px] sm:text-h2">{t("heading")}</h1>

        <p className="mt-6 max-w-[620px] border border-hairline bg-onyx-800 px-5 py-4 font-mono text-[11px] tracking-[.08em] text-text-60 uppercase">
          {t("shippingNotice", {
            amount: formatPrice(siteSettings.freeShippingThresholdRsd),
          })}
        </p>

        <form
          inert={processing}
          onSubmit={handleSubmit(onSubmit)}
          className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_380px]"
        >
          <div className="min-w-0 space-y-10">
            {errorList.length > 0 && (
              <div
                ref={errorBoxRef}
                className="border border-danger px-5 py-4 font-mono text-[11px] tracking-[.05em] text-danger"
              >
                {errorList.map((message) => (
                  <p key={message}>{message}</p>
                ))}
              </div>
            )}

            <section className="border-t border-hairline pt-8">
              <div className="mb-6 flex items-center gap-3">
                <span className="text-step-numeral text-accent">
                  {SECTIONS[0].number}
                </span>
                <span className="label-nav text-text">{SECTIONS[0].title}</span>
              </div>
              <DeliveryForm register={register} errors={errors} />
            </section>

            <section className="border-t border-hairline pt-8">
              <div className="mb-6 flex items-center gap-3">
                <span className="text-step-numeral text-accent">
                  {SECTIONS[1].number}
                </span>
                <span className="label-nav text-text">{SECTIONS[1].title}</span>
              </div>
              <PaymentMethodSection register={register} />
            </section>

            <section className="border-t border-hairline pt-8">
              <div className="mb-6 flex items-center gap-3">
                <span className="text-step-numeral text-accent">
                  {SECTIONS[2].number}
                </span>
                <span className="label-nav text-text">{SECTIONS[2].title}</span>
              </div>
              <div className="flex flex-col gap-6">
                {values.address && (
                  <p className="text-body-sm text-text-40">
                    {t("deliverTo", {
                      address: `${values.address}${values.city ? `, ${values.city}` : ""}${
                        values.postalCode ? ` ${values.postalCode}` : ""
                      }`,
                    })}
                  </p>
                )}
                <Textarea
                  label={t("notesLabel")}
                  rows={3}
                  placeholder={t("notesPlaceholder")}
                  {...register("notes")}
                  error={errors.notes?.message}
                />
              </div>
            </section>
          </div>

          <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
            <OrderSummary items={items} showItems>
              <Checkbox
                label={t.rich("acceptTerms", {
                  termsLink: (chunks) => (
                    <Link
                      href="/uslovi-koriscenja"
                      target="_blank"
                      className="text-accent underline underline-offset-2 hover:no-underline"
                    >
                      {chunks}
                    </Link>
                  ),
                })}
                {...register("acceptTerms")}
                error={errors.acceptTerms?.message}
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                trailingArrow
                className="mt-5 w-full"
              >
                {isSubmitting ? t("submitting") : t("submit")}
              </Button>
            </OrderSummary>
          </div>
        </form>
      </div>
    </>
  );
}
