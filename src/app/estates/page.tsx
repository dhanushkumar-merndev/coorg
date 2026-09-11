import type { Metadata } from "next";
import PageMotion from "@/components/pages/PageMotion";
import { ChapterHero, WordHeading, NextChapter } from "@/components/pages/PagePrimitives";
import ProjectCard from "@/components/projects/ProjectCard";
import ProjectMotion from "@/components/projects/ProjectMotion";
import { estateProjects, STAR_INFRA_SOURCE } from "@/data/projects";
import TransitionLink from "@/components/navigation/TransitionLink";
import styles from "@/components/pages/pages.module.css";
import projects from "@/components/projects/projects.module.css";

export const metadata: Metadata = {
  title: "Estates · Completed Projects | Land in Coorg",
  description: "Explore Star Woods Estate, Star Coffee County and Star Misty Acres, completed Coorg projects from the Star Infra Developers portfolio.",
};

export default function EstatesPage() {
  const cover = estateProjects[0].images[0];
  return <PageMotion className={styles.page} tone="estate">
    <ChapterHero chapter="02" label="Estates / Completed projects" lines={["Places with roots.", "Stories that stay."]} description="Three completed estates. Three expressions of life in the hills. Explore the Coorg collection from Star Infra Developers." image={cover.src} alt={cover.alt} anchor="completed-projects" disclosure="Illustrative marketing imagery · Star Infra Developers" />
    <section id="completed-projects" className={styles.section} aria-labelledby="estate-heading">
      <div className={projects.collectionIntro}>
        <div><p className={styles.eyebrow}>THE COMPLETED COLLECTION / 03 ESTATES</p><div className={projects.collectionNav}><TransitionLink href="/estates" aria-current="page">Completed projects</TransitionLink><TransitionLink href="/farm-management">Ongoing projects ↗</TransitionLink></div></div>
        <div><WordHeading id="estate-heading" treatment="ink">A landscape to belong to.</WordHeading><p className={projects.introCopy} data-chapter-rise>From farmland communities to weekend retreats, each place begins with a different relationship to the land.</p></div>
      </div>
      <ProjectMotion className={projects.projectList}>{estateProjects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}</ProjectMotion>
      <div className={projects.collectionFoot}><p className={projects.sourceNote}>Project details and completed status from <a href={STAR_INFRA_SOURCE} target="_blank" rel="noreferrer">Star Infra Developers</a>. Images are illustrative marketing material. The completed collection is sold out.</p><TransitionLink href="/enquiry" className={projects.textLink}>Find your own kind of place ↗</TransitionLink></div>
    </section>
    <NextChapter href="/farm-management" eyebrow="THE NEXT CHAPTER / FARM MANAGEMENT" title="A story still growing." line="Explore ongoing projects and a more considered relationship with land." />
  </PageMotion>;
}
