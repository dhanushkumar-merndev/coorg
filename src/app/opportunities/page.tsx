import type { Metadata } from "next";
import CoorgWorldsCarousel from "@/components/worlds/CoorgWorldsCarousel";
import { EnquiryCTA } from "@/components/sections/EnquiryCTA";
import PageMotion from "@/components/pages/PageMotion";
import { ChapterHero, WordHeading, ContourMark } from "@/components/pages/PagePrimitives";
import styles from "@/components/pages/pages.module.css";

export const metadata: Metadata = {
  title: "Opportunities | Land in Coorg",
  description: "Explore five ways of imagining a life in Coorg, from plantation estates to quiet countryside homes. Begin with the setting that matters to you.",
};

export default function OpportunitiesPage() {
  return <PageMotion className={styles.page}>
    <ChapterHero chapter="01" label="Opportunities" lines={["A landscape of", "possibilities."]} description="A place to return to. Space to create. A landscape to care for. Begin with your own idea of belonging." image="/images/coorg/conceptual/hero-mist-valley.webp" alt="Conceptual panorama of forested Coorg hills and mist at dawn" anchor="opportunities" variant="wide" />
    <CoorgWorldsCarousel />
    <section className={`${styles.section} ${styles.darkSection}`} aria-labelledby="search-perspective">
      <ContourMark className={styles.contour} />
      <div className={styles.introGrid}><p className={styles.eyebrow}>THE START OF YOUR SEARCH</p><div><WordHeading id="search-perspective">Start with what matters to you.</WordHeading><p className={`${styles.bodyCopy} ${styles.introText}`}>These worlds are an invitation to explore. Individual opportunities, availability and property details are shared only after confirmation.</p></div></div>
      <div className={styles.fieldNotes}>{[
        ["01", "The setting", "A sheltered garden, a working landscape or an open view. Picture the surroundings you would like to wake up to."],
        ["02", "The everyday", "Think beyond a weekend: the approach, the seasons and how you would spend time here."],
        ["03", "The intention", "A place to live, land to tend, or room to imagine. Your priorities give the conversation its direction."],
      ].map(([number, title, copy]) => <article className={styles.fieldNote} key={number} data-chapter-rise><span className={styles.rule} data-chapter-rule /><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
    </section>
    <EnquiryCTA />
  </PageMotion>;
}
