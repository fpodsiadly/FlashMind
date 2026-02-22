import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FlashMind",
    short_name: "FlashMind",
    description: "Adaptive quiz app",
    start_url: "/",
    display: "standalone",
    background_color: "#05060f",
    theme_color: "#0b1028",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
