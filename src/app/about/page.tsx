import type { Metadata } from "next";
import Image from "next/image";
import PageMotion from "@/components/pages/PageMotion";
import { ChapterHero, WordHeading, NextChapter } from "@/components/pages/PagePrimitives";
import { siteName, siteTagline } from "@/lib/site";
import { FarmhouseInspiration } from "@/components/sections/FarmhouseInspiration";
import styles from "@/components/pages/pages.module.css";

export const metadata: Metadata = {
  title: `About Us | ${siteName}`,
  description: "Get to know Star Managed Farmlands: our purpose, our values and a thoughtful approach to land and farm living.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return <PageMotion className={styles.page} tone="landscape">
    <ChapterHero chapter="04" label="About Us" lines={["Rooted in nature.", "Grown with care."]} description="We believe a connection with the land begins with understanding it. Welcome to Star Managed Farmlands." image="/images/coorg/conceptual/forest-mountain-land.webp" alt="Conceptual forest landscape and misty mountain ridges" anchor="our-purpose" variant="center" disclosure="Conceptual landscape" />
    <section id="our-purpose" className={styles.section}>
      <p className={styles.eyebrow}>OUR PURPOSE</p>
      <div className={styles.aboutLead}>
        <WordHeading>A closer connection to the land.</WordHeading>
        <div className={styles.bodyCopy} data-chapter-rise><p>Star Managed Farmlands brings together an interest in farm living and a respect for the landscapes that make it possible. Our aim is to help you explore what a place in nature could mean for you.</p><p>Every conversation begins with your priorities: space to grow, time outdoors, or a quieter rhythm. We believe the next step should feel considered, personal and clear.</p></div>
      </div>
    </section>
    <section className={styles.panorama} aria-labelledby="our-belief">
      <div className={styles.landscapeImage} data-chapter-image><Image src="/images/coorg/conceptual/hero-mist-valley.webp" alt="Conceptual dawn light across a green mountain valley" fill sizes="100vw" className={styles.coverImage} /></div>
      <div className={styles.panoramaShade} aria-hidden="true" />
      <div className={styles.panoramaText}><WordHeading id="our-belief">{siteTagline}</WordHeading></div>
    </section>
    <section className={styles.section} aria-labelledby="our-approach">
      <p className={styles.eyebrow}>WHAT GUIDES US</p>
      <div className={styles.aboutLead}>
        <WordHeading id="our-approach">Thoughtful choices. Open conversations.</WordHeading>
        <div className={styles.bodyCopy} data-chapter-rise><p><strong>Nature comes first.</strong> The character of the land matters: its setting, its seasons and the care it needs.</p><p><strong>Your purpose shapes the conversation.</strong> Understanding what you want from farm living is the starting point for exploring the options.</p><p><strong>Clarity at every step.</strong> Project details, management arrangements and availability deserve a clear conversation before you make a decision.</p></div>
      </div>
    </section>
    <FarmhouseInspiration />
    <NextChapter href="/enquiry" eyebrow="LET’S TALK" title="What would you like to grow?" line="Tell us what you have in mind. Let’s start with a conversation." />
  </PageMotion>;
}
