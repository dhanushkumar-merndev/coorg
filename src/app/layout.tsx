import type { Metadata } from "next";
import { DM_Serif_Display, Manrope } from "next/font/google";
import "./globals.css";
import "lenis/dist/lenis.css";
import SmoothScroll from "@/components/ui/SmoothScroll";
import PageTransition from "@/components/navigation/PageTransition";
import SiteHeader from "@/components/navigation/SiteHeader";
import PagePatterns from "@/components/ui/PagePatterns";
import { Footer } from "@/components/sections/Footer";
import { contactTelephone } from "@/data/contact";
import { absoluteUrl, siteDescription, siteName, siteTagline, siteUrl } from "@/lib/site";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

const display = DM_Serif_Display({
  variable: "--font-display",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

// Organization and WebSite describe the practice itself, which is the one thing
// on this site that is fully verified. Nothing about an individual property is
// marked up, because none of those facts are confirmed for publication yet.
const organizationLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "RealEstateAgent",
      "@id": absoluteUrl("/#organization"),
      name: siteName,
      url: siteUrl,
      description: siteDescription,
      slogan: siteTagline,
      telephone: contactTelephone,
      image: absoluteUrl("/android-chrome-512x512.png"),
      logo: absoluteUrl("/android-chrome-512x512.png"),
      areaServed: { "@type": "AdministrativeArea", name: "Kodagu (Coorg), Karnataka, India" },
    },
    {
      "@type": "WebSite",
      "@id": absoluteUrl("/#website"),
      url: siteUrl,
      name: siteName,
      description: siteDescription,
      inLanguage: "en-IN",
      publisher: { "@id": absoluteUrl("/#organization") },
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "Land in Coorg",
  // Google Search picks one favicon and wants a square that is a multiple of
  // 48px, so the 48 and 192 variants are declared ahead of the smaller ones and
  // served from stable URLs (a ?v= cache-buster makes the icon crawl flakier).
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48 32x32 16x16" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  manifest: "/site.webmanifest",
  title: "Land in Coorg — A Different Kind of Belonging",
  description: siteDescription,
  openGraph: {
    siteName: "Land in Coorg",
    title: "Land in Coorg — A Different Kind of Belonging",
    description: "Where the mist settles, your land begins. Discover the possibilities of land in Coorg.",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Land in Coorg — A Different Kind of Belonging",
    description: "Where the mist settles, your land begins. Discover the possibilities of land in Coorg.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${display.variable}`}
    >
      <body>
        <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }} />
        <PageTransition><SmoothScroll /><SiteHeader /><main id="main" tabIndex={-1}>{children}<PagePatterns /></main><Footer /></PageTransition>
      </body>
    </html>
  );
}
