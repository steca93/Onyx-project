import { z } from "zod";

export const deliverySchema = z.object({
  fullName: z.string().min(2, "Unesi ime i prezime."),
  email: z.string().email("Unesi ispravnu email adresu."),
  phone: z.string().min(6, "Unesi broj telefona."),
  address: z.string().min(3, "Unesi adresu za dostavu."),
  city: z.string().min(2, "Unesi grad."),
  postalCode: z.string().min(4, "Unesi poštanski broj."),
  notes: z.string().max(500, "Napomena može imati najviše 500 karaktera.").optional(),
});

export type DeliveryFormValues = z.infer<typeof deliverySchema>;

export const paymentMethodSchema = z.enum(["cod", "banca-intesa"]);
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;

export const checkoutSchema = deliverySchema.extend({
  paymentMethod: paymentMethodSchema,
  acceptTerms: z.boolean().refine((v) => v === true, {
    message: "Moraš prihvatiti uslove korišćenja.",
  }),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
