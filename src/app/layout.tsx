import type { Metadata } from "next";
import { DM_Serif_Display, Manrope } from "next/font/google";
import "./globals.css";
import "lenis/dist/lenis.css";
import SmoothScroll from "@/components/ui/SmoothScroll";
import PageTransition from "@/components/navigation/PageTransition";
import SiteHeader from "@/components/navigation/SiteHeader";
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

export const metadata: Metadata = {
  title: "Land in Coorg — A Different Kind of Belonging",
  description: "Explore the landscapes of Coorg, from coffee plantations and private hill retreats to estate plots and forest land. Find your own kind of quiet.",
  openGraph: {
    title: "Land in Coorg — A Different Kind of Belonging",
    description: "Where the mist settles, your land begins. Discover the possibilities of land in Coorg.",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${display.variable}`}
    >
      <body><PageTransition><SmoothScroll /><SiteHeader /><main id="main" tabIndex={-1}>{children}</main><Footer /></PageTransition></body>
    </html>
  );
}
