import { Link } from "@/i18n/navigation";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Navigacija" className="flex items-center gap-2 font-mono text-[9px] tracking-[.24em] text-text-40 uppercase">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={`${item.label}-${index}`} className="flex items-center gap-2">
            {index > 0 && <span aria-hidden>/</span>}
            {item.href && !isLast ? (
              <Link href={item.href} className="hover:text-text-60">
                {item.label}
              </Link>
            ) : (
              <span aria-current={isLast ? "page" : undefined}>{item.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
