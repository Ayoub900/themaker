/**
 * THE MAKER — global site variables.
 *
 * Single source of truth for anything that appears in more than one place:
 * brand strings, contact details, addresses, opening hours,
 * navigation, shipping rules and SEO defaults.
 *
 * Change it here, it changes everywhere. Nothing below should be duplicated
 * as a literal anywhere else in the codebase.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * STILL OUTSTANDING — everything marked `TODO(client)` is invented or
 * approximate. The rest of the codebase reads these values rather than
 * hard-coding them, so editing the lines below is the whole job: no page,
 * component or copy file needs touching.
 *
 *   1. `address.postalCode` — 40000 is the general Marrakech code; confirm
 *      the one on the registration papers.
 *   2. `address.latitude` / `longitude` — a Guéliz block centre, not the
 *      door. Replace with the exact pin; it is published as structured data.
 * ─────────────────────────────────────────────────────────────────────────
 */

const rawUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** Absolute origin, never with a trailing slash. */
export const SITE_URL = rawUrl.replace(/\/+$/, "");

/** Build an absolute URL from a site-relative path. */
export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export const site = {
  name: "The Maker",
  legalName: "The Maker — Artisanat Métaux SARL",
  tagline: "Artisanat Métaux",
  /** Used as the default <title> template suffix. */
  titleSuffix: "The Maker — Artisanat Métaux",
  domain: "themaker.ma",
  description:
    "Forged household objects in solid brass, bronze and copper, made one at a time in a courtyard workshop in Morocco. Unlacquered finishes, lifetime repairs, worldwide shipping.",
  shortDescription:
    "Hand-forged brass and bronze objects from a two-person workshop in Morocco.",
  founded: 2001,
  locale: "en_GB",
  language: "en",
  city: "Marrakech",
  country: "Morocco",
  countryCode: "MA",
} as const;

export const contact = {
  email: "rachid@themaker.ma",
  /** The workshop line, as it reads on the page. */
  phone: "+212 617 155 673",
  /** Same number, E.164, for tel: links and structured data. */
  phoneHref: "+212617155673",
  /**
   * WhatsApp on the same line as `phone`, so there is one number to keep in
   * sync. Leave "" to hide every WhatsApp link on the site.
   */
  whatsappUrl: "https://wa.me/212617155673",
} as const;

/** True once the workshop has a published mailbox. */
export const hasEmail: boolean = contact.email.length > 0;

/** True once the workshop has a published telephone line. */
export const hasPhone: boolean = contact.phoneHref.length > 0;

/** True while WhatsApp is offered as the direct line. */
export const hasWhatsapp: boolean = contact.whatsappUrl.length > 0;

/**
 * The reachable channels as one sentence fragment, for the legal pages.
 * It lists only what is actually switched on above, so terms and privacy can
 * never print a channel the rest of the site is hiding.
 */
export const contactChannels: string =
  [
    hasPhone ? contact.phone : null,
    hasEmail ? contact.email : null,
    hasWhatsapp ? `WhatsApp (${contact.whatsappUrl})` : null,
  ]
    .filter((entry): entry is string => entry !== null)
    .join(", ") || "the contact page on this site";

export const address = {
  /** The domiciliation address as it reads on the registration papers. */
  street: "Le Noyer, rue Ibn Sina, 4e étage n° 41",
  district: "Guéliz",
  /** TODO(client): general Marrakech code — confirm against the papers. */
  postalCode: "40000",
  city: site.city,
  region: "Marrakech-Safi",
  country: site.country,
  countryCode: site.countryCode,
  /** One-line form used in the footer and contact block. */
  oneLine: `Le Noyer, rue Ibn Sina, 4e étage n° 41, Guéliz, 40000 ${site.city}`,
  /** TODO(client): approximate — Guéliz block centre, not the door. */
  latitude: 31.634,
  longitude: -8.012,
  mapsUrl: "https://maps.google.com/?q=Rue+Ibn+Sina+Gueliz+Marrakech+Morocco",
} as const;

