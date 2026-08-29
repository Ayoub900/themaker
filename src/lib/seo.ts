import type { Metadata } from "next";

import {
  SITE_URL,
  absoluteUrl,
  address,
  brand,
  contact,
  currency,
  hasEmail,
  hasPhone,
  openingHours,
  seo,
  site,
  social,
} from "@/config/site";
import { faqs } from "@/config/content";
import { imageUrl, type ImageRef } from "@/lib/images";

/** An uploaded photograph as a crawler needs it: absolute, with its size. */
function shareable(image: ImageRef) {
  return {
    url: absoluteUrl(imageUrl(image.id)),
    width: image.width,
    height: image.height,
    alt: image.alt,
  };
}

/**
 * Metadata and structured data helpers.
 *
 * Every page builds its <head> through `pageMetadata` so that canonicals,
 * Open Graph and Twitter cards stay consistent and cannot drift apart.
 */

type PageMetaInput = {
  title: string;
  description: string;
  /** Site-relative, e.g. "/products/forged-bowl-no-4". */
  path: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  noIndex?: boolean;
  keywords?: string[];
  /** The piece's own photograph. Without one, the site's card image stands. */
  image?: ImageRef | null;
};

export function pageMetadata({
  title,
  description,
  path,
  type = "website",
  publishedTime,
  modifiedTime,
  noIndex = false,
  keywords,
  image,
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path);

  // Left undefined rather than empty where there is no photograph, so that
  // the `opengraph-image` file convention keeps supplying the default card.
  const images = image ? [shareable(image)] : undefined;

  return {
    title,
    description,
    keywords: keywords ?? [...seo.keywords],
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: site.name,
      locale: site.locale,
      ...(images ? { images } : {}),
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: seo.twitterHandle,
      creator: seo.twitterHandle,
      ...(images ? { images } : {}),
    },
  };
}

/** Truncate a description to a length search engines will actually show. */
export function metaDescription(text: string, max = 158): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 60 ? lastSpace : cut.length)}…`;
}

// ------------------------------------------------------------- JSON-LD

const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness", "Store"],
    "@id": ORG_ID,
    name: site.name,
    legalName: site.legalName,
    url: SITE_URL,
    logo: absoluteUrl(brand.logo.mark),
    image: absoluteUrl(seo.ogImagePath),
    description: site.description,
    foundingDate: String(site.founded),
    ...(hasEmail ? { email: contact.email } : {}),
    ...(hasPhone ? { telephone: contact.phoneHref } : {}),
    priceRange: "$$",
    currenciesAccepted: currency.code,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${address.street}, ${address.district}`,
      addressLocality: address.city,
      postalCode: address.postalCode,
      addressRegion: address.region,
      addressCountry: address.countryCode,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: address.latitude,
      longitude: address.longitude,
    },
    openingHoursSpecification: openingHours
      .filter((day) => day.opens !== null)
      .map((day) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: `https://schema.org/${day.day}`,
        opens: day.opens,
        closes: day.closes,
      })),
    sameAs: social.map((channel) => channel.href),
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": SITE_ID,
    url: SITE_URL,
    name: site.name,
    description: site.description,
    inLanguage: site.language,
    publisher: { "@id": ORG_ID },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/products?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

type ProductLdInput = {
  slug: string;
  name: string;
  summary: string;
  material: string;
  priceCents: number;
  currency: string;
  stock: number;
  reference: string;
  images: ImageRef[];
};

export function productLd(product: ProductLdInput) {
  const url = absoluteUrl(`/products/${product.slug}`);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: product.name,
    description: product.summary,
    ...(product.images.length > 0
      ? { image: product.images.map((image) => absoluteUrl(imageUrl(image.id))) }
      : {}),
    sku: product.reference.replace(/\s+/g, ""),
    material: product.material,
    url,
    brand: { "@type": "Brand", name: site.name },
    manufacturer: { "@id": ORG_ID },
    countryOfOrigin: site.country,
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: product.currency,
      price: (product.priceCents / 100).toFixed(2),
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/BackOrder",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": ORG_ID },
    },
  };
}

type ArticleLdInput = {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  publishedAt: Date | null;
  updatedAt: Date;
  image: ImageRef | null;
};

export function articleLd(post: ArticleLdInput) {
  const url = absoluteUrl(`/journal/${post.slug}`);

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: post.title,
    description: post.excerpt,
    ...(post.image ? { image: [absoluteUrl(imageUrl(post.image.id))] } : {}),
    url,
    mainEntityOfPage: url,
    inLanguage: site.language,
    author: { "@type": "Person", name: post.author },
    publisher: { "@id": ORG_ID },
    datePublished: (post.publishedAt ?? post.updatedAt).toISOString(),
    dateModified: post.updatedAt.toISOString(),
  };
}

export function faqLd(entries: readonly { q: string; a: string }[] = faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map((entry) => ({
      "@type": "Question",
      name: entry.q,
      acceptedAnswer: { "@type": "Answer", text: entry.a },
    })),
  };
}

export function breadcrumbLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

export function itemListLd(
  name: string,
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: absoluteUrl(item.path),
    })),
  };
}
