import { ImageResponse } from "next/og";

/**
 * Default Open Graph / Twitter image (1200×630) for pages without a
 * product image of their own. Rendered once at build time (static route).
 * The folder name contains a dot, so the i18n middleware skips it.
 */
export const dynamic = "force-static";

const ACCENT = "#2ab3e6";

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #07080a 0%, #111418 60%, #0b1a22 100%)",
          color: "#f2f4f6",
        }}
      >
        <div style={{ display: "flex", fontSize: 150, letterSpacing: 42 }}>
          ON<span style={{ color: ACCENT }}>Y</span>X
        </div>
        <div style={{ display: "flex", alignItems: "center", marginTop: 20 }}>
          <div style={{ width: 60, height: 2, background: ACCENT }} />
          <div style={{ fontSize: 34, letterSpacing: 16, color: ACCENT, margin: "0 28px" }}>EVOLUTION</div>
          <div style={{ width: 60, height: 2, background: ACCENT }} />
        </div>
        <div style={{ marginTop: 56, fontSize: 30, letterSpacing: 6, color: "#9aa3ad" }}>PPF · CERAMIC COATINGS · DETAILING</div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
