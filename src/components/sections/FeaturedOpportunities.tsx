import PageMotion from "@/components/pages/PageMotion";
import { WordHeading } from "@/components/pages/PagePrimitives";
import ProjectCard from "@/components/projects/ProjectCard";
import ProjectMotion from "@/components/projects/ProjectMotion";
import { estateProjects } from "@/data/projects";
import TransitionLink from "../navigation/TransitionLink";
import styles from "./sections.module.css";
import projects from "@/components/projects/projects.module.css";

export function FeaturedOpportunities() {
  return <section id="featured" className={styles.featuredSection} aria-labelledby="featured-heading">
    <PageMotion tone="estate">
      <div className={projects.collectionIntro}>
        <div><p className={styles.eyebrow}>03 / THE ESTATE COLLECTION</p><div className={projects.collectionNav}><TransitionLink href="/estates">Completed estates ↗</TransitionLink><TransitionLink href="/farm-management">Ongoing projects ↗</TransitionLink></div></div>
        <div><WordHeading id="featured-heading" treatment="ink">Real places. A lasting sense of belonging.</WordHeading><p className={projects.introCopy} data-chapter-rise>Explore three completed Coorg estates from the Star Infra Developers portfolio. Find the setting that speaks to you.</p></div>
      </div>
      <ProjectMotion className={projects.compactGrid}>{estateProjects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} compact />)}</ProjectMotion>
      <div className={projects.farmBand} data-chapter-rise>
        <div><span className={styles.eyebrow}>FARM MANAGEMENT / ONGOING PROJECTS</span><h3>A story still growing.</h3><p>Take a closer look at what is underway, and the possibilities ahead.</p></div>
        <div className={projects.priceSide}><span>The next chapter</span><TransitionLink href="/farm-management" className={projects.textLink}>Explore ongoing projects ↗</TransitionLink><p className={projects.sourceNote}>Discover the collection and indicative starting price.</p></div>
      </div>
    </PageMotion>
  </section>;
}
