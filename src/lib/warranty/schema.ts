import { z } from "zod";

export type WarrantyErrorKey =
  | "chassisNumberMin"
  | "chassisNumberFormat"
  | "installationDateRequired"
  | "installationDateFuture"
  | "installerRequired"
  | "ownerNameRequired"
  | "emailInvalid"
  | "phoneRequired"
  | "consentRequired";

// Validation messages come from the caller (the "WarrantyForm" message
// namespace) so the schema stays locale-agnostic.
export function createWarrantySchema(t: (key: WarrantyErrorKey) => string) {
  return z.object({
    chassisNumber: z
      .string()
      .min(5, t("chassisNumberMin"))
      .regex(/^[A-Za-z0-9]+$/, t("chassisNumberFormat")),
    installationDate: z
      .string()
      .min(1, t("installationDateRequired"))
      .refine(
        (date) => new Date(date).getTime() <= Date.now(),
        t("installationDateFuture"),
      ),
    installerId: z.string().min(1, t("installerRequired")),
    ownerName: z.string().min(2, t("ownerNameRequired")),
    email: z.string().email(t("emailInvalid")),
    phone: z.string().min(6, t("phoneRequired")),
    consent: z.boolean().refine((v) => v === true, {
      message: t("consentRequired"),
    }),
  });
}

export type WarrantyFormValues = z.infer<
  ReturnType<typeof createWarrantySchema>
>;

export function generateCertificateNumber(): string {
  return `ONX-CERT-${Date.now().toString(36).toUpperCase()}`;
}
