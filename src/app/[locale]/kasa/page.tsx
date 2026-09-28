"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "@/i18n/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { DeliveryForm } from "@/components/checkout/DeliveryForm";
import { PaymentMethodSection } from "@/components/checkout/PaymentMethodSection";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Textarea } from "@/components/ui/Textarea";
import { siteSettings } from "@/data/site-settings";
import { cartSubtotal, useCartStore } from "@/lib/cart/store";
import {
  checkoutSchema,
  type CheckoutFormValues,
} from "@/lib/checkout/schema";
import { storeLastOrder, submitOrder } from "@/lib/checkout/submit-order";
import { formatPrice } from "@/lib/utils/format-price";

const SECTIONS = [
  { number: "01", title: "DOSTAVA" },
  { number: "02", title: "PLAĆANJE" },
  { number: "03", title: "PREGLED" },
];

export default function CheckoutPage() {
  const router = useRouter();
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
    const total = cartSubtotal(items);
    try {
      const order = await submitOrder({ delivery, items, total });
      storeLastOrder(order);
      clearCart();
      router.push("/potvrda-porudzbine");
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Greška prilikom slanja porudžbine. Pokušaj ponovo.",
      );
    }
  }

  if (!hasHydrated) {
    return <div className="container-onyx py-24" />;
  }

  if (items.length === 0) {
    return (
      <div className="container-onyx py-16 sm:py-20 lg:py-24">
        <Eyebrow className="mb-4">NAPLATA</Eyebrow>
        <h1 className="text-[32px] sm:text-h2">Kasa</h1>
        <div className="mt-16 flex flex-col items-start gap-6 border-t border-hairline pt-12">
          <p className="font-mono text-[11px] tracking-[.1em] text-text-40 uppercase">
            Vaša korpa je prazna — dodajte proizvode pre nego što nastavite
            na plaćanje
          </p>
          <Button href="/korpa" trailingArrow>
            NAZAD U KORPU
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-onyx py-16 sm:py-20 lg:py-24">
      <Eyebrow className="mb-4">NAPLATA</Eyebrow>
      <h1 className="text-[32px] sm:text-h2">Kasa</h1>

      <p className="mt-6 max-w-[620px] border border-hairline bg-onyx-800 px-5 py-4 font-mono text-[11px] tracking-[.08em] text-text-60 uppercase">
        Dostava 1–3 radna dana · Besplatno preko{" "}
        {formatPrice(siteSettings.freeShippingThresholdRsd)}
      </p>

      <form
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
                  Dostava na: {values.address}
                  {values.city ? `, ${values.city}` : ""}
                  {values.postalCode ? ` ${values.postalCode}` : ""}
                </p>
              )}
              <Textarea
                label="NAPOMENA UZ PORUDŽBINU (OPCIONO)"
                rows={3}
                placeholder="Npr. dodatna uputstva za kurira, željeni termin dostave…"
                {...register("notes")}
                error={errors.notes?.message}
              />
            </div>
          </section>
        </div>

        <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <OrderSummary items={items} showItems>
            <Checkbox
              label={
                <>
                  Slažem se sa{" "}
                  <Link
                    href="/uslovi-koriscenja"
                    target="_blank"
                    className="text-accent underline underline-offset-2 hover:no-underline"
                  >
                    uslovima korišćenja
                  </Link>{" "}
                  i politikom privatnosti.
                </>
              }
              {...register("acceptTerms")}
              error={errors.acceptTerms?.message}
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              trailingArrow
              className="mt-5 w-full"
            >
              {isSubmitting ? "OBRAĐUJE SE…" : "POTVRDI PORUDŽBINU"}
            </Button>
          </OrderSummary>
        </div>
      </form>
    </div>
  );
}
