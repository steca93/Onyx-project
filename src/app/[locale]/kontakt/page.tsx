"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Lattice } from "@/components/ui/Lattice";
import { PageHeader } from "@/components/ui/PageHeader";
import { siteSettings } from "@/data/site-settings";

export default function ContactPage() {
  const t = useTranslations("ContactPage");
  const tCommon = useTranslations("Common");
  const tSite = useTranslations("Site");

  const contactSchema = z.object({
    fullName: z.string().min(2, t("fullNameError")),
    email: z.string().email(t("emailError")),
    subject: z.string().min(2, t("subjectError")),
    message: z.string().min(10, t("messageError")),
  });
  type ContactFormValues = z.infer<typeof contactSchema>;

  const CONTACT_DETAILS = [
    { label: t("detailEmail"), value: siteSettings.contact.email },
    { label: t("detailPhone"), value: siteSettings.contact.phone },
    { label: t("detailAddress"), value: siteSettings.contact.address },
    { label: t("detailWorkingHours"), value: tSite("workingHours") },
  ];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<ContactFormValues>({ resolver: zodResolver(contactSchema) });

  const errorList = Object.values(errors)
    .map((e) => e?.message)
    .filter((m): m is string => Boolean(m));

  function onSubmit() {
    reset();
  }

  return (
    <>
      <PageHeader
        breadcrumb={[{ label: tCommon("home"), href: "/" }, { label: t("title") }]}
        title={t("title")}
        description={t("description")}
      />
      <div className="container-onyx mt-14 mb-24 grid grid-cols-1 gap-14 lg:mt-18 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0">
          {isSubmitSuccessful ? (
            <div className="border border-hairline bg-onyx-800 px-8 py-16">
              <p className="text-body text-text">{t("successMessage")}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              {errorList.length > 0 && (
                <div className="border border-danger px-5 py-4 font-mono text-[11px] tracking-[.05em] text-danger">
                  {errorList.map((message) => (
                    <p key={message}>{message}</p>
                  ))}
                </div>
              )}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Input
                  label={t("fullNameLabel")}
                  {...register("fullName")}
                  error={errors.fullName?.message}
                />
                <Input
                  label={t("emailLabel")}
                  type="email"
                  {...register("email")}
                  error={errors.email?.message}
                />
              </div>
              <Input
                label={t("subjectLabel")}
                {...register("subject")}
                error={errors.subject?.message}
              />
              <div className="flex flex-col gap-2">
                <label className="label-column text-text-40" htmlFor="message">
                  {t("messageLabel")}
                </label>
                <textarea
                  id="message"
                  rows={6}
                  aria-invalid={errors.message ? true : undefined}
                  {...register("message")}
                  className="notch notch-12 border border-hairline bg-onyx-800 px-4 py-3 font-mono text-[10.5px] tracking-[.18em] text-text placeholder:text-text-34 outline-none focus:border-[rgba(42,179,230,.55)]"
                />
                {errors.message && (
                  <p className="font-mono text-[10px] tracking-[.08em] text-danger">
                    {errors.message.message}
                  </p>
                )}
              </div>
              <div>
                <Button type="submit" disabled={isSubmitting} trailingArrow>
                  {isSubmitting ? t("submittingLabel") : t("submitLabel")}
                </Button>
              </div>
            </form>
          )}
        </div>

        <div className="min-w-0">
          <Lattice columns={1}>
            {CONTACT_DETAILS.map((detail) => (
              <div key={detail.label} className="p-6">
                <div className="label-column mb-3 text-text-40">
                  {detail.label}
                </div>
                <div className="text-body text-text">{detail.value}</div>
              </div>
            ))}
          </Lattice>
        </div>
      </div>
    </>
  );
}
