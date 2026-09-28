import { useTranslations } from "next-intl";
import type { UseFormRegister } from "react-hook-form";
import { Badge } from "@/components/ui/Badge";
import type { CheckoutFormValues } from "@/lib/checkout/schema";

export interface PaymentMethodSectionProps {
  register: UseFormRegister<CheckoutFormValues>;
}

export function PaymentMethodSection({ register }: PaymentMethodSectionProps) {
  const t = useTranslations("PaymentMethods");

  return (
    <div className="flex flex-col gap-3">
      <label className="flex cursor-pointer items-start gap-4 border border-hairline bg-onyx-800 px-5 py-4 has-[:checked]:border-accent">
        <input
          type="radio"
          value="cod"
          {...register("paymentMethod")}
          className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-accent"
        />
        <span>
          <span className="block text-body-sm text-text">{t("codTitle")}</span>
          <span className="mt-1 block font-mono text-[10px] tracking-[.1em] text-text-40 uppercase">
            {t("codDescription")}
          </span>
        </span>
      </label>

      <label className="flex cursor-not-allowed items-start gap-4 border border-hairline bg-onyx-800 px-5 py-4 opacity-50">
        <input
          type="radio"
          value="banca-intesa"
          disabled
          {...register("paymentMethod")}
          className="mt-0.5 h-4 w-4 shrink-0"
        />
        <span className="flex-1">
          <span className="flex items-center gap-2.5">
            <span className="block text-body-sm text-text-60">
              {t("cardTitle")}
            </span>
            <Badge>{t("comingSoon")}</Badge>
          </span>
          <span className="mt-1 block font-mono text-[10px] tracking-[.1em] text-text-40 uppercase">
            {t("cardDescription")}
          </span>
        </span>
      </label>
    </div>
  );
}
