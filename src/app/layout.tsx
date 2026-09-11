import type { Metadata } from "next";
import { DM_Serif_Display, Manrope } from "next/font/google";
import "./globals.css";
import "lenis/dist/lenis.css";
import SmoothScroll from "@/components/ui/SmoothScroll";
import PageTransition from "@/components/navigation/PageTransition";
import SiteHeader from "@/components/navigation/SiteHeader";
import PagePatterns from "@/components/ui/PagePatterns";
import { Footer } from "@/components/sections/Footer";

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

const deploymentHost = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ?? (deploymentHost ? `https://${deploymentHost}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "Land in Coorg",
  icons: {
    icon: [
      { url: "/favicon.ico?v=3" },
      { url: "/favicon-32x32.png?v=3", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png?v=3", sizes: "16x16", type: "image/png" },
      { url: "/favicon-48x48.png?v=3", sizes: "48x48", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png?v=3",
  },
  manifest: "/site.webmanifest",
  title: "Land in Coorg — A Different Kind of Belonging",
  description: "Explore the landscapes of Coorg, from coffee plantations and private hill retreats to estate plots and forest land. Find your own kind of quiet.",
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
      <body><PageTransition><SmoothScroll /><SiteHeader /><main id="main" tabIndex={-1}>{children}<PagePatterns /></main><Footer /></PageTransition></body>
    </html>
  );
}
