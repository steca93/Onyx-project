"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { PageHeader } from "@/components/ui/PageHeader";
import { StepRow } from "@/components/ui/StepRow";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { Button } from "@/components/ui/Button";
import { installers } from "@/data/installers";
import { siteSettings } from "@/data/site-settings";
import {
  createWarrantySchema,
  generateCertificateNumber,
  type WarrantyFormValues,
} from "@/lib/warranty/schema";

const INSTALLER_OPTIONS = installers.map((i) => ({
  label: `${i.name} · ${i.city}`,
  value: i.id,
}));

export default function WarrantyPage() {
  const t = useTranslations("WarrantyPage");
  const tForm = useTranslations("WarrantyForm");
  const tCommon = useTranslations("Common");
  const receiptId = useId();

  const warrantySchema = createWarrantySchema((key) => tForm(key));
  const steps = t.raw("steps") as { number: string; text: string }[];

  const [certificateNumber, setCertificateNumber] = useState<string | null>(
    null,
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<WarrantyFormValues>({
    resolver: zodResolver(warrantySchema),
  });

  const errorList = Object.values(errors)
    .map((e) => e?.message)
    .filter((m): m is string => Boolean(m));

  function onSubmit() {
    setCertificateNumber(generateCertificateNumber());
  }

  return (
    <div>
      <PageHeader
        breadcrumb={[
          { label: tCommon("home"), href: "/" },
          { label: t("breadcrumb") },
        ]}
        title={t("title")}
        description={t("description", { years: siteSettings.warrantyYears })}
      />

      <div className="container-onyx py-16 sm:py-20 lg:py-24">
        <StepRow steps={steps} className="mb-16 max-w-[720px]" />

        {certificateNumber ? (
          <div className="max-w-[520px] border border-hairline bg-onyx-800 px-8 py-10">
            <div className="eyebrow mb-4">{t("successEyebrow")}</div>
            <h2 className="text-[28px] sm:text-h2 mb-5">{t("successTitle")}</h2>
            <p className="mb-6 text-body text-text-60">
              {t("successBody")}
            </p>
            <div className="border border-hairline bg-onyx-900 px-5 py-4">
              <div className="label-column mb-2 text-text-40">
                {t("certificateNumberLabel")}
              </div>
              <div className="text-price text-accent">
                {certificateNumber}
              </div>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-[720px] border-t border-hairline pt-12"
          >
            {errorList.length > 0 && (
              <div className="mb-8 border border-danger px-5 py-4 font-mono text-[11px] tracking-[.05em] text-danger">
                {errorList.map((message) => (
                  <p key={message}>{message}</p>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Input
                label={t("chassisNumberLabel")}
                {...register("chassisNumber")}
                error={errors.chassisNumber?.message}
              />
              <Input
                label={t("installationDateLabel")}
                type="date"
                {...register("installationDate")}
                error={errors.installationDate?.message}
              />
              <div className="sm:col-span-2">
                <Select
                  label={t("installerLabel")}
                  placeholder={t("installerPlaceholder")}
                  options={INSTALLER_OPTIONS}
                  {...register("installerId")}
                  error={errors.installerId?.message}
                />
              </div>
              <Input
                label={t("ownerNameLabel")}
                {...register("ownerName")}
                error={errors.ownerName?.message}
              />
              <Input
                label={t("emailLabel")}
                type="email"
                {...register("email")}
                error={errors.email?.message}
              />
              <Input
                label={t("phoneLabel")}
                type="tel"
                {...register("phone")}
                error={errors.phone?.message}
              />
              <div className="flex flex-col gap-2">
                <label htmlFor={receiptId} className="label-column text-text-40">
                  {t("receiptLabel")}
                </label>
                <input
                  id={receiptId}
                  type="file"
                  accept="image/*,application/pdf"
                  className="notch notch-12 h-11 border border-hairline bg-onyx-800 px-3 font-mono text-[10px] tracking-[.1em] text-text-60 file:mr-3 file:border-0 file:bg-accent file:px-3 file:py-2 file:font-mono file:text-[9px] file:tracking-[.2em] file:text-onyx-900"
                />
              </div>
            </div>

            <div className="mt-8">
              <Checkbox
                label={t("consentLabel")}
                {...register("consent")}
                error={errors.consent?.message}
              />
            </div>

            <div className="mt-10">
              <Button type="submit" disabled={isSubmitting} trailingArrow>
                {isSubmitting ? t("submittingLabel") : t("submitLabel")}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
