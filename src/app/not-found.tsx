// True root fallback — used only when no [locale] segment could be
// resolved at all (middleware failure / pathological request). Every
// normal 404 inside a resolved locale is handled by
// src/app/[locale]/not-found.tsx instead, inside the real site chrome.
// This file has no parent layout providing <html>/<body>, so it must
// supply its own — and no resolved locale, so it links to "/" via plain
// next/link rather than the locale-aware Link in @/i18n/navigation.
import Link from "next/link";

export default function GlobalNotFound() {
  return (
    <html lang="sr">
      <body style={{ margin: 0, background: "#040506", color: "#eaeef1" }}>
        <div
          style={{
            display: "flex",
            minHeight: "100vh",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            fontFamily: "sans-serif",
            textAlign: "center",
            padding: "0 1.5rem",
          }}
        >
          <h1 style={{ fontSize: "1.5rem" }}>404 / Stranica nije pronađena</h1>
          <Link href="/" style={{ color: "#2ab3e6" }}>
            Nazad na početnu →
          </Link>
        </div>
      </body>
    </html>
  );
}
