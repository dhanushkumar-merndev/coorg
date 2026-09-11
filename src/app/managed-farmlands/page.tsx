import type { Metadata } from "next";
import PageMotion from "@/components/pages/PageMotion";
import { ChapterHero, WordHeading, NextChapter, ContourMark } from "@/components/pages/PagePrimitives";
import ProjectCard from "@/components/projects/ProjectCard";
import ProjectMotion from "@/components/projects/ProjectMotion";
import { ongoingProjects, completedProjects, managedFarmlandsPreview } from "@/data/projects";
import styles from "@/components/pages/pages.module.css";
import projects from "@/components/projects/projects.module.css";

export const metadata: Metadata = {
  title: "Managed Farmlands · Completed & Ongoing | Land in Coorg",
  description: "Discover completed and ongoing projects together, from the Coorg farmland collection to the wider Star Infra Developers portfolio.",
  alternates: { canonical: "/managed-farmlands" },
};

export default function ManagedFarmlandsPage() {
  return <PageMotion className={styles.page} tone="plantation">
    <ChapterHero className={projects.farmHero} chapter="01" label="Managed Farmlands" lines={["Rooted in the land.", "Growing with care."]} description="Explore the completed and ongoing collection. A longer view of land, and a place for every chapter." image="/images/coorg/conceptual/plantation-estates.webp" alt="Conceptual plantation landscape with a winding road between misty green hills" anchor="completed-projects">
      <div className={projects.heroPrice} data-chapter-intro><span>Starting from</span><strong>₹{managedFarmlandsPreview.price.amount.toLocaleString("en-IN")} <small>per sq ft</small></strong><p>Indicative starting price · project-specific pricing on enquiry</p></div>
      <nav className={projects.heroCollectionNav} aria-label="Project collections" data-chapter-intro><a href="#completed-projects">Completed <span>{String(completedProjects.length).padStart(2, "0")}</span> ↘</a><a href="#ongoing-projects">Ongoing <span>{String(ongoingProjects.length).padStart(2, "0")}</span> ↘</a></nav>
    </ChapterHero>
    <section id="completed-projects" className={`${styles.section} ${projects.collectionSection}`} aria-labelledby="completed-heading">
      <div className={projects.statusIntro}>
        <div><p className={styles.eyebrow}>MANAGED FARMLANDS / THE COORG COLLECTION</p><WordHeading id="completed-heading" treatment="ink">Completed</WordHeading></div>
        <p className={projects.introCopy}>Three places with a story of their own. Discover the completed Coorg collection, now sold out.</p>
      </div>
      <ProjectMotion className={projects.projectList}>{completedProjects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}</ProjectMotion>
      <div className={projects.collectionFoot}><a href="#ongoing-projects" className={projects.textLink}>Explore ongoing projects ↓</a></div>
    </section>
    <section id="ongoing-projects" className={`${styles.section} ${projects.collectionSection}`} aria-labelledby="ongoing-heading">
      <div className={projects.statusIntro}>
        <div><p className={styles.eyebrow}>MANAGED FARMLANDS / IN THE MAKING</p><WordHeading id="ongoing-heading" treatment="ink">Ongoing</WordHeading></div>
        <p className={projects.introCopy}>The next chapter is taking shape. Explore the developer’s ongoing portfolio, with each project’s location and character clearly set out.</p>
      </div>
      <ProjectMotion className={projects.projectList}>{ongoingProjects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}</ProjectMotion>
    </section>
    <section className={`${styles.section} ${styles.darkSection}`} aria-labelledby="land-care-heading">
      <ContourMark className={styles.contour} />
      <div className={styles.darkIntro}><p className={styles.eyebrow}>A THOUGHTFUL RELATIONSHIP WITH LAND</p><WordHeading id="land-care-heading">Care begins with understanding.</WordHeading></div>
      <div className={styles.fieldNotes}>{[
        ["01", "The ground beneath", "Start with the land itself. Its terrain, planting and access are the first things to understand."],
        ["02", "The rhythm of a place", "Think through the seasons, the water and the everyday attention a living landscape needs."],
        ["03", "A shared intention", "Bring your questions about ownership and stewardship. Build the brief around the care you want to give."],
      ].map(([number, title, text]) => <article key={number} className={styles.fieldNote} data-chapter-rise><span className={styles.rule} data-chapter-rule /><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
    </section>
    <NextChapter href="/estates" eyebrow="EXPLORE ESTATES" title="A closer look at the land." line="Discover Coorg estate profiles, acreage and photographs from the collection." />
  </PageMotion>;
}
