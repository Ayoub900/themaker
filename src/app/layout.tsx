import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";

import { SITE_URL, brand, seo, site } from "@/config/site";

import "./globals.css";

/**
 * Self-hosted at build time by next/font, so there is no render-blocking
 * request to Google and no layout shift from a late swap.
 */
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
  preload: true,
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
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
