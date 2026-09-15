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

export default function ProjectCard({ project, compact = false }: { project: EstateProject; index?: number; compact?: boolean }) {
  const cover = project.images[0];
  const href = `/managed-farmlands/${project.id}`;
  return <article className={`${styles.projectCard} ${compact ? styles.compactCard : ""}`} aria-labelledby={`project-${project.id}`}>
    <TransitionLink href={href} className={styles.cardVisual} aria-label={`Explore ${project.name}`}>
      <div className={styles.imageViewport} data-project-frame>
      <div className={styles.cardImage} data-project-image><Image src={cover.src} alt={cover.alt} fill sizes={compact ? "(max-width: 700px) 100vw, 33vw" : "(max-width: 700px) 100vw, 58vw"} /></div>
      <div className={styles.cardShade} aria-hidden="true" />
      </div>
      <ProjectStatus project={project} />
      <span className={styles.viewCircle} aria-hidden="true"><LuArrowUpRight size={25} /></span>
    </TransitionLink>
    <div className={styles.cardCopy} data-project-copy>
      <div className={styles.cardMeta}><span>{project.location ?? "Location on enquiry"}</span></div>
      <h3 id={`project-${project.id}`}><TransitionLink href={href}>{project.name}</TransitionLink></h3>
      <p className={styles.cardSummary}>{project.summary}</p>
      {project.highlights && (
        <div className={styles.badgeRow}>
          {project.highlights.map((h, i) => (
            <span key={i} className={styles.tagBadge}>{h.label}: {h.value}</span>
          ))}
        </div>
      )}
      {project.description?.slice(0, 2).map((para, i) => (
        <p key={i} className={styles.cardDetailText}>{para}</p>
      ))}
      {project.features && (
        <ul className={styles.featureBullets}>
          {project.features.slice(0, 4).map((feature, i) => (
            <li key={i}>{feature}</li>
          ))}
        </ul>
      )}
      <div className={styles.cardFacts}>
        <span>{project.areaLabel ?? "Acreage on enquiry"}</span>
        <span>{project.availability === "sold-out" ? "Sold out" : project.availability === "available" ? "Available" : "Enquire for availability"}</span>
      </div>
      <TransitionLink href={href} className={styles.textLink}>{project.status === "ongoing" ? "Explore the project" : "Discover the estate"} <LuArrowUpRight size={19} aria-hidden="true" /></TransitionLink>
    </div>
  </article>;
}
