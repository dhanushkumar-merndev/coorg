import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DepthCard from "@/components/pages/DepthCard";
import PageMotion from "@/components/pages/PageMotion";
import {
  ChapterHero,
  ContourMark,
  LandscapeImage,
  NextChapter,
  RouteButton,
  WordHeading,
} from "@/components/pages/PagePrimitives";
import styles from "@/components/pages/pages.module.css";
import { coorgWorlds } from "@/data/worlds";

type WorldPageProps = { params: Promise<{ slug: string }> };
type WorldStory = {
  lines: string[];
  note: string;
  questions: readonly [string, string, string];
  companionId: string;
  variant: "left" | "center" | "wide";
};

const stories: Record<string, WorldStory> = {
  "plantation-estates": {
    lines: ["Plantation", "Estates"],
    note: "A place to return to. A landscape to understand.",
    questions: [
      "What draws you to a working landscape? Consider the planting, the terrain and the relationship you would like to build with the land.",
      "Think about the practical questions behind the view: water, the approach road and how a place changes through the year.",
      "Imagine the time and attention you want to give an estate. Let that shape the search from the beginning.",
    ],
    companionId: "countryside-homes",
    variant: "left",
  },
  "private-hill-retreats": {
    lines: ["Private Hill", "Retreats"],
    note: "Make space for the moments that matter.",
    questions: [
      "Picture the surroundings that make you feel at ease. A sheltered garden, an open horizon or the quiet presence of trees.",
      "Consider the journey as well as the destination. How would a retreat fit into your everyday life and the time you spend away?",
      "Begin with how you want to live here: time alone, room for family or unhurried weekends with friends.",
    ],
    companionId: "forest-mountain-land",
    variant: "center",
  },
  "curated-estate-plots": {
    lines: ["Curated", "Estate Plots"],
    note: "The first drawing is a way of seeing.",
    questions: [
      "Look at how the ground meets the horizon. Think about light, slope and the trees that could guide your idea of a home.",
      "Keep access, services and the details of each opportunity part of the conversation. These need to be understood individually.",
      "Describe the feeling before the floor plan. What would you make space for, and what would you want to leave as it is?",
    ],
    companionId: "private-hill-retreats",
    variant: "left",
  },
  "forest-mountain-land": {
    lines: ["Forest &", "Mountain Land"],
    note: "Follow the horizon. Notice what is close.",
    questions: [
      "Share the kind of landscape that stays with you: a ridge, a tree line or a view that changes with the light.",
      "Look beyond the photograph. The approach, boundaries and character of the surrounding land all deserve a closer conversation.",
      "Think about what it means to care for a place over time. Let the landscape help shape your intentions.",
    ],
    companionId: "plantation-estates",
    variant: "wide",
  },
  "countryside-homes": {
    lines: ["Countryside", "Homes"],
    note: "A little more room for the everyday.",
    questions: [
      "Start with the details that feel like home. A shaded veranda, a garden path or somewhere to sit and watch the rain.",
      "Imagine an ordinary day here. Think about the spaces, access and practical details that would make life feel comfortable.",
      "Consider how your time would unfold: quiet mornings, shared meals or a corner of the garden to make your own.",
    ],
    companionId: "plantation-estates",
    variant: "center",
  },
};

function findWorld(slug: string) {
  const world = coorgWorlds.find((item) => item.id === slug);
  if (!world || !stories[slug]) notFound();
  return world;
}

export function generateStaticParams() {
  return coorgWorlds.map((world) => ({ slug: world.id }));
}

export async function generateMetadata({ params }: WorldPageProps): Promise<Metadata> {
  const { slug } = await params;
  const world = findWorld(slug);
  return {
    title: `${world.title} | Land in Coorg`,
    description: `Explore ${world.title.toLowerCase()} as an editorial perspective on life in Coorg. ${world.line} Conceptual imagery, with individual opportunities discussed separately.`,
    alternates: { canonical: `/opportunities/${world.id}` },
  };
}

