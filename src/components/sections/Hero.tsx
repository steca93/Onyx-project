import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { PrismField } from "@/components/ui/PrismField";
import { siteSettings } from "@/data/site-settings";

export function Hero() {
  const t = useTranslations("Hero");

  return (
    <section className="relative h-[460px] overflow-hidden bg-onyx-900 sm:h-[520px] lg:h-[660px]">
      <ImageSlot
        image={{
          sourceUrl: "",
          altText: "",
        }}
        fill
        priority
        sizes="100vw"
        className="absolute inset-0"
      />
      <div className="absolute inset-0 bg-hero-scrim" />
      <PrismField />

      <div className="relative flex h-full items-center">
        <div className="container-onyx w-full">
          <div className="max-w-[700px]">
            <Eyebrow rule className="mb-7.5">
              {t("eyebrow")}
            </Eyebrow>
            <h1 className="text-[40px] tracking-[.02em] sm:text-[64px] lg:text-hero-h1">
              {t.rich("heading", {
                br: () => <br />,
                accent: (chunks) => <span className="text-accent">{chunks}</span>,
              })}
            </h1>
            <p className="mt-7.5 max-w-[470px] text-body-lg text-text-60">
              {t.rich("body", {
                years: siteSettings.warrantyYears,
                strong: (chunks) => <span className="text-text">{chunks}</span>,
              })}
            </p>
            <div className="mt-10.5 flex flex-wrap gap-3.5">
              <Button href={{ pathname: "/kategorija/[slug]", params: { slug: "ppf-auto-folija" } }} trailingArrow>
                {t("exploreFilms")}
              </Button>
              <Button href="/garancija" variant="secondary">
                {t("registerWarranty")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
