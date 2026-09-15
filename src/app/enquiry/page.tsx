import type { Metadata } from "next";
import PageMotion from "@/components/pages/PageMotion";
import { ContourMark, WordHeading } from "@/components/pages/PagePrimitives";
import { TerrainStudy } from "@/components/sections/TerrainStudy";
import { EnquiryCTA } from "@/components/sections/EnquiryCTA";
import styles from "@/components/pages/pages.module.css";

export const metadata: Metadata = {
  title: "Enquire Privately | Land in Coorg",
  description: "Enquire about land in Coorg. Share your ideal setting and connect with us on WhatsApp.",
  alternates: { canonical: "/enquiry" },
};

export default function EnquiryPage() {
  return <PageMotion className={styles.page} tone="quiet">
    <section className={styles.enquiryIntro} aria-labelledby="chapter-title"><ContourMark className={styles.enquiryContour} /><p className={styles.eyebrow} data-chapter-intro>A PERSONAL BEGINNING</p><h1 id="chapter-title"><span className={styles.lineMask}><span data-chapter-entry>Your story</span></span><span className={styles.lineMask}><span data-chapter-entry><em>starts here.</em></span></span></h1><p className={styles.bodyCopy} data-chapter-intro>A place in your mind. A way you want to live. Start with a few thoughts about what would make Coorg feel like yours.</p></section>
    <EnquiryCTA standalone />
    <section className={styles.section} aria-labelledby="enquiry-perspective"><p className={styles.eyebrow}>TAKE A MOMENT / FIND YOUR PERSPECTIVE</p><div className={styles.terrainIntro}><WordHeading id="enquiry-perspective">Every search starts somewhere.</WordHeading><p className={styles.bodyCopy} data-chapter-rise>A hillside, a garden, a sheltered corner of the landscape. Turn this conceptual terrain and consider the setting you are drawn to.</p></div><div data-chapter-rise><TerrainStudy /></div></section>
  </PageMotion>;
}
