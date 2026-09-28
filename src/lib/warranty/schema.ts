import { z } from "zod";

export const warrantySchema = z.object({
  chassisNumber: z
    .string()
    .min(5, "Unesi ispravan broj šasije.")
    .regex(/^[A-Za-z0-9]+$/, "Broj šasije sadrži samo slova i brojeve."),
  installationDate: z
    .string()
    .min(1, "Unesi datum montaže.")
    .refine(
      (date) => new Date(date).getTime() <= Date.now(),
      "Datum montaže ne može biti u budućnosti.",
    ),
  installerId: z.string().min(1, "Izaberi ovlašćeni centar."),
  ownerName: z.string().min(2, "Unesi ime i prezime."),
  email: z.string().email("Unesi ispravnu email adresu."),
  phone: z.string().min(6, "Unesi broj telefona."),
  consent: z.boolean().refine((v) => v === true, {
    message: "Moraš prihvatiti uslove garancije.",
  }),
});

export type WarrantyFormValues = z.infer<typeof warrantySchema>;

export function generateCertificateNumber(): string {
  return `ONX-CERT-${Date.now().toString(36).toUpperCase()}`;
}
