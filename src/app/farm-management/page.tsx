import type { Metadata } from "next";
import PageMotion from "@/components/pages/PageMotion";
import { ChapterHero, WordHeading, NextChapter, ContourMark } from "@/components/pages/PagePrimitives";
import ProjectCard from "@/components/projects/ProjectCard";
import ProjectMotion from "@/components/projects/ProjectMotion";
import { getDraftPreviews } from "@/data/opportunities";
import { OpportunityCard } from "@/components/sections/OpportunityCard";
import { EditorialReveal } from "@/components/sections/EditorialReveal";
import { farmProjects, farmManagementPreview, STAR_INFRA_SOURCE } from "@/data/projects";
import TransitionLink from "@/components/navigation/TransitionLink";
import styles from "@/components/pages/pages.module.css";
import projects from "@/components/projects/projects.module.css";
import sections from "@/components/sections/sections.module.css";

export const metadata: Metadata = {
  title: "Farm Management · Ongoing Projects | Land in Coorg",
  description: "Explore the ongoing project collection, discover the thinking behind land stewardship and begin your next chapter with Land in Coorg.",
};

export default function FarmManagementPage() {
  const previews = getDraftPreviews();
  return <PageMotion className={styles.page} tone="plantation">
    <ChapterHero className={projects.farmHero} chapter="01" label="Farm Management / Ongoing projects" lines={["Rooted in the land.", "Growing with care."]} description="A longer view of land. Explore the ongoing collection and begin a conversation about the place you have in mind." image="/images/coorg/conceptual/plantation-estates.webp" alt="Conceptual plantation landscape with a winding road between misty green hills" anchor="ongoing-projects">
      <div className={projects.heroPrice} data-chapter-intro><span>Starting from</span><strong>₹{farmManagementPreview.price.amount.toLocaleString("en-IN")} <small>per sq ft</small></strong><p>Indicative starting price · project-specific pricing on enquiry</p></div>
    </ChapterHero>
    <section id="ongoing-projects" className={styles.section} aria-labelledby="farm-heading">
      <div className={projects.collectionIntro}>
        <div><p className={styles.eyebrow}>IN THE MAKING / ONGOING PROJECTS</p><div className={projects.collectionNav}><TransitionLink href="/farm-management" aria-current="page">Ongoing projects</TransitionLink><TransitionLink href="/estates">Completed estates ↗</TransitionLink></div></div>
        <div><WordHeading id="farm-heading" treatment="ink">The next chapter takes shape.</WordHeading><p className={projects.introCopy} data-chapter-rise>Discover what is underway in the Star Infra Developers portfolio. Each project keeps its own setting, character and story.</p></div>
      </div>
      <ProjectMotion className={projects.projectList}>{farmProjects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}</ProjectMotion>
      <div className={projects.collectionFoot}><p className={projects.sourceNote}>Ongoing status and project information from <a href={STAR_INFRA_SOURCE} target="_blank" rel="noreferrer">Star Infra Developers</a>. The project location is shown on each card. Images are illustrative marketing material.</p><TransitionLink href="/enquiry" className={projects.textLink}>Discuss your plans ↗</TransitionLink></div>
    </section>
    {previews.length > 0 && <section className={styles.section} aria-labelledby="coorg-previews-heading">
      <div className={projects.collectionIntro}><p className={styles.eyebrow}>COORG / ONGOING COLLECTION PREVIEW</p><div><WordHeading id="coorg-previews-heading">Working land. Growing possibilities.</WordHeading><p className={projects.introCopy}>The supplied Coorg collection. Individual project details are being prepared for publication.</p></div></div>
      <EditorialReveal><div className={sections.previewHeader}><p className={sections.previewLabel}>Development preview</p><p className={sections.previewNote}>These records remain in review and are hidden in production.</p></div><div className={sections.opportunitiesGrid}>{previews.map((opportunity, index) => <OpportunityCard key={opportunity.id} opportunity={opportunity} index={index} total={previews.length} ongoing />)}</div></EditorialReveal>
    </section>}
    <section className={`${styles.section} ${styles.darkSection}`} aria-labelledby="farm-care-heading">
      <ContourMark className={styles.contour} />
      <div className={styles.darkIntro}><p className={styles.eyebrow}>A MORE THOUGHTFUL RELATIONSHIP WITH LAND</p><WordHeading id="farm-care-heading">Care begins with understanding.</WordHeading></div>
      <div className={styles.fieldNotes}>{[
        ["01", "The ground beneath", "Start with the land itself. Its terrain, planting and access are the first things to understand."],
        ["02", "The rhythm of a place", "Think through the seasons, the water and the everyday attention a living landscape needs."],
        ["03", "A shared intention", "Bring your questions about ownership and stewardship. Build the brief around the care you want to give."],
      ].map(([number, title, text]) => <article key={number} className={styles.fieldNote} data-chapter-rise><span className={styles.rule} data-chapter-rule /><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
    </section>
    <NextChapter href="/estates" eyebrow="EXPLORE THE COMPLETED COLLECTION" title="Places with a story." line="Discover three completed estates in Madikeri, Coorg." />
  </PageMotion>;
}
