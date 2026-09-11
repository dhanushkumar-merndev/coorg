import PageMotion from "@/components/pages/PageMotion";
import { WordHeading } from "@/components/pages/PagePrimitives";
import ProjectCard from "@/components/projects/ProjectCard";
import ProjectMotion from "@/components/projects/ProjectMotion";
import { completedProjects } from "@/data/projects";
import TransitionLink from "../navigation/TransitionLink";
import styles from "./sections.module.css";
import projects from "@/components/projects/projects.module.css";

export function FeaturedOpportunities() {
  return <section id="featured" className={styles.featuredSection} aria-labelledby="featured-heading">
    <PageMotion tone="estate">
      <div className={projects.collectionIntro}>
        <div><p className={styles.eyebrow}>03 / MANAGED FARMLANDS</p><div className={projects.collectionNav}><TransitionLink href="/managed-farmlands#completed-projects">Completed projects ↗</TransitionLink><TransitionLink href="/managed-farmlands#ongoing-projects">Ongoing projects ↗</TransitionLink></div></div>
        <div><WordHeading id="featured-heading" treatment="ink">Real places. A lasting sense of belonging.</WordHeading><p className={projects.introCopy} data-chapter-rise>Explore three completed Coorg estates. Find the setting that speaks to you.</p></div>
      </div>
      <ProjectMotion className={projects.compactGrid}>{completedProjects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} compact />)}</ProjectMotion>
      <div className={projects.farmBand} data-chapter-rise>
        <div><span className={styles.eyebrow}>MANAGED FARMLANDS / ONGOING PROJECTS</span><h3>A story still growing.</h3><p>Take a closer look at what is underway, and the possibilities ahead.</p></div>
        <div className={projects.priceSide}><span>The next chapter</span><TransitionLink href="/managed-farmlands#ongoing-projects" className={projects.textLink}>Explore ongoing projects ↗</TransitionLink><p className={projects.sourceNote}>Discover the collection and indicative starting price.</p></div>
      </div>
    </PageMotion>
  </section>;
}
