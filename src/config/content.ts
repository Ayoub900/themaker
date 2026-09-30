/**
 * Editorial content that is stable enough to live in the repo rather than the
 * database: workshop values, testimonials, FAQs, the process narrative and the
 * long-form care and shipping copy.
 *
 * Anywhere the copy names the city or quotes a price it reads the value from
 * `@/config/site` rather than spelling it out, so moving the workshop or
 * changing a rate stays a one-line edit over there.
 *
 * Products, journal posts, orders and messages are all managed from the
 * dashboard and live in MongoDB — see prisma/schema.prisma.
 */

import { formatCents } from "@/lib/money";
import { policies, shipping, site } from "@/config/site";

const flatRate = formatCents(shipping.flatRateCents);
const freeOver = formatCents(shipping.freeThresholdCents);

export const hero = {
  eyebrow: `${site.city} · since ${site.founded}`,
  title: "Objects in brass and bronze, made by hand.",
  subtitle: `A small catalogue of forged household pieces, made one at a time in a courtyard workshop in ${site.city}. Unlacquered, so they age with you.`,
  primaryCta: { label: "Browse products", href: "/products" },
  secondaryCta: { label: "Our story", href: "/about" },
  imageSlot: "[ hero — bench shot, tools and brass ]",
  photo: {
    src: "/images/hero.jpg",
    alt: "Pierced brass lanterns hanging in a dimly lit market",
  },
} as const;

/** The four promises repeated across the site. */
export const marks = [
  {
    k: "Materials",
    v: "Solid brass, bronze, copper and blackened steel. No plating, no lacquer, nothing to chip away.",
  },
  {
    k: "Made in",
    v: `${site.city}, in a courtyard workshop of two people. Every piece passes through both pairs of hands.`,
  },
  {
    k: "Lead time",
    v: "Catalogue pieces ship in five working days. Commissions run four to six weeks.",
  },
  {
    k: "Repairs",
    v: "Free mending on anything we have made, for as long as we are at the bench.",
  },
] as const;

export const stats = [
  { n: "25", label: "Years at the bench" },
  { n: "1 m", label: "Tallest piece, hand-pierced" },
  { n: "100%", label: "Made in-house" },
] as const;

export const about = {
  title: "Two makers, one courtyard, twenty-five years.",
  lede: "We started by repairing old brass hardware for the buildings around us. The repairs taught us what lasts, and eventually what to make ourselves.",
  body: [
    `The workshop sits behind a door in the old quarter of ${site.city}. It has two benches, a coke forge, a fly press our predecessor left behind, and a window that faces north because that is the light you want when you are judging a surface.`,
    "For the first decade we did not make anything of our own. We repaired: door bolts, casement stays, sconces and lantern frames from houses built when the quarter was new. A century of other people’s brass passed across the bench. It is an unusual education. You learn very quickly which joints fail, which finishes lie, and which objects were made by someone who expected to be judged on them.",
    "What we learned is that almost everything that fails, fails at the finish. Plating hides the metal underneath and then flakes off it. Lacquer yellows, then peels, then traps the tarnish it was meant to prevent. The pieces that were still good after ninety years were the ones left bare — solid metal, no coating, allowed to darken.",
    "So we do not plate and we do not lacquer. A piece leaves the workshop polished or brushed or blackened, and then it is yours to age. Unlacquered brass takes a patina within months: warm where hands touch it, darker where they do not. You can polish it back whenever you like. Both states are correct.",
    "The range is small on purpose and grows slowly, because a piece only joins it once we have made it enough times to know what it should cost and how long it should take. Everything else we make to order. Nothing leaves the courtyard that we would not keep ourselves.",
  ],
  imageSlot: "[ portrait — the two makers ]",
  photo: {
    src: "/images/story.jpg",
    alt: "An artisan engraving a decorative metal tray at the bench",
  },
} as const;

