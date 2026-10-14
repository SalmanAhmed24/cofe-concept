import type { Metadata, Viewport } from "next";
import { body, display } from "@/lib/fonts";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/sections/Footer";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { Cursor } from "@/components/ui/Cursor";
import { MotionProvider } from "@/components/ui/MotionProvider";
import "./globals.css";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mossbrew.coffee";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: "Mossbrew — Cold Coffee, Slow Crafted", template: "%s · Mossbrew" },
  description:
    "Mossbrew is a cold coffee house serving 20-hour cold brews, iced lattes and coffee mocktails across fourteen cafés.",
  openGraph: {
    type: "website",
    title: "Mossbrew — Cold Coffee, Slow Crafted",
    description: "20-hour cold brew, iced lattes and coffee mocktails across fourteen cafés.",
    images: [{ url: "/img/cup-classic.webp", width: 1400, height: 1800, alt: "Mossbrew classic paper cup" }],
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#0f3d2e",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CafeOrCoffeeShop",
  name: "Mossbrew",
  url: SITE,
  servesCuisine: "Coffee",
  priceRange: "$",
  description: "Cold coffee house serving slow-steeped cold brew and iced coffee.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <MotionProvider>
          <a href="#main" className="skip">
            Skip to content
          </a>
          <SmoothScroll />
          <Cursor />
          <Nav />
          {children}
          <Footer />
        </MotionProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