/** Workshop visiting hours. `null` means closed that day. */
export const openingHours = [
  { day: "Monday", short: "Mon", opens: null, closes: null },
  { day: "Tuesday", short: "Tue", opens: null, closes: null },
  { day: "Wednesday", short: "Wed", opens: null, closes: null },
  { day: "Thursday", short: "Thu", opens: "10:00", closes: "18:00" },
  { day: "Friday", short: "Fri", opens: "10:00", closes: "18:00" },
  { day: "Saturday", short: "Sat", opens: "10:00", closes: "18:00" },
  { day: "Sunday", short: "Sun", opens: null, closes: null },
] as const;

export const openingHoursSummary = "Visits Thursday–Saturday, 10–18";

/** Primary header navigation. */
export const mainNav = [
  { label: "Products", href: "/products" },
  { label: "Journal", href: "/journal" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

/** Footer link columns. */
export const footerNav = [
  {
    title: "Shop",
    links: [
      { label: "All products", href: "/products" },
      { label: "Commissions", href: "/contact?topic=commission" },
      { label: "Shipping", href: "/shipping" },
      { label: "Care & repair", href: "/care" },
    ],
  },
  {
    title: "Workshop",
    links: [
      { label: "Our story", href: "/about" },
      { label: "Journal", href: "/journal" },
      { label: "Questions", href: "/faq" },
      { label: "Visit us", href: "/contact#visit" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of sale", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
      { label: "Returns", href: "/shipping#returns" },
    ],
  },
] as const;

/** Currency and money formatting. Amounts are stored in centimes. */
export const currency = {
  code: "MAD",
  symbol: "DH",
  /**
   * The site copy is in English, so amounts are grouped the English way:
   * "MAD 2,400". Switching this to "fr-MA" gives "2.400 MAD" — a dot
   * separator that reads as a decimal point to an English reader.
   */
  locale: "en-MA",
} as const;

/**
 * Shipping. Prices are in centimes to stay integer-safe end to end.
 *
 * One flat national rate — there is no zone picker at checkout. Anything
 * going abroad is quoted by hand through the contact form, because the
 * carrier price depends on the piece.
 */
export const shipping = {
  freeThresholdCents: 300_000,
  flatRateCents: 9_000,
  transit: "2–4 working days",
  carrier: "Amana & DHL Express, insured and tracked",
  packaging: "Wool felt, recycled board, no plastic",
  internationalNote:
    "Shipping outside Morocco is quoted piece by piece — write to us before you order and we will price it with the carrier.",
} as const;

export const policies = {
  leadTimeStock: "5 working days",
  leadTimeCommission: "4 to 6 weeks",
  returnWindowDays: 14,
  warranty: "Free repairs, for life, on anything we made",
} as const;

/** Defaults consumed by `src/lib/seo.ts`. */
export const seo = {
  defaultTitle: `${site.name} — Hand-forged brass & bronze objects, ${site.city}`,
  keywords: [
    "hand forged brass",
    "bronze homeware",
    `artisan metalwork ${site.city}`,
    "unlacquered brass",
    "blacksmith commissions Morocco",
    "copper serving tray",
    "brass door pull",
  ],
  twitterHandle: "@themakeratelier",
  /** Fallback OG image, rendered on the fly by /opengraph-image. */
  ogImagePath: "/opengraph-image",
} as const;

export const brand = {
  /** Kept in sync with the CSS custom properties in globals.css. */
  colors: {
    ink: "#221E19",
    paper: "#FAF7F1",
    parchment: "#F2EDE3",
    stone: "#E8E4DC",
    muted: "#6E665C",
    faint: "#8B8377",
    gold: "#C69B54",
  },
  logo: {
    /** The mark on its own. The wordmark is set in type beside it. */
    mark: "/logo-mark.png",
  },
} as const;

export const dashboard = {
  path: "/dashboard",
  loginPath: "/login",
  sessionCookie: "tm_session",
  /** Session lifetime in seconds (8 hours). */
  sessionMaxAge: 60 * 60 * 8,
  loginMaxAttempts: 5,
  loginWindowMinutes: 15,
  loginLockMinutes: 15,
} as const;

export const copyrightLine = `© ${new Date().getFullYear()} ${site.name}. Made in ${site.city}.`;
