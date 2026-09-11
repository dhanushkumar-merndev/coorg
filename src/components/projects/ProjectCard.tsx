import Image from "next/image";
import { LuArrowUpRight } from "react-icons/lu";
import TransitionLink from "@/components/navigation/TransitionLink";
import type { EstateProject } from "@/data/projects";
import styles from "./projects.module.css";

export function ProjectStatus({ project }: { project: Pick<EstateProject, "status" | "availability"> }) {
  return <div className={styles.badges}>
    <span className={styles.status}><i aria-hidden="true" />{project.status === "completed" ? "Completed" : "Ongoing"}</span>
    {project.availability && <span className={`${styles.status} ${project.availability === "sold-out" ? styles.soldOut : styles.available}`}>{project.availability === "sold-out" ? "Sold out" : "Available"}</span>}
  </div>;
}

export default function ProjectCard({ project, index, compact = false }: { project: EstateProject; index: number; compact?: boolean }) {
  const cover = project.images[0];
  const href = `/${project.status === "ongoing" ? "farm-management" : "estates"}/${project.id}`;
  return <article className={`${styles.projectCard} ${compact ? styles.compactCard : ""}`} aria-labelledby={`project-${project.id}`}>
    <TransitionLink href={href} className={styles.cardVisual} aria-label={`Explore ${project.name}`} data-project-frame>
      <div className={styles.cardImage} data-project-image><Image src={cover.src} alt={cover.alt} fill sizes={compact ? "(max-width: 700px) 100vw, 33vw" : "(max-width: 700px) 100vw, 58vw"} /></div>
      <div className={styles.cardShade} aria-hidden="true" />
      <ProjectStatus project={project} />
      <span className={styles.imageCaption}>STAR INFRA DEVELOPERS · MARKETING IMAGERY</span>
      <span className={styles.viewCircle} aria-hidden="true"><LuArrowUpRight size={25} /></span>
    </TransitionLink>
    <div className={styles.cardCopy} data-project-copy>
      <div className={styles.cardMeta}><span>{project.location}</span><span>{String(index + 1).padStart(2, "0")}</span></div>
      <h3 id={`project-${project.id}`}><TransitionLink href={href}>{project.name}</TransitionLink></h3>
      <p className={styles.cardSummary}>{project.summary}</p>
      <div className={styles.cardFacts}><span>{project.areaLabel ?? project.category}</span><span>{project.availability === "sold-out" ? "Sold out" : project.availability === "available" ? "Available" : "Enquire for availability"}</span></div>
      <TransitionLink href={href} className={styles.textLink}>{project.status === "ongoing" ? "Explore the project" : "Discover the estate"} <LuArrowUpRight size={19} aria-hidden="true" /></TransitionLink>
    </div>
    {!compact && <span className={styles.projectNumber} data-project-number aria-hidden="true">0{index + 1}</span>}
  </article>;
}
