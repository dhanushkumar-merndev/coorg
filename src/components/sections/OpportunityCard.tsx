import Image from "next/image";
import type { Opportunity } from "@/data/opportunities";
import styles from "./sections.module.css";

export function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  const cover = opportunity.media[0];
  return (
    <article className={styles.opportunityCard}>
      <div className={styles.opportunityImage}>
        {cover && <Image src={cover.src} alt={cover.alt} fill sizes="(max-width: 700px) 88vw, 30vw" />}
        <span className={styles.draftBadge}>Draft · {opportunity.verificationStatus}</span>
      </div>
      <div className={styles.opportunityBody}>
        <p className={styles.eyebrow}>{cover?.conceptual ? "Illustrative marketing render" : `${cover?.association ?? "Unconfirmed"} source media`}</p>
        <h3>{opportunity.name}</h3>
        <p className={styles.sourceCaution}>{opportunity.cautions[0]}</p>
        <details className={styles.verificationDetails}>
          <summary>Publication review notes</summary>
          <dl>
            <div><dt>Area</dt><dd>{opportunity.areaLabel ?? "TBC"}</dd></div>
            <div><dt>Price</dt><dd>{opportunity.priceLabel ?? "TBC"}</dd></div>
            <div><dt>Price basis</dt><dd>{opportunity.priceBasisConfirmed ? "Confirmed" : "TBC"}</dd></div>
            <div><dt>Legal status</dt><dd>{opportunity.legalStatus ?? "TBC"}</dd></div>
            <div><dt>Public contact</dt><dd>{opportunity.publicContact ?? "TBC"}</dd></div>
          </dl>
          {opportunity.cautions.slice(1).map((caution) => <p key={caution}>{caution}</p>)}
        </details>
      </div>
    </article>
  );
}
