import type { AssetName } from "./img";

export type MenuItem = { name: string; note: string; price: string; img: AssetName; tags?: string[] };
export type MenuCategory = { id: string; title: string; blurb: string; items: MenuItem[] };

export const MENU: MenuCategory[] = [
  {
    id: "cold",
    title: "Cold bar",
    blurb: "Steeped twenty hours, poured over clear ice.",
    items: [
      { name: "Classic Cold Brew", note: "Single-origin Huila, a cloud of cold milk.", price: "5.40", img: "iced-classic", tags: ["Bestseller"] },
      { name: "Vanilla Iced Latte", note: "Caramelised Madagascan vanilla, oat milk, double shot.", price: "5.90", img: "iced-vanilla", tags: ["Oat"] },
      { name: "Mocha Madness", note: "70% dark ganache and cold brew concentrate.", price: "6.20", img: "iced-mocha", tags: ["New"] },
      { name: "Sweet Cream Latte", note: "Slow-poured milk over cold brew, barely sweet.", price: "5.70", img: "iced-latte" },
      { name: "Nitro on Tap", note: "Nitrogen-charged cold brew with a stout-like head.", price: "5.80", img: "cup-double" },
      { name: "Caramel Cold Brew To-Go", note: "House caramel in our classic sealed cup.", price: "5.40", img: "cup-classic" },
    ],
  },
  {
    id: "hot",
    title: "Hot bar",
    blurb: "For the days that call for a warm cup.",
    items: [
      { name: "Espresso", note: "Seasonal blend, pulled short and syrupy.", price: "3.20", img: "g-espresso" },
      { name: "Heart Latte", note: "Silky steamed milk, poured with a heart.", price: "4.60", img: "g-latte" },
      { name: "Rosetta Flat White", note: "Ristretto doubles, velvet micro-foam.", price: "4.40", img: "g-rosetta" },
      { name: "Affogato", note: "Vanilla gelato drowned in a hot espresso shot.", price: "5.50", img: "g-affogato", tags: ["Treat"] },
    ],
  },
  {
    id: "sweet",
    title: "Sweet counter",
    blurb: "Baked every morning by our pastry team.",
    items: [
      { name: "Strawberry Sprinkle Donut", note: "Brioche dough, pink glaze, rainbow sprinkles.", price: "3.40", img: "g-donut-pink" },
      { name: "Double Choc Donut", note: "Cocoa glaze over a vanilla bean ring.", price: "3.40", img: "g-donut-choc" },
      { name: "Macaron Trio", note: "Pistachio-mint, salted caramel, raspberry.", price: "4.80", img: "g-macarons", tags: ["GF"] },
      { name: "Six-Layer Chocolate Cake", note: "Dark sponge, vanilla cream, glossy ganache.", price: "6.20", img: "g-cake" },
      { name: "Raspberry Cupcake", note: "Chocolate sponge, raspberry buttercream swirl.", price: "3.90", img: "g-cupcake" },
      { name: "Mint Cream Cupcake", note: "Fresh-mint buttercream, cherry on top.", price: "3.90", img: "g-cupcake-mint" },
      { name: "Chunk Cookies", note: "Brown-butter dough, 70% dark chocolate chunks.", price: "2.80", img: "g-cookies" },
    ],
  },
];
