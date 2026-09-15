import Image from "next/image";
import TransitionLink from "@/components/navigation/TransitionLink";
import { LuArrowUpRight } from "react-icons/lu";
import type { EstateListing } from "@/data/estate-listings";
import projects from "@/components/projects/projects.module.css";
import styles from "./estates.module.css";

export default function EstateCard({ estate, compact = false }: { estate: EstateListing; index?: number; compact?: boolean }) {
  const photo = estate.photos[0];
  const href = `/estates/${estate.id}`;

  if (compact) {
    return <article className={styles.acreageCard} aria-labelledby={`estate-${estate.id}`}>
      {photo && <TransitionLink href={href} className={styles.cardVisual} aria-label={`Explore ${estate.name}`}>
        <div className={styles.imageViewport}>
          <div className={styles.cardImage}><Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 700px) 100vw, 33vw" /></div>
          <div className={projects.cardShade} aria-hidden="true" />
        </div>
        {estate.areaLabel && <div className={styles.tagRibbon}>{estate.areaLabel}</div>}
        <span className={projects.viewCircle} aria-hidden="true"><LuArrowUpRight size={22} /></span>
      </TransitionLink>}
      <div className={styles.acreageCopy} data-project-copy>
        <div className={styles.cardMeta}><span>{estate.location ?? estate.category}</span></div>
        <h3 id={`estate-${estate.id}`}><TransitionLink href={href}>{estate.name}</TransitionLink></h3>
        <p className={styles.cardSummary}>{estate.summary}</p>
        {estate.highlights && (
          <div className={styles.badgeRow}>
            {estate.highlights.map((tag) => (
              <span key={tag} className={styles.tagBadge}>{tag}</span>
            ))}
          </div>
        )}
        {estate.features && (
          <ul className={styles.featureBullets}>
            {estate.features.slice(0, 2).map((feature, i) => (
              <li key={i}>{feature}</li>
            ))}
          </ul>
        )}
        <div className={styles.cardActionRow}>
          <TransitionLink href={href} className={styles.cardLink}>Discover the estate <LuArrowUpRight size={17} aria-hidden="true" /></TransitionLink>
        </div>
      </div>
    </article>;
  }

  return <article className={photo ? projects.projectCard : styles.acreageCard} aria-labelledby={`estate-${estate.id}`}>
    {photo && <TransitionLink href={href} className={projects.cardVisual} aria-label={`Explore ${estate.name}`}>
      <div className={projects.imageViewport} data-project-frame>
      <div className={projects.cardImage} data-project-image><Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 700px) 100vw, 58vw" /></div>
      <div className={projects.cardShade} aria-hidden="true" />
      </div>
      {estate.areaLabel && <div className={styles.tagRibbon}>{estate.areaLabel}{estate.areaNote && photo.association === "probable" ? " · to confirm" : ""}</div>}
      <span className={projects.viewCircle} aria-hidden="true"><LuArrowUpRight size={25} /></span>
    </TransitionLink>}
    <div className={photo ? projects.cardCopy : styles.acreageCopy} data-project-copy>
      <div className={projects.cardMeta}><span>{estate.location ?? "Location on enquiry"}</span></div>
      <h3 id={`estate-${estate.id}`}><TransitionLink href={href}>{estate.name}</TransitionLink></h3>
      <p className={projects.cardSummary}>{estate.summary}</p>
      {estate.highlights && (
        <div className={projects.badgeRow}>
          {estate.highlights.map((tag) => (
            <span key={tag} className={projects.tagBadge}>{tag}</span>
          ))}
        </div>
      )}
      {estate.description?.slice(0, 2).map((para, i) => (
        <p key={i} className={projects.cardDetailText}>{para}</p>
      ))}
      {estate.features && (
        <ul className={projects.featureBullets}>
          {estate.features.slice(0, 4).map((feature, i) => (
            <li key={i}>{feature}</li>
          ))}
        </ul>
      )}
      <div className={projects.cardFacts}><span>{estate.areaLabel ?? "Acreage on enquiry"}</span><span>{estate.category}</span></div>
      {photo && estate.areaNote && <p className={styles.areaNote}>{estate.areaNote}</p>}
      <TransitionLink href={href} className={projects.textLink}>Discover the estate <LuArrowUpRight size={19} aria-hidden="true" /></TransitionLink>
    </div>
  </article>;
}
