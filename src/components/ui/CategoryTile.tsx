import { Link } from "@/i18n/navigation";

export interface CategoryTileProps {
  name: string;
  slug: string;
  countLabel: string;
}

export function CategoryTile({ name, slug, countLabel }: CategoryTileProps) {
  return (
    <Link
      href={`/kategorija/${slug}`}
      className="flex min-h-[208px] flex-col justify-between px-[34px] py-10 transition-colors duration-200 hover:bg-onyx-700"
    >
      <div className="label-column text-text-40">{countLabel}</div>
      <div>
        <div className="text-h3-card mb-3.5 text-text">{name}</div>
        <div className="flex items-center gap-2.5 font-mono text-[9px] tracking-[.2em] text-accent uppercase">
          <span className="h-px w-[22px] bg-accent" aria-hidden />
          POGLEDAJ
        </div>
      </div>
    </Link>
  );
}
