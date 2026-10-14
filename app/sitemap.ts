import type { MetadataRoute } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mossbrew.coffee";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/menu", "/craft", "/cafes", "/gallery", "/reviews"].map((p) => ({
    url: `${SITE}${p}`,
    changeFrequency: p === "/reviews" ? "daily" : "weekly",
    priority: p === "" ? 1 : 0.7,
  }));
}
