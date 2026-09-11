import type { Metadata } from "next";
import PageMotion from "@/components/pages/PageMotion";
import DepthCard from "@/components/pages/DepthCard";
import { ChapterHero, WordHeading, LandscapeImage, RouteButton, NextChapter } from "@/components/pages/PagePrimitives";
import { coorgWorlds } from "@/data/worlds";
import styles from "@/components/pages/pages.module.css";

export const metadata: Metadata = {
  title: "Estates & Retreats | Land in Coorg",
  description: "Imagine a private hill retreat, a countryside home or space to build with intention. Explore the estate worlds of Land in Coorg.",
};

const estateWorlds = [coorgWorlds[1], coorgWorlds[2], coorgWorlds[4]];

export default function EstatesPage() {
  return <PageMotion className={styles.page} tone="estate">
    <ChapterHero chapter="03" label="Estates & Retreats" lines={["Room for your", "kind of life."]} description="A home among the trees. A place shaped around you. Discover three ways of imagining life in the hills." image="/images/coorg/conceptual/private-hill-retreats.webp" alt="Conceptual contemporary retreat with warm windows overlooking a forested valley" anchor="estate-perspectives" />
    <section id="estate-perspectives" className={styles.section} aria-labelledby="estate-heading">
      <div className={styles.estateIntro}><p className={styles.eyebrow}>THREE PERSPECTIVES / ONE SENSE OF PLACE</p><WordHeading id="estate-heading">Home begins with a feeling.</WordHeading><p className={styles.bodyCopy} data-chapter-rise>It might be the shelter of a veranda, a room opening onto trees, or the possibility of a home still to be imagined. Find the perspective that feels like yours.</p></div>
      <div className={styles.estateGrid}>{estateWorlds.map((world, index) => <DepthCard key={world.id} index={`0${index + 1}`} image={world.image} alt={world.imageAlt} title={world.title} line={world.line} href={`/opportunities/${world.id}`} />)}</div>
    </section>
    <section className={`${styles.section} ${styles.darkSection} ${styles.wideEditorial}`}>
      <div><p className={styles.eyebrow}>BEFORE THE FLOOR PLAN</p><WordHeading>Make room for what matters.</WordHeading><div className={styles.bodyCopy} data-chapter-rise><p>The way you arrive. The view from a favourite chair. The room to gather, and the room to be alone.</p><p>Start with how you want to live. The right questions about setting, access and everyday comforts follow from there.</p></div><div className={styles.textAction} data-chapter-rise><RouteButton href="/enquiry" light>Shape your personal brief</RouteButton></div></div>
      <LandscapeImage src="/images/coorg/conceptual/countryside-homes.webp" alt="Conceptual tiled-roof home and shaded veranda among green plants" caption="A thought about home" />
    </section>
    <NextChapter href="/about-coorg" eyebrow="CONTINUE THE JOURNEY / ABOUT COORG" title="A feeling called Coorg." line="Step back and see the landscape behind the possibilities." />
  </PageMotion>;
}
