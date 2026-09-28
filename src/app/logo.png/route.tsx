import { ImageResponse } from "next/og";

/** Square raster logo for structured data (Google requires ≥112 px, not SVG). */
export const dynamic = "force-static";

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#07080a",
          color: "#f2f4f6",
          fontSize: 120,
          letterSpacing: 24,
        }}
      >
        ON<span style={{ color: "#2ab3e6" }}>Y</span>X
      </div>
    ),
    { width: 512, height: 512 },
  );
}
