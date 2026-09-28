import { BoxedEyebrow } from "@/components/ui/BoxedEyebrow";
import { Button } from "@/components/ui/Button";
import { DiamondImage } from "@/components/ui/DiamondImage";
import { StepRow } from "@/components/ui/StepRow";
import { siteSettings } from "@/data/site-settings";

const steps = [
  { number: "01", text: "Unesi broj šasije i datum montaže" },
  { number: "02", text: "Priloži račun ovlašćenog centra" },
  { number: "03", text: "Dobijaš digitalni sertifikat na mejl" },
];

export function WarrantyBlock() {
  return (
    <section className="mt-19 border-t border-b border-hairline bg-onyx-900 lg:mt-24">
      <div className="container-onyx grid grid-cols-1 items-center gap-12 py-16 sm:py-20 lg:grid-cols-[360px_1fr] lg:gap-22.5 lg:py-26">
        <div className="flex justify-center">
          <DiamondImage
            size={320}
            image={{
              sourceUrl: "",
              altText: "FACETED ONYX · DETALJ FOLIJE",
            }}
            className="h-[220px] w-[220px] sm:h-[320px] sm:w-[320px]"
          />
        </div>
        <div>
          <BoxedEyebrow className="mb-7">ONYX WARRANTY</BoxedEyebrow>
          <h2 className="text-[36px] sm:text-h2-block">
            Registruj
            <br />
            <span className="text-text-34">svoju garanciju</span>
          </h2>
          <p className="mt-6.5 max-w-[480px] text-body text-text-60">
            Svaka montaža u ovlašćenom centru nosi {siteSettings.warrantyYears}
            -godišnju garanciju na žutljenje, pucanje i odvajanje folije.
            Registracija traje dva minuta.
          </p>
          <StepRow steps={steps} className="mt-11 max-w-[620px]" />
          <div className="mt-10">
            <Button href="/garancija" trailingArrow>
              REGISTRUJ GARANCIJU
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
