"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Input } from "@/components/ui/Input";
import { Lattice } from "@/components/ui/Lattice";
import { StepRow } from "@/components/ui/StepRow";

const applicationSchema = z.object({
  company: z.string().min(2, "Unesi naziv firme."),
  pib: z.string().regex(/^\d{9}$/, "PIB mora imati tačno 9 cifara."),
  city: z.string().min(2, "Unesi grad."),
  contactName: z.string().min(2, "Unesi ime kontakt osobe."),
  contactEmail: z.string().email("Unesi ispravnu email adresu."),
  contactPhone: z.string().min(6, "Unesi broj telefona."),
  message: z.string().min(10, "Poruka mora imati bar 10 karaktera."),
});

type ApplicationValues = z.infer<typeof applicationSchema>;

const BENEFITS = [
  {
    title: "Obuka i sertifikacija",
    text: "Besplatna tehnička obuka za montažu PPF folija i keramičkih premaza, uz zvaničan ONYX sertifikat.",
  },
  {
    title: "Marketinška podrška",
    text: "Mesto u zvaničnoj mreži ovlašćenih centara na sajtu, promotivni materijali i zajedničke kampanje.",
  },
  {
    title: "Prioritetne zalihe",
    text: "Direktna nabavka po distributerskim cenama i prioritet pri ograničenim serijama proizvoda.",
  },
];

const REQUIREMENTS = [
  { number: "01", text: "Posedovanje radionice ili prostora za montažu vozila" },
  { number: "02", text: "Završena ONYX obuka za montažu folija i premaza" },
  { number: "03", text: "Potpisan ugovor o distribuciji sa ONYX Evolution" },
];

export default function BecomeInstallerPage() {
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
          <Eyebrow rule>POSTANI DEO MREŽE</Eyebrow>
          <h1 className="text-[40px] sm:text-page-h1">Postani instalater</h1>
          <p className="max-w-[560px] text-body text-text-60">
            Pridruži se mreži ovlašćenih ONYX centara za montažu PPF folija i
            keramičkih premaza u Srbiji i regionu.
          </p>
        </div>
      </div>

      <div className="container-onyx py-16 sm:py-20 lg:py-24">
        <Lattice className="mb-20 grid-cols-1 sm:grid-cols-3">
          {BENEFITS.map((b) => (
            <div key={b.title} className="flex flex-col gap-3 p-8">
              <div className="text-h3-card text-[20px] text-text">{b.title}</div>
              <p className="text-body-sm text-text-60">{b.text}</p>
            </div>
          ))}
        </Lattice>

        <div className="mb-20">
          <Eyebrow className="mb-4">USLOVI</Eyebrow>
          <h2 className="mb-8 text-[28px] sm:text-h2">Šta je potrebno</h2>
          <StepRow steps={REQUIREMENTS} className="max-w-[860px]" />
        </div>

        <div className="max-w-[720px] border-t border-hairline pt-12">
          <Eyebrow className="mb-4">PRIJAVA</Eyebrow>
          <h2 className="mb-8 text-[28px] sm:text-h2">Pošalji prijavu</h2>

          {submitted ? (
            <div className="border border-hairline bg-onyx-800 px-8 py-10">
              <p className="text-body text-text-60">
                Prijava je poslata. Naš tim za razvoj mreže će te kontaktirati
                u narednih nekoliko dana.
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
                  label="NAZIV FIRME"
                  {...register("company")}
                  error={errors.company?.message}
                />
                <Input
                  label="PIB"
                  {...register("pib")}
                  error={errors.pib?.message}
                />
                <div className="sm:col-span-2">
                  <Input
                    label="GRAD"
                    {...register("city")}
                    error={errors.city?.message}
                  />
                </div>
                <Input
                  label="KONTAKT OSOBA"
                  {...register("contactName")}
                  error={errors.contactName?.message}
                />
                <Input
                  label="EMAIL"
                  type="email"
                  {...register("contactEmail")}
                  error={errors.contactEmail?.message}
                />
                <div className="sm:col-span-2">
                  <Input
                    label="TELEFON"
                    type="tel"
                    {...register("contactPhone")}
                    error={errors.contactPhone?.message}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-2 block label-column text-text-40">
                    PORUKA
                  </label>
                  <textarea
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
                  {isSubmitting ? "ŠALJE SE…" : "POŠALJI PRIJAVU"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
