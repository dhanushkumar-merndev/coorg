import type { ReactNode } from "react";
import PageMotion from "@/components/pages/PageMotion";
import { ContourMark } from "@/components/pages/PagePrimitives";
import TransitionLink from "@/components/navigation/TransitionLink";
import { LuArrowRight } from "react-icons/lu";
import pageStyles from "@/components/pages/pages.module.css";
import styles from "./legal.module.css";

export type LegalSection = { id: string; title: string; content: ReactNode };

type LegalPageProps = {
  eyebrow: string;
  title: [string, string];
  intro: string;
  updated: string;
  sections: LegalSection[];
  related: { href: string; label: string; line: string };
};

// Shared shell for the policy pages: a quiet intro, a sticky contents list on
// wide screens, and numbered sections that stay plain, readable HTML.
export default function LegalPage({ eyebrow, title, intro, updated, sections, related }: LegalPageProps) {
  return <PageMotion className={pageStyles.page} tone="quiet">
    <section className={styles.intro} aria-labelledby="chapter-title">
      <ContourMark className={styles.contour} />
      <p className={pageStyles.eyebrow} data-chapter-intro>{eyebrow}</p>
      <h1 id="chapter-title" className={styles.title}>
        <span className={pageStyles.lineMask}><span data-chapter-entry>{title[0]} <em>{title[1]}</em></span></span>
      </h1>
      <p className={styles.lead} data-chapter-intro>{intro}</p>
      <p className={styles.updated} data-chapter-intro>Last updated <time dateTime={updated}>{formatDate(updated)}</time></p>
    </section>

    <div className={styles.layout}>
      <nav className={styles.contents} aria-label="On this page">
        <p className={styles.contentsLabel}>On this page</p>
        <ol>{sections.map((section, index) => <li key={section.id}><a href={`#${section.id}`}><span>{String(index + 1).padStart(2, "0")}</span>{section.title}</a></li>)}</ol>
      </nav>

      <article className={styles.article}>
        {sections.map((section, index) => <section key={section.id} id={section.id} className={styles.clause} aria-labelledby={`${section.id}-title`}>
          <p className={styles.clauseNumber} aria-hidden="true">{String(index + 1).padStart(2, "0")}</p>
          <div>
            <h2 id={`${section.id}-title`}>{section.title}</h2>
            <div className={styles.prose}>{section.content}</div>
          </div>
        </section>)}

        <TransitionLink href={related.href} className={styles.related}>
          <span className={styles.relatedLabel}>Also read</span>
          <span className={styles.relatedTitle}>{related.label} <LuArrowRight aria-hidden="true" /></span>
          <span className={styles.relatedLine}>{related.line}</span>
        </TransitionLink>
      </article>
    </div>
  </PageMotion>;
}

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}
