import PageMotion from "@/components/pages/PageMotion";
import { WordHeading } from "@/components/pages/PagePrimitives";
import ProjectCard from "@/components/projects/ProjectCard";
import ProjectMotion from "@/components/projects/ProjectMotion";
import { ongoingProjects } from "@/data/projects";
import TransitionLink from "../navigation/TransitionLink";
import styles from "./sections.module.css";
import projects from "@/components/projects/projects.module.css";

export function FeaturedOpportunities() {
  return <section id="featured" className={styles.featuredSection} aria-labelledby="featured-heading">
    <PageMotion tone="estate">
      <div className={projects.collectionIntro}>
        <div><p className={styles.eyebrow}>03 / MANAGED FARMLANDS</p><div className={projects.collectionNav}><TransitionLink href="/managed-farmlands#ongoing-projects">Ongoing projects ↗</TransitionLink></div></div>
        <div><WordHeading id="featured-heading" treatment="ink">Land with a longer view.</WordHeading><p className={projects.introCopy} data-chapter-rise>Explore the current managed farmland collection in Coorg.</p></div>
      </div>
      <ProjectMotion className={projects.compactGrid}>{ongoingProjects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} compact />)}</ProjectMotion>
      <div className={projects.farmBand} data-chapter-rise>
        <div><span className={styles.eyebrow}>MANAGED FARMLANDS / ONGOING PROJECTS</span><h3>Star Garden</h3><p>Premium coffee estate plots at Madikeri. Explore a 10-acre development with 33 exclusive plots.</p></div>
        <div className={projects.priceSide}><span>The next chapter</span><TransitionLink href="/managed-farmlands/star-garden" className={projects.textLink}>Explore Star Garden ↗</TransitionLink><p className={projects.sourceNote}>Discover the estate, amenities and project details.</p></div>
      </div>
    </PageMotion>
  </section>;
}
