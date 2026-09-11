import Image from "next/image";
import PageMotion from "@/components/pages/PageMotion";
import { ChapterHero, WordHeading, NextChapter, RouteButton } from "@/components/pages/PagePrimitives";
import ProjectMotion from "@/components/projects/ProjectMotion";
import type { EstateListing } from "@/data/estate-listings";
import styles from "@/components/pages/pages.module.css";
import projects from "@/components/projects/projects.module.css";
import estates from "./estates.module.css";

export default function EstateDetailPage({ estate }: { estate: EstateListing }) {
  const cover = estate.photos[0];
  const name = estate.name.split(" ");
  return <PageMotion className={styles.page} tone="estate">
    {cover ? <ChapterHero className={projects.farmHero} chapter="02" label={`Estates / ${estate.category}`} lines={[name.slice(0, -1).join(" "), name.at(-1)!]} description={estate.summary} image={cover.src} alt={cover.alt} anchor="estate-story" /> : <section className={estates.plainHero} aria-labelledby="estate-title"><p className={styles.eyebrow}>02 / ESTATES</p><h1 id="estate-title">{estate.name}</h1><p>{estate.summary}</p></section>}
    <section id="estate-story" className={styles.section} aria-labelledby="estate-story-heading">
      <div className={projects.collectionIntro}>
        <div><p className={styles.eyebrow}>{estate.category}</p><p className={estates.acreage}>{estate.areaLabel ?? "Acreage on enquiry"}</p>{estate.areaNote && <p className={estates.areaNote}>{estate.areaNote}</p>}</div>
        <div><WordHeading id="estate-story-heading">{estate.id === "madikeri-estate" ? "Rooted in a growing landscape." : "A place to look closer."}</WordHeading><div className={projects.introCopy}>{estate.description.map((text) => <p data-chapter-rise key={text}>{text}</p>)}</div></div>
      </div>
      <dl className={projects.factList}>
        <div className={projects.fact} data-chapter-rise><dt>Land area</dt><dd>{estate.areaLabel ?? "On enquiry"}</dd></div>
        <div className={projects.fact} data-chapter-rise><dt>Location</dt><dd>{estate.location ?? "Details on enquiry"}</dd></div>
        <div className={projects.fact} data-chapter-rise><dt>Availability</dt><dd>Enquire privately</dd></div>
      </dl>
    </section>
    {estate.photos.length > 1 && <section className={styles.section} aria-label={`${estate.name} photographs`}><ProjectMotion className={projects.gallery}>{estate.photos.slice(1).map((photo) => <figure key={photo.src}><div className={projects.galleryImage} data-project-frame><div className={projects.cardImage} data-project-image><Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 700px) 100vw, 50vw" /></div></div><figcaption>{photo.caption}</figcaption></figure>)}</ProjectMotion></section>}
    <section className={`${styles.section} ${styles.introGrid}`} aria-labelledby="estate-details-heading">
      <div><p className={styles.eyebrow}>A CLOSER LOOK</p><div className={styles.textAction}><WordHeading id="estate-details-heading">Let’s talk about the details.</WordHeading></div></div>
      <div>{estate.facts.length > 0 && <ul className={projects.featureList}>{estate.facts.map((fact) => <li key={fact.label} data-chapter-rise><span><strong>{fact.label}</strong><br />{fact.value}</span></li>)}</ul>}
        <p className={projects.sourceNote}>Discuss current site details, documentation and availability with us.</p>
        {!cover && <p className={estates.photoNote}>Enquire to discuss photographs and arrange a closer look.</p>}
        <div className={styles.textAction}><RouteButton href="/enquiry">Enquire about {estate.name}</RouteButton></div>
      </div>
    </section>
    <NextChapter href="/estates" eyebrow="RETURN TO ESTATES" title="More land. More possibilities." line="Continue through the Coorg estate collection." />
  </PageMotion>;
}
