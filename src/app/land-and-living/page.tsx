import type { Metadata } from "next";
import PageMotion from "@/components/pages/PageMotion";
import { ChapterHero, WordHeading, LandscapeImage, RouteButton, NextChapter, ContourMark } from "@/components/pages/PagePrimitives";
import styles from "@/components/pages/pages.module.css";

export const metadata: Metadata = {
  title: "Land & Living | Land in Coorg",
  description: "An editorial perspective on life with the land in Coorg: thoughtful stewardship, changing seasons and space for a different everyday.",
};

const fieldNotes = [
  ["01", "The landscape", "Begin with the terrain, the tree line and the way a place feels underfoot. Think about what belongs here before imagining what comes next."],
  ["02", "The everyday", "Consider the road in, the changing seasons and the time you want to spend here. A thoughtful choice begins with the details of daily life."],
  ["03", "The long view", "Working land asks for attention. Explore the care, people and practical arrangements it may need, with a perspective that reaches beyond the first visit."],
] as const;

export default function LandAndLivingPage() {
  return (
    <PageMotion className={styles.page} tone="plantation">
      <ChapterHero
        chapter="03"
        label="Land & Living"
        lines={["A little more land.", "A different everyday."]}
        description="A road through the trees. Space for a slower morning. A relationship with the land that grows over time."
        image="/images/coorg/conceptual/plantation-estates.webp"
        alt="Conceptual plantation road winding between lush hills in the morning mist"
        anchor="life-with-the-land"
      />

      <section id="life-with-the-land" className={`${styles.section} ${styles.plantationGrid}`}>
        <LandscapeImage
          src="/images/coorg/conceptual/plantation-estates.webp"
          alt="Conceptual tree-lined plantation landscape with a winding path"
          caption="01 / A living landscape"
        />
        <div className={styles.plantationCopy}>
          <p className={styles.eyebrow}>A DIFFERENT KIND OF EVERYDAY</p>
          <WordHeading treatment="ink">Some places change the way you spend your days.</WordHeading>
          <div className={styles.bodyCopy} data-chapter-rise>
            <p>Imagine knowing a place by the walk through it. The curve in the road, the light between the trees, the familiar view from the veranda.</p>
            <p>From a working plantation to a quiet countryside retreat, the search begins with the life you want to make room for and the care the land calls for.</p>
          </div>
          <div className={styles.textAction} data-chapter-rise>
            <RouteButton href="/farm-management">Explore farm management</RouteButton>
          </div>
          <LandscapeImage
            className={styles.plantationDetail}
            src="/images/coorg/conceptual/countryside-homes.webp"
            alt="Conceptual shaded countryside veranda beside a garden"
            caption="Space to pause"
          />
        </div>
      </section>

      <section className={`${styles.section} ${styles.darkSection}`} aria-labelledby="living-considerations">
        <ContourMark className={styles.contour} />
        <div className={styles.darkIntro}>
          <p className={styles.eyebrow}>BEYOND THE FIRST IMPRESSION</p>
          <WordHeading id="living-considerations" treatment="ink">Look closer. Make room for what matters.</WordHeading>
        </div>
        <div className={styles.fieldNotes}>
          {fieldNotes.map(([number, title, copy]) => (
            <article className={styles.fieldNote} key={number} data-chapter-rise>
              <span className={styles.rule} data-chapter-rule />
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
        <p className={styles.driftWord} data-chapter-drift aria-hidden="true">Room to belong.</p>
      </section>

      <NextChapter
        href="/about-coorg"
        eyebrow="CONTINUE THE JOURNEY / ABOUT COORG"
        title="Get to know the landscape."
        line="Explore the hills, seasons and sense of place behind life in Coorg."
      />
    </PageMotion>
  );
}
