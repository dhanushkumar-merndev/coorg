import type { Metadata } from "next";
import PageMotion from "@/components/pages/PageMotion";
import { ChapterHero, NextChapter } from "@/components/pages/PagePrimitives";
import BrandShowcase from "@/components/brand/BrandShowcase";
import { siteName } from "@/lib/site";
import styles from "@/components/pages/pages.module.css";

export const metadata: Metadata = {
  title: `Brand Identity & Official Logos | ${siteName}`,
  description: "Official brand logos, vector SVGs, 4K lockups, color palette, and design guidelines for Star Managed Farmlands.",
  alternates: { canonical: "/brand" },
};

export default function BrandPage() {
  return (
    <PageMotion className={styles.page} tone="landscape">
      <ChapterHero
        chapter="05"
        label="Brand Identity"
        lines={["The Star Emblem.", "Grounded & Resolute."]}
        description="Official brand logos, scalable vectors, Ultra-HD 4K lockups, and design system specifications for Star Managed Farmlands."
        image="/images/coorg/supplied/generic/forest-curve.webp"
        alt="A quiet road curving through tall trees in Coorg"
        anchor="brand-showcase"
        variant="center"
        disclosure="Source marketing imagery"
      />
      <div id="brand-showcase" style={{ paddingTop: "40px" }}>
        <BrandShowcase />
      </div>
      <NextChapter
        href="/enquiry"
        eyebrow="CONNECT"
        title="Ready to explore the land?"
        line="Connect privately with our estate advisory team."
      />
    </PageMotion>
  );
}
