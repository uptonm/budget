import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Budget — Private Personal Finance",
    short_name: "Budget",
    description:
      "A private personal-finance dashboard for tracking spending, income, savings, categories, and net worth.",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f1e8",
    theme_color: "#12100e",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
