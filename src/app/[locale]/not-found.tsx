import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <div className="border-b border-accent-line bg-onyx-900">
      <div className="container-onyx flex h-[260px] flex-col justify-center gap-5">
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <h1 className="text-[40px] tracking-[.02em] sm:text-page-h1">
          {t("heading")}
        </h1>
        <p className="max-w-[520px] text-body text-text-60">
          {t("body")}
        </p>
        <div className="mt-2">
          <Button href="/" trailingArrow>
            {t("backHome")}
          </Button>
        </div>
      </div>
    </div>
  );
}
