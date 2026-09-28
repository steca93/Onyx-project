import { useTranslations } from "next-intl";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import type { CheckoutFormValues } from "@/lib/checkout/schema";

export interface DeliveryFormProps {
  register: UseFormRegister<CheckoutFormValues>;
  errors: FieldErrors<CheckoutFormValues>;
}

export function DeliveryForm({ register, errors }: DeliveryFormProps) {
  const t = useTranslations("DeliveryForm");

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <Input
          label={t("fullName")}
          {...register("fullName")}
          error={errors.fullName?.message}
        />
      </div>
      <Input
        label={t("email")}
        type="email"
        {...register("email")}
        error={errors.email?.message}
      />
      <Input
        label={t("phone")}
        type="tel"
        {...register("phone")}
        error={errors.phone?.message}
      />
      <div className="sm:col-span-2">
        <Input
          label={t("address")}
          {...register("address")}
          error={errors.address?.message}
        />
      </div>
      <Input label={t("city")} {...register("city")} error={errors.city?.message} />
      <Input
        label={t("postalCode")}
        {...register("postalCode")}
        error={errors.postalCode?.message}
      />
    </div>
  );
}
