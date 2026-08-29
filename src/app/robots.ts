import type { MetadataRoute } from "next";

import { SITE_URL, absoluteUrl } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Nothing here is secret, but none of it belongs in an index either.
        disallow: ["/dashboard", "/login", "/cart", "/checkout", "/orders/", "/api/"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: SITE_URL,
  };
}
