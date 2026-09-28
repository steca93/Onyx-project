import { Button } from "./Button";
import { Eyebrow } from "./Eyebrow";

export interface CtaBandProps {
  eyebrow: string;
  headingLine1: string;
  headingLine2: string;
  body: string;
  buttonLabel: string;
  buttonHref: string;
}

export function CtaBand({
  eyebrow,
  headingLine1,
  headingLine2,
  body,
  buttonLabel,
  buttonHref,
}: CtaBandProps) {
  return (
    <section className="mt-19 border-t border-accent-line bg-cta-band lg:mt-26">
      <div className="container-onyx flex flex-col items-start gap-8 py-16 sm:py-22 lg:flex-row lg:items-center lg:justify-between lg:gap-15">
        <div>
          <Eyebrow className="mb-5">{eyebrow}</Eyebrow>
          <h2 className="text-h3-panel text-[36px] sm:text-[44px] lg:text-[52px]">
            {headingLine1}
            <br />
            <span className="text-text-34">{headingLine2}</span>
          </h2>
          <p className="mt-5.5 max-w-[520px] text-body text-text-60">{body}</p>
        </div>
        <Button
          href={buttonHref}
          trailingArrow
          className="h-14 shrink-0 px-8"
        >
          {buttonLabel}
        </Button>
      </div>
    </section>
  );
}
