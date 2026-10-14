import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Cafes } from "@/components/sections/Cafes";
import { CafeList } from "@/components/sections/CafeList";

export const metadata: Metadata = {
  title: "Cafés",
  description: "Fourteen Mossbrew cafés — opening hours, amenities and what makes each one special.",
  alternates: { canonical: "/cafes" },
};

export default function CafesPage() {
  return (
    <main id="main">
      <PageHeader
        crumb="Cafés"
        eyebrow="Fourteen doors and counting"
        title="Find Your Café"
        lede="From the Old Town roastery to a rooftop on the hill — every Mossbrew pours the same cold brew, each with its own personality."
        img="cup-tilt"
      />
      <Cafes />
      <CafeList />
    </main>
  );
}
