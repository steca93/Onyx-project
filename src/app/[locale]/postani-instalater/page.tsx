"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod/mini";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Input } from "@/components/ui/Input";
import { Lattice } from "@/components/ui/Lattice";
import { StepRow } from "@/components/ui/StepRow";

export default function BecomeInstallerPage() {
  const t = useTranslations("BecomeInstallerPage");
  const messageId = useId();

  const applicationSchema = z.object({
    company: z.string().check(z.minLength(2, t("companyError"))),
    pib: z.string().check(z.regex(/^\d{9}$/, t("pibError"))),
    city: z.string().check(z.minLength(2, t("cityError"))),
    contactName: z.string().check(z.minLength(2, t("contactNameError"))),
    contactEmail: z.email(t("emailError")),
    contactPhone: z.string().check(z.minLength(6, t("phoneError"))),
    message: z.string().check(z.minLength(10, t("messageError"))),
  });
  type ApplicationValues = z.infer<typeof applicationSchema>;

  const benefits = t.raw("benefits") as { title: string; text: string }[];
  const requirements = t.raw("requirements") as {
    number: string;
    text: string;
  }[];

  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationValues>({ resolver: zodResolver(applicationSchema) });

  const errorList = Object.values(errors)
    .map((e) => e?.message)
    .filter((m): m is string => Boolean(m));

  function onSubmit() {
    setSubmitted(true);
  }

  return (
    <div>
      <div className="border-b border-accent-line bg-onyx-900">
        <div className="container-onyx flex flex-col justify-center gap-5 py-16 sm:py-20">
          <Eyebrow rule>{t("eyebrow")}</Eyebrow>
          <h1 className="text-[40px] sm:text-page-h1">{t("title")}</h1>
          <p className="max-w-[560px] text-body text-text-60">
            {t("description")}
          </p>
        </div>
      </div>

      <div className="container-onyx py-16 sm:py-20 lg:py-24">
        <Lattice className="mb-20 grid-cols-1 sm:grid-cols-3">
          {benefits.map((b) => (
            <div key={b.title} className="flex flex-col gap-3 p-8">
              <div className="text-h3-card text-[20px] text-text">{b.title}</div>
              <p className="text-body-sm text-text-60">{b.text}</p>
            </div>
          ))}
        </Lattice>

        <div className="mb-20">
          <Eyebrow className="mb-4">{t("requirementsEyebrow")}</Eyebrow>
          <h2 className="mb-8 text-[28px] sm:text-h2">{t("requirementsHeading")}</h2>
          <StepRow steps={requirements} className="max-w-[860px]" />
        </div>

        <div className="max-w-[720px] border-t border-hairline pt-12">
          <Eyebrow className="mb-4">{t("applyEyebrow")}</Eyebrow>
          <h2 className="mb-8 text-[28px] sm:text-h2">{t("applyHeading")}</h2>

          {submitted ? (
            <div className="border border-hairline bg-onyx-800 px-8 py-10">
              <p className="text-body text-text-60">
                {t("successMessage")}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              {errorList.length > 0 && (
                <div className="mb-8 border border-danger px-5 py-4 font-mono text-[11px] tracking-[.05em] text-danger">
                  {errorList.map((message) => (
                    <p key={message}>{message}</p>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Input
                  label={t("companyLabel")}
                  {...register("company")}
                  error={errors.company?.message}
                />
                <Input
                  label={t("pibLabel")}
                  {...register("pib")}
                  error={errors.pib?.message}
                />
                <div className="sm:col-span-2">
                  <Input
                    label={t("cityLabel")}
                    {...register("city")}
                    error={errors.city?.message}
                  />
                </div>
                <Input
                  label={t("contactNameLabel")}
                  {...register("contactName")}
                  error={errors.contactName?.message}
                />
                <Input
                  label={t("emailLabel")}
                  type="email"
                  {...register("contactEmail")}
                  error={errors.contactEmail?.message}
                />
                <div className="sm:col-span-2">
                  <Input
                    label={t("phoneLabel")}
                    type="tel"
                    {...register("contactPhone")}
                    error={errors.contactPhone?.message}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor={messageId} className="mb-2 block label-column text-text-40">
                    {t("messageLabel")}
                  </label>
                  <textarea
                    id={messageId}
                    rows={5}
                    {...register("message")}
                    aria-invalid={errors.message ? true : undefined}
                    className="notch notch-12 w-full border border-hairline bg-onyx-800 px-4 py-3 font-mono text-[10.5px] tracking-[.18em] text-text placeholder:text-text-34 outline-none focus:border-[rgba(42,179,230,.55)]"
                  />
                  {errors.message && (
                    <p className="mt-2 font-mono text-[10px] tracking-[.08em] text-danger">
                      {errors.message.message}
                    </p>
                  )}
                </div>
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
    </div>
  );
}
