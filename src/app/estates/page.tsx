import type { Metadata } from "next";
import PageMotion from "@/components/pages/PageMotion";
import { ChapterHero, WordHeading, NextChapter } from "@/components/pages/PagePrimitives";
import ProjectMotion from "@/components/projects/ProjectMotion";
import EstateCard from "@/components/estates/EstateCard";
import { estateListings } from "@/data/estate-listings";
import styles from "@/components/pages/pages.module.css";
import projects from "@/components/projects/projects.module.css";
import estates from "@/components/estates/estates.module.css";

export const metadata: Metadata = {
  title: "Estates · Land & Plantation Profiles | Land in Coorg",
  description: "Explore Coorg estate profiles, acreage and property photographs. Discover Madikeri Estate and the wider land collection.",
  alternates: { canonical: "/estates" },
};

export default function EstatesPage() {
  const featured = estateListings.slice(0, 2);
  const land = estateListings.slice(2);
  return <PageMotion className={styles.page} tone="estate">
    <ChapterHero className={projects.farmHero} chapter="02" label="Estates / Land in Coorg" lines={["A closer look", "at the land."]} description="Plantation landscapes, villa settings and room to grow. Explore the acreage and character of the Coorg collection." image="/images/coorg/estates-hero.webp" alt="High-altitude coffee and spice plantation estate hillside in Coorg with mountain ridges and mist" anchor="estate-collection" />
    <section id="estate-collection" className={styles.section} aria-labelledby="estate-heading">
      <div className={projects.collectionIntro}><p className={styles.eyebrow}>THE ESTATE COLLECTION</p><div><WordHeading id="estate-heading">Get to know the ground.</WordHeading><p className={projects.introCopy}>Acreage, landscape and the details that make each place its own. Begin with the photographs and explore each profile.</p></div></div>
      <ProjectMotion className={projects.projectList}>{featured.map((estate, index) => <EstateCard key={estate.id} estate={estate} index={index} />)}</ProjectMotion>
    </section>
    <section className={styles.section} aria-labelledby="acreage-heading">
      <div className={projects.collectionIntro}><p className={styles.eyebrow}>MORE ROOM TO EXPLORE</p><div><WordHeading id="acreage-heading">Land, in different measures.</WordHeading><p className={projects.introCopy}>Explore more of the collection. Property photographs and further site details can be discussed on enquiry.</p></div></div>
      <ProjectMotion className={estates.acreageGrid}>{land.map((estate, index) => <EstateCard key={estate.id} estate={estate} index={index + featured.length} compact />)}</ProjectMotion>
    </section>
    <NextChapter href="/gallery" eyebrow="CONTINUE TO THE GALLERY" title="See a little more." line="Wander through the plantation, the trees and the spaces in between." />
  </PageMotion>;
}
