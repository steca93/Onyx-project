import { z } from "zod";

/** Keys under the "CheckoutErrors.validation" messages namespace — the
 * schema only knows which message it needs, the caller supplies the
 * translated text (see createCheckoutSchema). */
export type CheckoutValidationKey =
  | "fullName"
  | "email"
  | "phone"
  | "address"
  | "city"
  | "postalCode"
  | "notesTooLong"
  | "acceptTerms";

type ValidationMessage = (key: CheckoutValidationKey) => string;

export const paymentMethodSchema = z.enum(["cod", "banca-intesa"]);
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;

/**
 * Built per render with the active locale's messages (same approach as the
 * contact form), so validation errors show up in the shopper's language
 * rather than baked-in Serbian.
 */
export function createCheckoutSchema(message: ValidationMessage) {
  return z.object({
    fullName: z.string().min(2, message("fullName")),
    email: z.string().email(message("email")),
    phone: z.string().min(6, message("phone")),
    address: z.string().min(3, message("address")),
    city: z.string().min(2, message("city")),
    postalCode: z.string().min(4, message("postalCode")),
    notes: z.string().max(500, message("notesTooLong")).optional(),
    paymentMethod: paymentMethodSchema,
    acceptTerms: z.boolean().refine((v) => v === true, {
      message: message("acceptTerms"),
    }),
  });
}

export type CheckoutFormValues = z.infer<ReturnType<typeof createCheckoutSchema>>;
