import { getDraftPreviews } from "@/data/opportunities";
import { OpportunityCard } from "./OpportunityCard";
import { EditorialReveal } from "./EditorialReveal";
import { TerrainStudy } from "./TerrainStudy";
import styles from "./sections.module.css";
import TransitionLink from "../navigation/TransitionLink";
import { LuArrowUpRight, LuAsterisk } from "react-icons/lu";

export function FeaturedOpportunities() {
  const drafts = getDraftPreviews();

  return (
    <section id="featured" className={styles.featuredSection} aria-labelledby="featured-heading">
      <EditorialReveal>
        <div className={styles.featuredTop}>
          <span className={styles.sectionRule} data-editorial-rule aria-hidden="true" />
          <p className={styles.eyebrow}>03 / Considered opportunities</p>
          <LuAsterisk className={styles.featuredMark} size={24} aria-hidden="true" />
        </div>
        <div className={styles.featuredIntro}>
          <h2 id="featured-heading" data-editorial-group="ink">
            <span className={styles.lineClip}><span data-editorial-line>A considered collection. </span></span>
            <span className={styles.lineClip}><span data-editorial-line><em>A personal introduction.</em></span></span>
          </h2>
          <div data-editorial-reveal>
            <p>Every search begins with a sense of what matters to you. A working estate. A quiet retreat. A place to make your own.</p>
            <TransitionLink href="/enquiry" className={styles.textLink}>Tell us what you have in mind <LuArrowUpRight size={18} aria-hidden="true" /></TransitionLink>
          </div>
        </div>
        <TerrainStudy />
        {drafts.length > 0 && (
          <div className={styles.draftPreview}>
            <p className={styles.previewNote}>Development preview · The following records are awaiting publication review and are hidden in production.</p>
            <div className={styles.opportunitiesGrid}>
              {drafts.map((opportunity) => <OpportunityCard key={opportunity.id} opportunity={opportunity} />)}
            </div>
          </div>
        )}
      </EditorialReveal>
    </section>
  );
}
