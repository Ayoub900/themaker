import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

import { SITE_URL, brand, seo, site } from "@/config/site";

import "./globals.css";

/**
 * Self-hosted from `./fonts` (the Google Fonts latin variable files), so there
 * is no render-blocking request to Google, no layout shift from a late swap,
 * and no dependency on Google's CSS at build time — Turbopack's
 * `next/font/google` loader fails outright when Google answers with its
 * `/l/font?kit=…` URLs.
 */
const cormorant = localFont({
  src: [
    { path: "./fonts/cormorant-garamond.woff2", weight: "300 600", style: "normal" },
    { path: "./fonts/cormorant-garamond-italic.woff2", weight: "300 600", style: "italic" },
  ],
  variable: "--font-cormorant",
  display: "swap",
  preload: true,
});

const jost = localFont({
  src: "./fonts/jost.woff2",
  weight: "300 500",
  style: "normal",
  variable: "--font-jost",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: seo.defaultTitle,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: SITE_URL }],
  creator: site.name,
  publisher: site.legalName,
  category: "Home & Garden",
  formatDetection: { telephone: false, address: false, email: false },
  icons: {
    icon: [{ url: brand.logo.mark, type: "image/png" }],
    apple: [{ url: brand.logo.mark }],
  },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    url: SITE_URL,
  },
  twitter: { card: "summary_large_image", site: seo.twitterHandle },
};

export const viewport: Viewport = {
  themeColor: brand.colors.paper,
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={site.language} className={`${cormorant.variable} ${jost.variable}`}>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
