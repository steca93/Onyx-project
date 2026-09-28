import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import type { CheckoutFormValues } from "@/lib/checkout/schema";

export interface DeliveryFormProps {
  register: UseFormRegister<CheckoutFormValues>;
  errors: FieldErrors<CheckoutFormValues>;
}

export function DeliveryForm({ register, errors }: DeliveryFormProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <Input
          label="IME I PREZIME"
          {...register("fullName")}
          error={errors.fullName?.message}
        />
      </div>
      <Input
        label="EMAIL"
        type="email"
        {...register("email")}
        error={errors.email?.message}
      />
      <Input
        label="TELEFON"
        type="tel"
        {...register("phone")}
        error={errors.phone?.message}
      />
      <div className="sm:col-span-2">
        <Input
          label="ADRESA"
          {...register("address")}
          error={errors.address?.message}
        />
      </div>
      <Input label="GRAD" {...register("city")} error={errors.city?.message} />
      <Input
        label="POŠTANSKI BROJ"
        {...register("postalCode")}
        error={errors.postalCode?.message}
      />
    </div>
  );
}
