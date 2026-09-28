import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ONYX EVOLUTION",
    short_name: "ONYX",
    description:
      "Ovlašćeni distributer PPF folija i keramičkih premaza za automobile u Srbiji.",
    start_url: "/",
    display: "standalone",
    background_color: "#040506",
    theme_color: "#040506",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
