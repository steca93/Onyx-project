import { useTranslations } from "next-intl";
import { BoxedEyebrow } from "@/components/ui/BoxedEyebrow";
import { Button } from "@/components/ui/Button";
import { DiamondImage } from "@/components/ui/DiamondImage";
import { StepRow } from "@/components/ui/StepRow";
import { siteSettings } from "@/data/site-settings";

export function WarrantyBlock() {
  const t = useTranslations("WarrantyBlock");
  const steps = [
    { number: "01", text: t("step1") },
    { number: "02", text: t("step2") },
    { number: "03", text: t("step3") },
  ];

  return (
    <section className="mt-19 border-t border-b border-hairline bg-onyx-900 lg:mt-24">
      <div className="container-onyx grid grid-cols-1 items-center gap-12 py-16 sm:py-20 lg:grid-cols-[360px_1fr] lg:gap-22.5 lg:py-26">
        <div className="flex justify-center">
          <DiamondImage
            size={320}
            image={{
              sourceUrl: "",
              altText: t("imageAlt"),
            }}
            className="h-[220px] w-[220px] sm:h-[320px] sm:w-[320px]"
          />
        </div>
        <div>
          <BoxedEyebrow className="mb-7">ONYX WARRANTY</BoxedEyebrow>
          <h2 className="text-[36px] sm:text-h2-block">
            {t("headingLine1")}
            <br />
            <span className="text-text-34">{t("headingLine2")}</span>
          </h2>
          <p className="mt-6.5 max-w-[480px] text-body text-text-60">
            {t("body", { years: siteSettings.warrantyYears })}
          </p>
          <StepRow steps={steps} className="mt-11 max-w-[620px]" />
          <div className="mt-10">
            <Button href="/garancija" trailingArrow>
              {t("button")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
