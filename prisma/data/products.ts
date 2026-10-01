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
  {
    slug: "moroccan-brass-pendant-light",
    name: "Moroccan brass pendant light",
    reference: "01 / 24",
    material: "Solid brass, hand-pierced",
    collection: "Light",
    summary:
      "A 70 cm hand-pierced brass pendant: a ring of pierced tubes over an onion-shaped lower body and finial.",
    description:
      "An architectural pendant in the Moorish tradition. Handcrafted from solid brass, it rises in multi-tubular sections around a central lantern and narrows into an ornate, onion-shaped lower body that ends in a turned finial.\n\n" +
      "Every surface is covered in traditional openwork, pierced by hand, so no two pieces are exactly alike. Lit, it gives a soft, warm glow and throws intricate shadows across the walls and ceiling.\n\n" +
      "At 70 cm long it is a statement piece for a living room, dining area, hallway or entryway, and it sits as comfortably in a bohemian or eclectic interior as in a traditional or modern one.",
    priceCents: 350_000,
    stock: 1,
    leadTime: MADE,
    dimensions: "700 mm long",
    care: "Dust with a soft dry cloth. Mild brass polish if you want it bright again.",
    imageSlot: "[ product — brass pendant light ]",
    featured: true,
    specs: [
      { label: "Metal", value: "Solid brass" },
      { label: "Work", value: "Hand-pierced openwork" },
      { label: "Form", value: "Multi-tubular body, onion-shaped finial" },
      { label: "Size", value: "70 cm long" },
    ],
  },
  {
    slug: "flamla-pendant-light",
    name: "Flamla pendant light",
    reference: "02 / 24",
    material: "Solid brass, hand-pierced",
    collection: "Light",
    summary:
      "A grand 1.20 m hand-pierced brass pendant: a teardrop-shaped Flamla over cascading pierced tiers.",
    description:
      "A breathtaking statement piece, handcrafted from solid brass. A tall teardrop-shaped Flamla crowns a run of cascading tiers, each one hand-pierced with geometric and floral motifs.\n\n" +
      "Lit, the openwork diffuses a warm, ambient glow and throws intricate shadow patterns across the surrounding walls and ceiling. Every piercing is made by hand, so no two pieces are exactly alike.\n\n" +
      "At 1.20 m high it is made for large spaces and high ceilings: spacious living rooms, grand hallways and entryways, villas, restaurants and boutique hotels.",
    priceCents: 500_000,
    stock: 1,
    leadTime: MADE,
    dimensions: "1200 mm high",
    care: "Dust with a soft dry cloth. Mild brass polish if you want it bright again.",
    imageSlot: "[ product — brass flamla pendant ]",
    featured: true,
    specs: [
      { label: "Metal", value: "Solid brass" },
      { label: "Work", value: "Hand-pierced geometric and floral motifs" },
      { label: "Form", value: "Teardrop Flamla over cascading tiers" },
      { label: "Size", value: "120 cm high" },
    ],
  },
  {
    slug: "damaa-floor-lamp",
    name: "Damâa floor lamp",
    reference: "03 / 24",
    material: "Solid brass, hand-pierced",
    collection: "Light",
    summary:
      "A 1.20 m hand-pierced brass floor lamp in the elongated Damâa, or teardrop, shape, on a turned brass base.",
    description:
      "A floor lamp handcrafted from solid brass and sculpted into the graceful, elongated Damâa — the teardrop — rising from a turned brass base to a slender point. The whole surface is hand-pierced with geometric and floral filigree.\n\n" +
      "Lit, the light filters through the cutouts and casts complex shadow patterns across the surrounding walls and ceiling, a warm and deeply atmospheric light. Every piercing is made by hand, so no two pieces are exactly alike.\n\n" +
      "At 1.20 m high it is a focal point in its own right: a living room, a grand entryway, an empty corner or a hotel lobby. As much a piece of sculpture as a light, it sits well in almost any interior.",
    priceCents: 300_000,
    stock: 1,
    leadTime: MADE,
    dimensions: "1200 mm high",
    care: "Dust with a soft dry cloth. Mild brass polish if you want it bright again.",
    imageSlot: "[ product — brass teardrop floor lamp ]",
    featured: true,
    specs: [
      { label: "Metal", value: "Solid brass" },
      { label: "Work", value: "Hand-pierced geometric and floral filigree" },
      { label: "Form", value: "Elongated teardrop on a turned base" },
      { label: "Size", value: "120 cm high" },
    ],
  },
  {
    slug: "khobza-dome-pendant-light",
    name: "Khobza dome pendant light",
    reference: "04 / 24",
    material: "Solid brass, hand-pierced",
    collection: "Light",
    summary:
      "A 60 cm hand-pierced brass dome pendant, the low round Khobza shape, worked with rosettes and floral piercing.",
    description:
      "A wide, shallow dome in the round Khobza shape, handcrafted from solid brass. Traditional geometric rosettes sit within a field of floral piercing, every perforation chiselled by hand.\n\n" +
      "Lit, the openwork casts warm, intricate shadows across the walls and ceiling, a cosy and enchanting light. The brass keeps a warm metallic sheen and develops a patina over time.\n\n" +
      "At 60 cm across it is a centrepiece for a living room, dining area, entryway or high-ceilinged space, equally at home in a bohemian or a traditional interior.",
    priceCents: 250_000,
    stock: 1,
    leadTime: MADE,
    dimensions: "Ø 600 mm",
    care: "Dust with a soft dry cloth. Mild brass polish if you want it bright again.",
    imageSlot: "[ product — brass dome pendant ]",
    featured: true,
    specs: [
      { label: "Metal", value: "Solid brass" },
      { label: "Work", value: "Hand-chiselled geometric and floral piercing" },
      { label: "Form", value: "Low round dome" },
      { label: "Size", value: "60 cm diameter" },
    ],
  },
  {
    slug: "hammered-copper-verdigris-pendant",
    name: "Hammered copper verdigris pendant",
    reference: "05 / 24",
    material: "Hammered copper, verdigris patina",
    collection: "Light",
    summary:
      "A hand-hammered copper bell pendant, its lower edge finished in a blue-green verdigris patina.",
    description:
      "A bell-shaped pendant raised from copper and hand-hammered all over, so the surface catches and breaks up the light. The lower part of the shade is finished in a deep blue-green verdigris patina, a striking two-tone against the warm bare copper above.\n\n" +
      "Lit, the hammered interior reflects a warm glow down onto the table or floor below. It hangs from a black cord with a brass fitting.\n\n" +
      "Every shade is hammered and patinated by hand, so the texture and the line of the verdigris differ from one piece to the next. It suits a kitchen island, a dining table or a reading corner.",
    priceCents: 130_000,
    stock: 1,
    leadTime: MADE,
    dimensions: "Size on request",
    care: "Dust with a soft dry cloth. Do not polish the verdigris band — it is the finish.",
    imageSlot: "[ product — copper verdigris pendant ]",
    featured: true,
    specs: [
      { label: "Metal", value: "Copper" },
      { label: "Work", value: "Hand-hammered" },
      { label: "Finish", value: "Bare copper with verdigris patina" },
      { label: "Form", value: "Bell shade, black cord, brass fitting" },
    ],
  },
];
