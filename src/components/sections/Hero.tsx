import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { PrismField } from "@/components/ui/PrismField";
import { siteSettings } from "@/data/site-settings";

export function Hero() {
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
              PPF WARRANTY PROGRAM
            </Eyebrow>
            <h1 className="text-[40px] tracking-[.02em] sm:text-[64px] lg:text-hero-h1">
              Zaštita
              <br />
              koja se <span className="text-accent">ne vidi</span>
            </h1>
            <p className="mt-7.5 max-w-[470px] text-body-lg text-text-60">
              Samoobnavljajuće PPF folije za lak, farove i felne. Optička
              prozirnost 99%, montaža u ovlašćenim centrima i garancija do{" "}
              <span className="text-text">
                {siteSettings.warrantyYears} godina
              </span>
              .
            </p>
            <div className="mt-10.5 flex flex-wrap gap-3.5">
              <Button href="/kategorija/ppf-auto-folija" trailingArrow>
                ISTRAŽI FOLIJE
              </Button>
              <Button href="/garancija" variant="secondary">
                REGISTRUJ GARANCIJU
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
