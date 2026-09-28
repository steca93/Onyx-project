import { siteSettings } from "@/data/site-settings";

export function UtilityBar() {
  return (
    <div className="border-b border-hairline bg-onyx-900">
      <div className="container-onyx flex h-[38px] items-center justify-between label-nav text-text-60">
        <div className="flex items-center gap-7">
          <span className="text-accent">{siteSettings.distributorClaim}</span>
          <span className="hidden sm:inline">
            BESPLATNA DOSTAVA PREKO{" "}
            {siteSettings.freeShippingThresholdRsd.toLocaleString("sr-RS")} RSD
          </span>
        </div>
        <div className="flex items-center gap-7">
          <span className="hidden md:inline">
            PODRŠKA {siteSettings.supportPhone}
          </span>
          <span className="hidden text-text-34 md:inline">|</span>
          <span>SR / EN</span>
        </div>
      </div>
    </div>
  );
}
