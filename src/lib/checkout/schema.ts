import * as z from "zod/mini";

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
    fullName: z.string().check(z.minLength(2, message("fullName"))),
    email: z.email(message("email")),
    phone: z.string().check(z.minLength(6, message("phone"))),
    address: z.string().check(z.minLength(3, message("address"))),
    city: z.string().check(z.minLength(2, message("city"))),
    postalCode: z.string().check(z.minLength(4, message("postalCode"))),
    notes: z.optional(z.string().check(z.maxLength(500, message("notesTooLong")))),
    paymentMethod: paymentMethodSchema,
    acceptTerms: z.boolean().check(z.refine((v) => v === true, message("acceptTerms"))),
  });
}

export type CheckoutFormValues = z.infer<ReturnType<typeof createCheckoutSchema>>;
