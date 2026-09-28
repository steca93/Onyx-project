// zod/mini: same validation, a fraction of the bundle (classic zod isn't
// tree-shakeable and was ~300 KB raw on every form page).
import * as z from "zod/mini";

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
      .check(z.minLength(5, t("chassisNumberMin")), z.regex(/^[A-Za-z0-9]+$/, t("chassisNumberFormat"))),
    installationDate: z
      .string()
      .check(
        z.minLength(1, t("installationDateRequired")),
        z.refine((date) => new Date(date).getTime() <= Date.now(), t("installationDateFuture")),
      ),
    installerId: z.string().check(z.minLength(1, t("installerRequired"))),
    ownerName: z.string().check(z.minLength(2, t("ownerNameRequired"))),
    email: z.email(t("emailInvalid")),
    phone: z.string().check(z.minLength(6, t("phoneRequired"))),
    consent: z.boolean().check(z.refine((v) => v === true, t("consentRequired"))),
  });
}

export type WarrantyFormValues = z.infer<
  ReturnType<typeof createWarrantySchema>
>;

export function generateCertificateNumber(): string {
  return `ONX-CERT-${Date.now().toString(36).toUpperCase()}`;
}
