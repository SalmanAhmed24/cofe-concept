import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mossbrew Cold Coffee",
    short_name: "Mossbrew",
    start_url: "/",
    display: "standalone",
    background_color: "#0f3d2e",
    theme_color: "#0f3d2e",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