export const makers = [
  {
    name: "Salma Bennani",
    role: "Forge, raising, chasing",
    note: `Trained in the dinanderie workshops of Fès. Raises every bowl and tray we make.`,
    photo: {
      src: "/images/maker-1.jpg",
      alt: "Hands chasing a pattern into sheet metal",
    },
  },
  {
    name: "Youssef Amrani",
    role: "Casting, fitting, finishing",
    note: "Came from architectural restoration. Cuts the patterns and does the final surface on everything.",
    photo: {
      src: "/images/maker-2.jpg",
      alt: "Hands working a detailed metal piece at the bench",
    },
  },
] as const;

/** How a commission actually runs. Used on /about and /contact. */
export const process = [
  {
    step: "01",
    title: "Write to us",
    body: "Send dimensions, the metal you have in mind, and your deadline. Photographs of the space help more than drawings do.",
  },
  {
    step: "02",
    title: "Quote within two days",
    body: "A fixed price and a date. If what you want is a bad idea in brass, we will say so and suggest what to do instead.",
  },
  {
    step: "03",
    title: "Sample, then the run",
    body: "For anything above six pieces we make one first and post it to you. Nothing goes into production until you have held it.",
  },
  {
    step: "04",
    title: "Delivered and registered",
    body: "Insured and tracked. We keep the pattern and the notes, so a matching piece in five years is a phone call, not a redesign.",
  },
] as const;

export const testimonials = [
  {
    stars: 5,
    quote:
      "The bowl has a weight to it that photographs cannot explain. Four years in and it has only improved.",
    who: "Camille R.",
    where: "Rabat",
  },
  {
    stars: 5,
    quote: "They repaired a sconce I bought in 2019 and refused to charge me for it.",
    who: "Jonas W.",
    where: "Tanger",
  },
  {
    stars: 5,
    quote:
      "Commissioned door pulls for a whole building. Every one matched, every one different.",
    who: "Studio Levant",
    where: site.city,
  },
] as const;

/** Rendered on /faq and emitted as FAQPage structured data. */
export const faqs = [
  {
    q: "Will the brass darken over time?",
    a: "Yes, and that is the point. Unlacquered brass begins to shift within weeks and settles into a warm brown patina over six to twelve months. Hands keep the high points bright, so a piece ends up mapping its own use. Polish it back with a soft cloth whenever you want the original colour — both states are correct, and neither harms the metal.",
  },
  {
    q: "Do you take commissions?",
    a: "Regularly, and they are about half of what we do. Send dimensions, the metal you have in mind and your deadline; we quote a fixed price within two days. Anything above six pieces gets a sample first, posted to you before the run starts.",
  },
  {
    q: "How long does an order take?",
    a: `Catalogue pieces in stock leave the workshop within ${policies.leadTimeStock}. Commissions run ${policies.leadTimeCommission} depending on the queue, and we tell you the real date rather than the optimistic one.`,
  },
  {
    q: "Do you ship outside Morocco?",
    a: `Anywhere in Morocco is ${flatRate}, insured and tracked, and free over ${freeOver}. ${shipping.internationalNote} Duties and import taxes at the destination are the buyer’s responsibility.`,
  },
  {
    q: "What if something breaks?",
    a: "Bring it back or post it back. We repair anything we made, free, for as long as we are at the bench — that includes pieces bought second-hand and pieces you damaged yourself. We would rather mend it than have you replace it.",
  },
  {
    q: "Can I return something I have changed my mind about?",
    a: `Catalogue pieces can be returned within ${policies.returnWindowDays} days of delivery, unused and in their packaging, for a full refund of the item price. Commissions and made-to-measure work are exempt, because they cannot be resold — which is why we sample before we run.`,
  },
  {
    q: "Is the copper safe for food?",
    a: "Copper we make for food is tinned on the interior, which is the traditional food-safe lining. Tin wears through eventually; when it does, send the piece back and we will re-tin it at cost. The brass and bronze pieces are decorative and are not intended for acidic food.",
  },
  {
    q: "Can I visit the workshop?",
    a: "Thursday to Saturday, 10 to 18. Write ahead so that someone is at the bench rather than at the merchant when you arrive. There is usually something in the fire.",
  },
] as const;

