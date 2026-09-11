import type { Metadata } from "next";
import Image from "next/image";
import PageMotion from "@/components/pages/PageMotion";
import { ChapterHero, WordHeading, NextChapter } from "@/components/pages/PagePrimitives";
import { TerrainStudy } from "@/components/sections/TerrainStudy";
import styles from "@/components/pages/pages.module.css";

export const metadata: Metadata = {
  title: "About Coorg | Land in Coorg",
  description: "An invitation to slow down and explore Coorg through landscape, light and the idea of belonging. Discover an interactive conceptual terrain study.",
};

export default function AboutCoorgPage() {
  return <PageMotion className={styles.page} tone="landscape">
    <ChapterHero chapter="04" label="About Coorg" lines={["A feeling.", "A place. Coorg."]} description="Some places stay with you long after you leave. A little of the quiet. A different way of seeing." image="/images/coorg/conceptual/forest-mountain-land.webp" alt="Conceptual forest-edge landscape opening onto layers of misty mountain ridges" anchor="sense-of-place" variant="center" />
    <section id="sense-of-place" className={styles.section}><p className={styles.eyebrow}>A SENSE OF PLACE</p><div className={styles.aboutLead}><WordHeading>Less about getting away. More about coming closer.</WordHeading><div className={styles.bodyCopy} data-chapter-rise><p>Closer to the shape of the land. To the changing light. To the small rituals that turn a place into somewhere you want to return.</p><p>Our view of Coorg begins there: with a landscape to understand, and a life you can imagine within it.</p></div></div></section>
    <section className={styles.panorama} aria-labelledby="landscape-pause"><div className={styles.landscapeImage} data-chapter-image><Image src="/images/coorg/conceptual/hero-mist-valley.webp" alt="Conceptual dawn light and low mist across a green mountain valley" fill sizes="100vw" className={styles.coverImage} /></div><div className={styles.panoramaShade} aria-hidden="true" /><div className={styles.panoramaText}><WordHeading id="landscape-pause">Let the landscape set the pace.</WordHeading></div></section>
    <section className={styles.section} aria-labelledby="terrain-heading"><p className={styles.eyebrow}>READING THE LANDSCAPE</p><div className={styles.terrainIntro}><WordHeading id="terrain-heading">A change in perspective.</WordHeading><p className={styles.bodyCopy} data-chapter-rise>Follow a contour. Turn a ridge towards the light. This interactive study explores the form of a landscape, as an invitation to look a little closer.</p></div><div data-chapter-rise><TerrainStudy /></div><p className={styles.smallNote}>An artistic terrain study, independent of any specific property or survey.</p></section>
    <NextChapter href="/opportunities" eyebrow="FIND YOUR PLACE / OPPORTUNITIES" title="Where could you belong?" line="Explore five different ways of imagining your life in Coorg." />
  </PageMotion>;
}
