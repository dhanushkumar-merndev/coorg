import Image from "next/image";
import { LuChevronDown, LuCircleAlert } from "react-icons/lu";
import type { Opportunity, VerificationStatus } from "@/data/opportunities";
import styles from "./sections.module.css";

const statusLabels: Record<VerificationStatus, string> = {
  "confirmed-source": "Source confirmed",
  partial: "Partially verified",
  tbc: "To be confirmed",
};

const pad = (value: number) => String(value).padStart(2, "0");

export function OpportunityCard({ opportunity, index, total, ongoing = false }: { opportunity: Opportunity; index: number; total: number; ongoing?: boolean }) {
  const cover = opportunity.media[0];
  const mediaLabel = !cover ? "No media supplied" : cover.conceptual ? "Illustrative marketing render" : `${cover.association} source media`;
  // Publication fields stay verbatim; a missing value is shown as TBC, never inferred.
  const fields: Array<[label: string, value: string | null]> = [
    ["Area", opportunity.areaLabel],
    ["Price", opportunity.priceLabel],
    ["Price basis", opportunity.priceBasisConfirmed ? "Confirmed" : null],
    ["Legal status", opportunity.legalStatus],
    ["Public contact", opportunity.publicContact],
  ];
  const onFile = fields.filter(([, value]) => value).length;

  return (
    <article className={styles.opportunityCard} data-editorial-reveal>
      <div className={styles.opportunityImage}>
        {cover && <Image src={cover.src} alt={cover.alt} fill sizes="(max-width: 700px) 92vw, (max-width: 1000px) 46vw, 30vw" />}
        <span className={styles.statusPill} data-status={opportunity.verificationStatus}>
          <span className={styles.statusDot} aria-hidden="true" />{ongoing ? "Ongoing · Review pending" : `Draft · ${statusLabels[opportunity.verificationStatus]}`}
        </span>
      </div>
      <div className={styles.opportunityBody}>
        <p className={`${styles.eyebrow} ${styles.cardMeta}`}><span>{mediaLabel}</span><span className={styles.cardIndex} aria-hidden="true">{pad(index + 1)} / {pad(total)}</span></p>
        <h3>{opportunity.name}</h3>
        {opportunity.priceBasisConfirmed && opportunity.priceLabel && <p className={styles.confirmedPrice}>{opportunity.priceLabel}</p>}
        <p className={styles.sourceCaution}>{opportunity.cautions[0]}</p>
        <div className={styles.readiness}>
          <p className={styles.readinessHead}><span>Publication readiness</span><strong>{onFile} of {fields.length} on file</strong></p>
          <div className={styles.readinessBar} aria-hidden="true">
            {fields.map(([label, value]) => <span key={label} data-filled={Boolean(value)} />)}
          </div>
        </div>
        <details className={styles.verificationDetails}>
          <summary>Review notes<LuChevronDown size={16} aria-hidden="true" /></summary>
          <div className={styles.detailsInner}>
            <dl>
              {fields.map(([label, value]) => (
                <div key={label}><dt>{label}</dt><dd>{value ?? <span className={styles.tbcPill}>TBC</span>}</dd></div>
              ))}
            </dl>
            {opportunity.cautions.length > 1 && (
              <ul className={styles.cautionList}>
                {opportunity.cautions.slice(1).map((caution) => <li key={caution}><LuCircleAlert size={14} aria-hidden="true" />{caution}</li>)}
              </ul>
            )}
          </div>
        </details>
      </div>
    </article>
  );
}
