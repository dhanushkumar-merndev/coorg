import type { MetadataRoute } from "next";
import { absoluteUrl, siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Next's image optimiser and RSC payloads are infrastructure, not pages.
      { userAgent: "*", allow: "/", disallow: ["/_next/", "/api/"] },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteUrl,
  };
}
