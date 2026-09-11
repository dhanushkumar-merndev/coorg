import type { Metadata } from "next";
import Image from "next/image";
import PageMotion from "@/components/pages/PageMotion";
import { ChapterHero, WordHeading, NextChapter } from "@/components/pages/PagePrimitives";
import ProjectMotion from "@/components/projects/ProjectMotion";
import styles from "@/components/pages/pages.module.css";
import projects from "@/components/projects/projects.module.css";
import gallery from "./gallery.module.css";

export const metadata: Metadata = {
  title: "Gallery · A Glimpse of Coorg | Land in Coorg",
  description: "Explore supplied photographs of Coorg’s green roads, plantation life and villa surroundings in the Land in Coorg gallery.",
  alternates: { canonical: "/gallery" },
};
const collections = [
  { id: "landscape", title: "Through the trees.", label: "01 / COORG LANDSCAPES", note: "Scenes from the supplied Coorg collection. Landscape photographs are atmospheric and are not assigned to an individual estate.", photos: [
    ["generic/forest-curve", "The road unfolds", "A pale road curving through tall trees and dense green undergrowth"],
    ["generic/waterfall", "After the rain", "A waterfall among rocks and green foliage in the supplied Coorg photo collection"],
    ["generic/forest-road", "A quieter way in", "A narrow road passing through a green wooded landscape"],
    ["generic/pond-road", "Water and green", "A landscaped pond and curved road in the supplied landscape photo collection"],
    ["generic/forest-dense", "Into the shade", "An internal road beneath dense trees and plantation greenery"],
  ] },
  { id: "plantation", title: "Rooted in the soil.", label: "02 / SLN PLANTATIONS", note: "Plantation and fruit photographs from the original SLN Plantations brochure.", photos: [
    ["sln/plantation", "The growing landscape", "Green sloping plantation with tall trees at SLN Plantations"],
    ["sln/lychee", "From the farm", "Lychee fruit pictured in the SLN Plantations brochure"],
    ["sln/avocado-a", "A different shade of green", "Avocado fruit from the SLN Plantations brochure"],
  ] },
  { id: "villa", title: "Time to slow down.", label: "03 / VILLA SURROUNDINGS", note: "The supplied Kodagu villa photo collection. Association with a particular sale listing remains unconfirmed.", photos: [
    ["villa/pool-cluster", "By the water", "Swimming pool beside a two-storey villa and trees"],
    ["villa/pool-vertical", "A poolside afternoon", "A vertical view of the pool and wooded villa surroundings"],
    ["villa/driveway", "The arrival", "Paved driveway and buildings in the supplied villa collection"],
    ["villa/side-path", "Spaces in between", "A side path beside the villa buildings"],
  ] },
];

export default function GalleryPage() {
  return <PageMotion className={styles.page} tone="estate">
    <ChapterHero className={projects.farmHero} chapter="03" label="The Gallery" lines={["A little closer.", "A little quieter."]} description="Follow the roads, the green and the everyday details. A photographic wander through the supplied Coorg collection." image="/images/coorg/supplied/generic/forest-road.webp" alt="A road leading through a green wooded Coorg landscape" anchor="gallery-collection" disclosure="Supplied Coorg photograph · atmospheric landscape" />
    <div id="gallery-collection" className={gallery.collectionNav}><nav aria-label="Gallery collections"><a href="#landscape">Landscapes ↘</a><a href="#plantation">Plantation life ↘</a><a href="#villa">Villa surroundings ↘</a></nav><span>12 photographs / 3 perspectives</span></div>
    {collections.map((collection) => <section id={collection.id} className={`${styles.section} ${gallery.collection}`} key={collection.id} aria-labelledby={`${collection.id}-heading`}>
      <div className={projects.collectionIntro}><p className={styles.eyebrow}>{collection.label}</p><div><WordHeading id={`${collection.id}-heading`}>{collection.title}</WordHeading><p className={projects.introCopy}>{collection.note}</p></div></div>
      <ProjectMotion className={gallery.grid}>{collection.photos.map(([file, caption, alt], index) => <figure className={gallery.figure} key={file}>
        <a className={gallery.photo} href={`/images/coorg/supplied/${file}.webp`} target="_blank" rel="noreferrer" aria-label={`View photograph: ${caption} (opens in a new tab)`} data-project-frame><div className={projects.cardImage} data-project-image><Image src={`/images/coorg/supplied/${file}.webp`} alt={alt} fill sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 65vw" /></div><span className={gallery.open} aria-hidden="true">↗</span></a>
        <figcaption><span>{String(index + 1).padStart(2, "0")}</span>{caption}</figcaption>
      </figure>)}</ProjectMotion>
    </section>)}
    <NextChapter href="/estates" eyebrow="GET TO KNOW THE ESTATES" title="Find your own kind of place." line="Explore the acreage and stories behind the supplied estate collection." />
  </PageMotion>;
}
