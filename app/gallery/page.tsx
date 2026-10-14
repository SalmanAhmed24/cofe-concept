import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Gallery } from "@/components/sections/Gallery";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Lattes, cold brews, donuts, macarons and cakes from the Mossbrew bar and pastry counter.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  return (
    <main id="main">
      <PageHeader
        crumb="Gallery"
        eyebrow="Coffee & desserts"
        title="Eye Candy"
        lede="A look across the bar and the pastry case. Tap any picture to open it — use the arrow keys to browse."
        img="g-macarons"
      />
      <Gallery />
    </main>
  );
}
