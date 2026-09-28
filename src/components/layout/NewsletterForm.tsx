"use client";

import { useTranslations } from "next-intl";
import { useState, type FormEvent } from "react";

// Same practical check zod's `.email()` applied — one field doesn't justify
// shipping zod + react-hook-form (~300 KB raw) on every page via the footer.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function NewsletterForm() {
  const t = useTranslations("Footer");
  const [status, setStatus] = useState<"idle" | "invalid" | "success">("idle");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const email = String(new FormData(form).get("email") ?? "").trim();
    if (!EMAIL_PATTERN.test(email)) {
      setStatus("invalid");
      return;
    }
    form.reset();
    setStatus("success");
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3">
      <input
        type="email"
        name="email"
        autoComplete="email"
        placeholder={t("newsletterPlaceholder")}
        aria-label={t("newsletterAriaLabel")}
        aria-invalid={status === "invalid" ? true : undefined}
        onChange={() => status !== "idle" && setStatus("idle")}
        className="h-12 border border-hairline-strong bg-onyx-800 px-4 font-mono text-[11px] tracking-[.12em] text-text placeholder:text-text-34 outline-none focus:border-accent"
      />
      {status === "invalid" && (
        <p role="alert" className="font-mono text-[10px] tracking-[.08em] text-danger">
          {t("newsletterEmailError")}
        </p>
      )}
      {status === "success" && (
        <p role="status" className="font-mono text-[10px] tracking-[.08em] text-success">
          {t("newsletterSuccess")}
        </p>
      )}
      <button
        type="submit"
        className="notch notch-12 flex h-12 items-center justify-center border border-accent label-nav text-[10px] tracking-[.24em] text-accent transition-colors duration-200 hover:bg-accent hover:text-onyx-900"
      >
        {t("newsletterSubmit")}
      </button>
    </form>
  );
}
