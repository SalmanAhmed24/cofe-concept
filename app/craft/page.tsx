import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Craft } from "@/components/sections/Craft";
import { Benefits } from "@/components/sections/Benefits";

export const metadata: Metadata = {
  title: "Our craft",
  description: "Direct-trade Arabica, roasted weekly and steeped cold for twenty hours. How Mossbrew makes smooth, low-acid coffee.",
  alternates: { canonical: "/craft" },
};

export default function CraftPage() {
  return (
    <main id="main">
      <PageHeader
        crumb="Our craft"
        eyebrow="Sourcing · Roasting · Brewing"
        title="Slow By Design"
        lede="Three partner farms, one roastery and a twenty-hour brew. Every step is chosen for flavour — and for the people who grow it."
        img="beans"
      />
      <Craft />
      <Benefits />
    </main>
  );
}
