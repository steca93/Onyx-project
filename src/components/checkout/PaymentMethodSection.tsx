import type { UseFormRegister } from "react-hook-form";
import { Badge } from "@/components/ui/Badge";
import type { CheckoutFormValues } from "@/lib/checkout/schema";

export interface PaymentMethodSectionProps {
  register: UseFormRegister<CheckoutFormValues>;
}

export function PaymentMethodSection({ register }: PaymentMethodSectionProps) {
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
          <span className="block text-body-sm text-text">Pouzećem</span>
          <span className="mt-1 block font-mono text-[10px] tracking-[.1em] text-text-40 uppercase">
            Platiš kuriru gotovinom ili karticom pri preuzimanju
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
              Kartično plaćanje (Banka Intesa)
            </span>
            <Badge>USKORO</Badge>
          </span>
          <span className="mt-1 block font-mono text-[10px] tracking-[.1em] text-text-40 uppercase">
            Sigurno plaćanje karticom, stiže uskoro
          </span>
        </span>
      </label>
    </div>
  );
}
