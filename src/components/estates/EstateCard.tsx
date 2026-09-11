import Image from "next/image";
import TransitionLink from "@/components/navigation/TransitionLink";
import { LuArrowUpRight } from "react-icons/lu";
import type { EstateListing } from "@/data/estate-listings";
import projects from "@/components/projects/projects.module.css";
import styles from "./estates.module.css";

export default function EstateCard({ estate, index }: { estate: EstateListing; index: number }) {
  const photo = estate.photos[0];
  const href = `/estates/${estate.id}`;
  return <article className={photo ? projects.projectCard : styles.acreageCard} aria-labelledby={`estate-${estate.id}`}>
    {photo && <TransitionLink href={href} className={projects.cardVisual} aria-label={`Explore ${estate.name}`}>
      <div className={projects.imageViewport} data-project-frame>
      <div className={projects.cardImage} data-project-image><Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 700px) 100vw, 58vw" /></div>
      <div className={projects.cardShade} aria-hidden="true" />
      </div>
      <div className={projects.badges}><span className={projects.status}>{estate.areaLabel}{estate.areaNote && photo.association === "probable" ? " · source note" : ""}</span></div>
      <span className={projects.imageCaption}>{photo.association === "confirmed" ? "ACTUAL PHOTOGRAPH · SLN SOURCE BROCHURE" : "SUPPLIED VILLA PHOTO · PROPERTY ASSOCIATION TO BE CONFIRMED"}</span>
      <span className={projects.viewCircle} aria-hidden="true"><LuArrowUpRight size={25} /></span>
    </TransitionLink>}
    <div className={photo ? projects.cardCopy : styles.acreageCopy} data-project-copy>
      <div className={projects.cardMeta}><span>{estate.location ?? estate.category}</span><span>{String(index + 1).padStart(2, "0")}</span></div>
      {!photo && <p className={styles.acreage}>{estate.areaLabel ?? "Let’s talk land."}</p>}
      <h3 id={`estate-${estate.id}`}><TransitionLink href={href}>{estate.name}</TransitionLink></h3>
      <p className={projects.cardSummary}>{estate.summary}</p>
      {photo && <div className={projects.cardFacts}><span>{estate.areaLabel}</span><span>{estate.category}</span></div>}
      {photo && estate.areaNote && <p className={styles.areaNote}>{estate.areaNote}</p>}
      <TransitionLink href={href} className={projects.textLink}>Discover the estate <LuArrowUpRight size={19} aria-hidden="true" /></TransitionLink>
    </div>
  </article>;
}
