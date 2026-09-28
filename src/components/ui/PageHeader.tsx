import { stripHtml } from "@/lib/utils/strip-html";
import { Breadcrumb } from "./Breadcrumb";
import type { BreadcrumbItem } from "./Breadcrumb";

export interface PageHeaderProps {
  breadcrumb: BreadcrumbItem[];
  title: string;
  /** Plain text everywhere it's hardcoded in a page — but a category's
   * description comes straight from WooCommerce and may be HTML, so this
   * renders as markup rather than risking literal tags on screen. */
  description?: string;
}

export function PageHeader({ breadcrumb, title, description }: PageHeaderProps) {
  return (
    <div className="border-b border-accent-line bg-onyx-900">
      <div className="container-onyx flex h-[260px] flex-col justify-center gap-5">
        <Breadcrumb items={breadcrumb} />
        <h1 className="text-page-h1 text-text">{title}</h1>
        {stripHtml(description) && (
          <div
            className="prose-onyx text-body max-w-[620px] text-text-60"
            dangerouslySetInnerHTML={{ __html: description! }}
          />
        )}
      </div>
    </div>
  );
}
