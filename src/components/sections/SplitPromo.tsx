import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ImageSlot } from "@/components/ui/ImageSlot";
import type { ProductImage } from "@/lib/repo/types";

export interface SplitPromoProps {
  image?: ProductImage | null;
}

export function SplitPromo({ image }: SplitPromoProps) {
  const t = useTranslations("SplitPromo");

  return (
    <section className="container-onyx mt-19 lg:mt-24">
      <div className="grid grid-cols-1 border border-hairline bg-onyx-800 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <div className="relative min-h-[280px] lg:min-h-[430px]">
          <ImageSlot
            image={
              image ?? {
                sourceUrl: "",
                altText: t("imageAlt"),
              }
            }
            fill
            priority
            sizes="(min-width: 1200px) 55vw, 100vw"
          />
        </div>
        <div className="flex flex-col justify-center border-t border-accent-line bg-promo-panel px-8 py-12 sm:px-12 lg:border-t-0 lg:border-l lg:px-15 lg:py-16.5">
          <Eyebrow className="mb-5">{t("eyebrow")}</Eyebrow>
          <h2 className="text-[36px] leading-none sm:text-h3-panel">
            {t("headingLine1")}
            <br />
            {t("headingLine2")}
          </h2>
          <p className="mt-6 max-w-[380px] text-body text-text-60">
            {t("body")}
          </p>
          <div className="mt-9.5">
            <Button href={{ pathname: "/kategorija/[slug]", params: { slug: "ulozak-za-poliranje" } }} variant="outline-accent" compact trailingArrow>
              {t("button")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