export default async function WorldPage({ params }: WorldPageProps) {
  const { slug } = await params;
  const world = findWorld(slug);
  const story = stories[slug];
  const index = coorgWorlds.findIndex((item) => item.id === world.id);
  const companion = coorgWorlds.find((item) => item.id === story.companionId)!;
  const related = [coorgWorlds[(index + 1) % coorgWorlds.length], coorgWorlds[(index + 2) % coorgWorlds.length]];

  return (
    <PageMotion className={styles.page} tone={world.id === "plantation-estates" ? "plantation" : world.id === "forest-mountain-land" ? "landscape" : world.id === "countryside-homes" ? "quiet" : "estate"}>
      <ChapterHero
        chapter={String(index + 1).padStart(2, "0")}
        label="A Coorg world"
        lines={story.lines}
        description={world.line}
        image={world.image}
        alt={world.imageAlt}
        variant={story.variant}
        anchor="world-story"
      />

      <section id="world-story" className={`${styles.section} ${styles.introGrid}`}>
        <p className={styles.eyebrow}>YOUR OWN KIND OF BELONGING</p>
        <div>
          <WordHeading>{world.introduction}</WordHeading>
          <div className={`${styles.bodyCopy} ${styles.introText}`} data-chapter-rise>
            <p>{world.description}</p>
          </div>
          <div className={styles.textAction} data-chapter-rise>
            <RouteButton href="/enquiry">Begin with your idea</RouteButton>
          </div>
          <p className={styles.smallNote}>An editorial category. The imagery imagines a way of living; it does not depict an available property.</p>
        </div>
      </section>

      <section className={`${styles.section} ${styles.darkSection}`} aria-labelledby="world-considerations">
        <ContourMark className={styles.contour} />
        <div className={styles.darkIntro}>
          <p className={styles.eyebrow}>A CONVERSATION AROUND</p>
          <WordHeading id="world-considerations">Start with what matters to you.</WordHeading>
        </div>
        <div className={styles.fieldNotes}>
          {world.considerations.map((consideration, noteIndex) => (
            <article className={styles.fieldNote} key={consideration} data-chapter-rise>
              <span className={styles.rule} data-chapter-rule />
              <span>{String(noteIndex + 1).padStart(2, "0")}</span>
              <h3>{consideration}</h3>
              <p>{story.questions[noteIndex]}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={`${styles.section} ${styles.wideEditorial}`}>
        <div>
          <p className={styles.eyebrow}>BEYOND THE FIRST VIEW</p>
          <WordHeading>{story.note}</WordHeading>
          <div className={styles.bodyCopy} data-chapter-rise>
            <p>A sense of place is personal. Let the atmosphere be a starting point, then describe the details you would like your search to consider.</p>
          </div>
          <div className={styles.textAction} data-chapter-rise>
            <RouteButton href="/enquiry">Describe your ideal setting</RouteButton>
          </div>
        </div>
        <LandscapeImage src={companion.image} alt={companion.imageAlt} caption="An imagined moment in the hills" />
      </section>

      <section className={styles.section} aria-labelledby="related-worlds">
        <div className={styles.estateIntro}>
          <p className={styles.eyebrow}>ANOTHER WAY TO SEE COORG</p>
          <WordHeading id="related-worlds">Keep a little room for possibility.</WordHeading>
        </div>
        <div className={styles.estateGrid}>
          {related.map((item) => (
            <DepthCard
              key={item.id}
              image={item.image}
              alt={item.imageAlt}
              title={item.title}
              line={item.line}
              href={`/opportunities/${item.id}`}
              index={String(coorgWorlds.indexOf(item) + 1).padStart(2, "0")}
            />
          ))}
        </div>
      </section>

      <NextChapter href="/enquiry" eyebrow="YOUR NEXT CHAPTER" title="It begins with a thought." line="Tell us the kind of place you have in mind. Prepare your own search brief." />
    </PageMotion>
  );
}
