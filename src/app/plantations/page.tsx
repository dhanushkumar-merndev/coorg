import type { Metadata } from "next";
import PageMotion from "@/components/pages/PageMotion";
import { ChapterHero, WordHeading, LandscapeImage, RouteButton, NextChapter, ContourMark } from "@/components/pages/PagePrimitives";
import styles from "@/components/pages/pages.module.css";

export const metadata: Metadata = {
  title: "Plantations | Land in Coorg",
  description: "An editorial perspective on plantation life in Coorg: landscape, seasons and a thoughtful relationship with the land.",
};

export default function PlantationsPage() {
  return <PageMotion className={styles.page} tone="plantation">
    <ChapterHero chapter="02" label="Plantations" lines={["Rooted in", "something real."]} description="The quiet pull of working land. A road through the trees. A rhythm shaped by the landscape." image="/images/coorg/conceptual/plantation-estates.webp" alt="Conceptual plantation road winding between lush hills in the morning mist" anchor="plantation-life" />
    <section id="plantation-life" className={`${styles.section} ${styles.plantationGrid}`}>
      <LandscapeImage src="/images/coorg/conceptual/plantation-estates.webp" alt="Conceptual tree-lined plantation landscape with a winding path" caption="01 / A living landscape" />
      <div className={styles.plantationCopy}><p className={styles.eyebrow}>A DIFFERENT KIND OF EVERYDAY</p><WordHeading>Some places ask you to slow down.</WordHeading><div className={styles.bodyCopy} data-chapter-rise><p>Imagine knowing a place by the walk through it. The curve in the road, the light between the trees, the familiar view from the veranda.</p><p>A plantation is a living landscape. The search begins with its character, the care it calls for and the relationship you want to have with the land.</p></div><div className={styles.textAction} data-chapter-rise><RouteButton href="/opportunities/plantation-estates">Explore plantation estates</RouteButton></div><LandscapeImage className={styles.plantationDetail} src="/images/coorg/conceptual/countryside-homes.webp" alt="Conceptual shaded countryside veranda beside a garden" caption="Space to pause" /></div>
    </section>
    <section className={`${styles.section} ${styles.darkSection}`} aria-labelledby="plantation-considerations">
      <ContourMark className={styles.contour} /><div className={styles.darkIntro}><p className={styles.eyebrow}>BEYOND THE FIRST IMPRESSION</p><WordHeading id="plantation-considerations">Look closer. Listen to the land.</WordHeading></div>
      <div className={styles.fieldNotes}>{[
        ["01", "Character", "Start with the terrain, the planting and the surrounding landscape. Every estate deserves to be understood on its own terms."],
        ["02", "The seasons", "Explore questions of water, access and the changing year. The everyday details matter as much as the first view."],
        ["03", "Stewardship", "Consider the time, people and care the land may need. Let a long-term perspective guide the conversation."],
      ].map(([number, title, copy]) => <article className={styles.fieldNote} key={number} data-chapter-rise><span className={styles.rule} data-chapter-rule /><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
      <p className={styles.driftWord} data-chapter-drift aria-hidden="true">Living landscape.</p>
    </section>
    <NextChapter href="/estates" eyebrow="CONTINUE THE JOURNEY / ESTATES" title="Room for your own story." line="Explore private retreats, estate plots and countryside homes." />
  </PageMotion>;
}
