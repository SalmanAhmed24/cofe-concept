import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Creations } from "@/components/sections/Creations";
import { MenuBoard } from "@/components/sections/MenuBoard";

export const metadata: Metadata = {
  title: "Menu",
  description: "Cold brews, iced lattes, hot coffee and fresh-baked sweets — the full Mossbrew menu with prices.",
  alternates: { canonical: "/menu" },
};

export default function MenuPage() {
  return (
    <main id="main">
      <PageHeader
        crumb="Menu"
        eyebrow="Cold bar · Hot bar · Sweet counter"
        title="The Menu"
        lede="Twenty-hour cold brew, silky hot classics and a pastry case that empties by noon. Prices are per drink; oat, almond and whole milk at no extra charge."
        img="iced-vanilla"
      />
      <Creations />
      <MenuBoard />
    </main>
  );
}
