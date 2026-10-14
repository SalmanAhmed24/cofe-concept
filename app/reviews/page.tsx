import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Reviews } from "@/components/sections/Reviews";

export const metadata: Metadata = {
  title: "Reviews",
  description: "What guests say about Mossbrew — live reviews and ratings from Google.",
  alternates: { canonical: "/reviews" },
};

// Re-fetch Google reviews at most every six hours (ISR)
export const revalidate = 21600;

export default function ReviewsPage() {
  return (
    <main id="main">
      <PageHeader
        crumb="Reviews"
        eyebrow="From our guests"
        title="Word Of Mouth"
        lede="Straight from Google — the good, the honest and the over-caffeinated. Visited recently? We’d love to hear from you."
        img="g-latte"
      />
      <Reviews />
    </main>
  );
}
