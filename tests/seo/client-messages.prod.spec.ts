import { expect, test } from "@playwright/test";
import { FIXTURES } from "./helpers";

/**
 * Only the message namespaces client components need are sent to the
 * browser (src/i18n/ClientMessages.tsx). If one is missing, next-intl logs
 * a MISSING_MESSAGE error and renders the key instead of text. Load every
 * route in every locale with a real browser and fail on any such error.
 */
const { productSlug, categorySlug } = FIXTURES;
const ROUTES: Record<string, string[]> = {
  sr: ["/", `/kategorija/${categorySlug}`, `/proizvod/${productSlug}`, "/korpa", "/kasa", "/potvrda-porudzbine", "/kontakt", "/garancija", "/postani-instalater", "/ovlasceni-centri", "/pretraga?q=krpa", "/cesta-pitanja", "/dostava-i-povracaj", "/uputstva-za-montazu", "/uslovi-koriscenja", "/ne-postoji"],
  en: ["/en", `/en/category/${categorySlug}`, `/en/product/${productSlug}`, "/en/cart", "/en/checkout", "/en/contact", "/en/warranty", "/en/become-an-installer"],
  de: ["/de", `/de/kategorie/${categorySlug}`, `/de/produkt/${productSlug}`, "/de/warenkorb", "/de/kasse", "/de/kontakt", "/de/garantie", "/de/installateur-werden"],
};

for (const [locale, paths] of Object.entries(ROUTES)) {
  for (const path of paths) {
    test(`${locale} ${path} has every client message it needs`, async ({ page }) => {
      const problems: string[] = [];
      page.on("console", (msg) => {
        const text = msg.text();
        if (/MISSING_MESSAGE|INSUFFICIENT_PATH|Could not resolve/.test(text)) problems.push(text);
      });
      page.on("pageerror", (err) => problems.push(String(err)));
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      // Deferred UI (cart drawer) mounts on idle — give it time to render.
      await page.waitForTimeout(2000);
      expect(problems).toEqual([]);
    });
  }
}
