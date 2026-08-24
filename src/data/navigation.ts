export interface NavItem {
  label: string;
  href: string;
}

export const navItems: NavItem[] = [
  { label: "PPF FOLIJE", href: "/kategorija/ppf-folije" },
  { label: "MAT PPF", href: "/kategorija/mat-ppf" },
  { label: "FAROVI I SVETLA", href: "/kategorija/farovi-i-svetla" },
  { label: "KERAMIČKI PREMAZI", href: "/kategorija/keramicki-premazi" },
  { label: "ALAT I MONTAŽA", href: "/kategorija/alat-i-montaza" },
  { label: "SETOVI", href: "/kategorija/setovi" },
];

export const installerCta: NavItem = {
  label: "POSTANI INSTALATER →",
  href: "/postani-instalater",
};
