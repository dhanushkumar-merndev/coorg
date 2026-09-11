import Image from "next/image";
import PageMotion from "@/components/pages/PageMotion";
import { ChapterHero, WordHeading, NextChapter, RouteButton } from "@/components/pages/PagePrimitives";
import ProjectMotion from "./ProjectMotion";
import { ProjectStatus } from "./ProjectCard";
import type { EstateProject } from "@/data/projects";
import styles from "@/components/pages/pages.module.css";
import projects from "./projects.module.css";

export default function ProjectDetailPage({ project }: { project: EstateProject }) {
  const ongoing = project.status === "ongoing";
  const cover = project.images[0];
  const words = project.name.split(" ");
  const lines = [words.slice(0, -1).join(" "), words.at(-1)!];
  return <PageMotion className={styles.page} tone={ongoing ? "plantation" : "estate"}>
    <ChapterHero chapter={ongoing ? "01" : "02"} label={`Managed Farmlands / ${ongoing ? "Ongoing" : "Completed"}`} lines={lines} description={project.summary} image={cover.src} alt={cover.alt} anchor="project-story" />
    <section id="project-story" className={styles.section} aria-labelledby="project-heading">
      <div className={projects.collectionIntro}>
        <div><p className={styles.eyebrow}>{project.category}</p><div className={styles.textAction}><ProjectStatus project={project} /></div></div>
        <div><WordHeading id="project-heading" treatment="ink">{project.summary}</WordHeading><div className={projects.introCopy} data-chapter-rise>{project.description.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></div>
      </div>
      <dl className={projects.factList}>
        <div className={projects.fact} data-chapter-rise><dt>Location</dt><dd>{project.location ?? "On enquiry"}</dd></div>
        <div className={projects.fact} data-chapter-rise><dt>Project status</dt><dd>{ongoing ? "Ongoing" : "Completed"}</dd></div>
        <div className={projects.fact} data-chapter-rise><dt>Current availability</dt><dd>{project.availability === "sold-out" ? "Sold out" : project.availability === "available" ? "Available" : "On enquiry"}</dd></div>
      </dl>
    </section>
    {project.highlights && <section className={`${styles.section} ${projects.detailsSection}`} aria-labelledby="project-highlights-heading">
      <p className={styles.eyebrow}>THE ESTATE AT A GLANCE</p>
      <WordHeading id="project-highlights-heading">Project Highlights</WordHeading>
      <dl className={`${projects.factList} ${projects.highlightsGrid}`}>{project.highlights.map((fact) => <div key={fact.label} className={projects.fact} data-chapter-rise><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>
      {project.facilities && <ul className={projects.featureList}>{project.facilities.map((facility) => <li key={facility} data-chapter-rise>{facility}</li>)}</ul>}
    </section>}
    {project.images.length > 1 && <section className={styles.section} aria-label={`${project.name} gallery`}>
      <ProjectMotion className={projects.gallery}>{project.images.slice(1).map((image, index) => <figure key={image.src}>
        <div className={projects.galleryImage} data-project-frame><div className={projects.cardImage} data-project-image><Image src={image.src} alt={image.alt} fill sizes="(max-width: 700px) 100vw, 50vw" /></div></div>
        <figcaption>0{index + 2} / {project.name}</figcaption>
      </figure>)}</ProjectMotion>
    </section>}
    <section className={`${styles.section} ${styles.introGrid}`} aria-labelledby="project-details-heading">
      <div><p className={styles.eyebrow}>A CLOSER LOOK</p><div className={styles.textAction}><WordHeading id="project-details-heading">{project.featuresHeading ?? "Details that shape the place."}</WordHeading></div></div>
      <div><ul className={projects.featureList}>{project.features.map((feature) => <li key={feature} data-chapter-rise>{feature}</li>)}</ul>{!project.investment && <div className={styles.textAction}><RouteButton href="/enquiry">Enquire about {project.name}</RouteButton></div>}</div>
    </section>
    {project.nearbyPlaces && <section className={`${styles.section} ${styles.introGrid} ${projects.detailsSection}`} aria-labelledby="project-location-heading">
      <div><p className={styles.eyebrow}>CONNECTED TO THE EVERYDAY</p><div className={styles.textAction}><WordHeading id="project-location-heading">Strategic Location</WordHeading></div></div>
      <dl className={projects.locationList}>{project.nearbyPlaces.map((place) => <div key={place.label} data-chapter-rise><dt>{place.label}</dt><dd>{place.value}</dd></div>)}</dl>
    </section>}
    {project.investment && <section className={`${styles.section} ${projects.investmentSection}`} aria-labelledby="project-investment-heading">
      <div className={projects.collectionIntro}>
        <div><p className={styles.eyebrow}>A LONGER VIEW</p><div className={styles.textAction}><WordHeading id="project-investment-heading">Investment Potential</WordHeading></div></div>
        <div className={projects.investmentCopy}>
          <p data-chapter-rise>{project.investment.coffeeIncomeProjection}</p>
          <p data-chapter-rise>{project.investment.villaProposal}</p>
          <dl className={`${projects.factList} ${projects.investmentFacts}`}>{project.investment.structure.map((fact) => <div key={fact.label} className={projects.fact} data-chapter-rise><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>
          <p className={projects.roiProjection} data-chapter-rise>{project.investment.roiProjection}</p>
          <p className={projects.projectionDisclaimer}>{project.investment.disclaimer}</p>
          <div className={styles.textAction}><RouteButton href="/enquiry">Enquire about {project.name}</RouteButton></div>
        </div>
      </div>
    </section>}
    <NextChapter href={`/managed-farmlands#${ongoing ? "ongoing" : "completed"}-projects`} eyebrow="RETURN TO MANAGED FARMLANDS" title={ongoing ? "Keep growing." : "More places. More stories."} line={ongoing ? "Explore the ongoing collection." : "Return to the completed Coorg estate collection."} />
  </PageMotion>;
}
