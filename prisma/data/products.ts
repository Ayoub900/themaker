/**
 * The catalogue as it is seeded. Once the app is running these live in
 * MongoDB and are edited from the dashboard — this file is the starting point,
 * not the source of truth.
 */

export type SeedProduct = {
  slug: string;
  name: string;
  reference: string;
  material: string;
  collection: string;
  summary: string;
  description: string;
  priceCents: number;
  stock: number;
  leadTime: string;
  dimensions: string;
  weight?: string;
  care: string;
  imageSlot: string;
  featured: boolean;
  specs: { label: string; value: string }[];
};

const MADE = "Made to order, 4–6 weeks";

export const products: SeedProduct[] = [
  {
    slug: "star-chandelier",
    name: "Star chandelier",
    reference: "00 / 24",
    material: "Solid brass, hand-pierced",
    collection: "Light",
    summary:
      "A large hand-pierced brass chandelier: a conical crown over a Zellij-inspired star-shaped base.",
    description:
      "A majestic fusion of ancient artistry and geometric elegance. Handcrafted from premium brass, this large statement piece is a masterpiece of traditional metalwork. It comes in two parts: an ornate, conical upper section that steps down to an intricate, multi-pointed star-shaped hexagonal base inspired by Zellij.\n\n" +
      "Every pattern and piercing is hand-punched by our artisans using generations-old techniques, so no two pieces are exactly alike. Lit, the filigree casts a tapestry of light and shadow across the walls and ceiling, a warm and deeply atmospheric light.\n\n" +
      "The solid brass is built to last and develops a beautiful patina over time. It is made for grand entryways, living rooms and dining rooms, or as the architectural highlight of a boutique hotel or traditional home.",
    priceCents: 500_000,
    stock: 1,
    leadTime: MADE,
    dimensions: "Ø 800 mm × 1000 mm high",
    care: "Dust with a soft dry cloth. Mild brass polish if you want it bright again.",
    imageSlot: "[ product — brass star chandelier ]",
    featured: true,
    specs: [
      { label: "Metal", value: "Solid brass" },
      { label: "Work", value: "Hand-punched filigree" },
      { label: "Form", value: "Conical crown, star-shaped hexagonal base" },
      { label: "Size", value: "100 cm high, 80 cm wide" },
    ],
  },
];
