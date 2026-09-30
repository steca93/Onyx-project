import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { siteSettings } from "@/data/site-settings";
import type { UntranslatedSlugs } from "@/lib/repo";

export function UtilityBar({ untranslated }: { untranslated: UntranslatedSlugs }) {
  const t = useTranslations("UtilityBar");

  return (
    <div className="border-b border-hairline bg-onyx-900">
      <div className="container-onyx flex h-[38px] items-center justify-between gap-4 label-nav text-text-60">
        <div className="flex min-w-0 items-center gap-7 overflow-hidden">
          <span className="shrink-0 text-accent">{t("distributorClaim")}</span>
          <span className="hidden truncate sm:inline">
            {t("freeShipping", {
              amount: siteSettings.freeShippingThresholdRsd.toLocaleString(
                "sr-RS",
              ),
            })}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-7">
          <span className="hidden md:inline">
            {t("support", { phone: siteSettings.supportPhone })}
          </span>
          <span className="hidden text-text-34 md:inline" aria-hidden>|</span>
          <LanguageSwitcher untranslated={untranslated} />
        </div>
      </div>
    </div>
  );
}
