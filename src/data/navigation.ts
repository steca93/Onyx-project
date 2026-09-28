export interface NavItem {
  label: string;
  href: string;
}

// Category nav items are no longer hardcoded here — Header/Footer render
// them straight from getAllCategories() (src/lib/repo), fetched server-side
// in src/app/layout.tsx, so they always reflect what's actually in WooCommerce.

export const installerCta: NavItem = {
  label: "POSTANI INSTALATER →",
  href: "/postani-instalater",
};