/** Long-form care guidance. Also used to build the /care page structured data. */
export const careGuide = {
  title: "Care & repair",
  lede: "Everything we make is bare metal. That means it changes, and that changing is reversible. Here is what to expect and what to do about it.",
  sections: [
    {
      title: "Unlacquered brass and bronze",
      body: [
        "Expect movement in the first month. Fingerprints show as darker marks within days, and the overall tone walks from yellow towards a warm brown over six to twelve months. Pieces near a kitchen or a coast move faster, because steam and salt both accelerate it.",
        "To keep it bright: a dry microfibre cloth, often. That alone removes most of what causes tarnish. When it has gone further than you like, use a mild brass polish sparingly, work with the grain of the finish, and buff it off completely — polish left in a corner keeps working and leaves a light halo.",
        "To slow it down: a thin coat of microcrystalline wax on clean, dry metal, buffed to nothing. Renew it once or twice a year. It is what museums use and it does not yellow the way lacquer does.",
        "To leave it alone: do exactly that. A settled patina is stable and protective, and it is the reason the ninety-year-old hardware we repair is still worth repairing.",
      ],
    },
    {
      title: "Blackened steel",
      body: [
        "The black is an oxide, not a paint, and it needs a trace of oil to stay put. Wipe the piece with a barely oiled cloth two or three times a year — any neutral oil works, argan or camellia oil both do.",
        "If orange spotting appears, it is surface rust and it comes off with fine steel wool and oil. Do not use water, and do not leave a candlestick standing in the wax that has run down it.",
      ],
    },
    {
      title: "Tinned copper",
      body: [
        "Wash by hand, warm water, no dishwasher and no abrasive pads — the dishwasher will strip the tin and dull the exterior in a single cycle.",
        "The tin lining darkens with use, which is normal. When copper begins to show through in more than one spot, the tray is due for re-tinning. Send it back; we do it at cost and it comes home good for another decade.",
      ],
    },
    {
      title: "Repairs",
      body: [
        "Free, for life, on anything that left this workshop. Loose joints, cracked bases, sconces that need rewiring, pieces that have been dropped or badly polished.",
        "Write first with a photograph so we can tell you whether to post it or bring it. If you bought the piece second-hand it is still covered — the guarantee attaches to the object, not to the receipt.",
      ],
    },
  ],
} as const;

export const shippingCopy = {
  title: "Shipping & returns",
  lede: "Everything travels insured and tracked, packed in wool felt and recycled board. No plastic leaves the workshop.",
  sections: [
    {
      title: "Dispatch",
      body: [
        `Catalogue pieces held in stock are dispatched within ${policies.leadTimeStock}. If a piece has sold out between your order and our bench, we tell you the same day and you choose between waiting for the next batch or a full refund.`,
        `Commissions and made-to-measure work run ${policies.leadTimeCommission}. You get a real date at the quote stage and a photograph of the finished piece before it is packed.`,
      ],
    },
    {
      title: "Rates and transit",
      body: [
        `One flat rate anywhere in Morocco: ${flatRate}, ${shipping.transit}. Shipping is free on any order over ${freeOver}.`,
        `${shipping.internationalNote} Duties and import taxes are set by the destination country and are the buyer’s responsibility; we declare the full value because insurance depends on it.`,
      ],
    },
    {
      title: "Returns",
      body: [
        `Catalogue pieces can be returned within ${policies.returnWindowDays} days of delivery for a full refund of the item price. They need to be unused and in their original packaging, and the return postage is yours unless the piece arrived faulty.`,
        "Commissions, made-to-measure pieces and anything cut, wired or engraved to your specification cannot be returned, because they cannot be resold. This is exactly why we sample first on any run above six pieces.",
        "Faulty or damaged on arrival: photograph it before you unpack any further and tell us the same day. We collect it at our cost and either repair or replace it.",
      ],
    },
  ],
} as const;
