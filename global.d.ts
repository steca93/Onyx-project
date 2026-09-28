import type { routing } from "@/i18n/routing";
import type messages from "./messages/sr.json";

// Typed useTranslations()/getTranslations() keys, checked against the
// Serbian catalog (the source of truth — every namespace/key must exist
// there; en.json/de.json are expected to mirror the same shape).
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}
