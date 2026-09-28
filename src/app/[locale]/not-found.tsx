import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

export default function NotFound() {
  return (
    <div className="border-b border-accent-line bg-onyx-900">
      <div className="container-onyx flex h-[260px] flex-col justify-center gap-5">
        <Eyebrow>GREŠKA 404</Eyebrow>
        <h1 className="text-[40px] tracking-[.02em] sm:text-page-h1">
          404 / STRANICA NIJE PRONAĐENA
        </h1>
        <p className="max-w-[520px] text-body text-text-60">
          Stranica koju tražiš ne postoji ili je premeštena.
        </p>
        <div className="mt-2">
          <Button href="/" trailingArrow>
            NAZAD NA POČETNU
          </Button>
        </div>
      </div>
    </div>
  );
}
