import Image from "next/image";
import { EditorialReveal } from "./EditorialReveal";
import styles from "./sections.module.css";

export function LandStory() {
  return (
    <section className={styles.landStory} aria-labelledby="land-story-heading" data-parallax-frame>
      <EditorialReveal>
        <div className={`${styles.parallaxImage} ${styles.storyImage}`} data-editorial-parallax>
          <Image src="/images/coorg/supplied/generic/forest-curve.webp" alt="A pale road curving through trees and green undergrowth" fill sizes="(max-width: 700px) 410vw, 155vw" />
        </div>
        <div className={styles.storyShade} aria-hidden="true" />
        <div className={styles.storyContent}>
          <p className={styles.eyebrow} data-editorial-reveal>04 / Beyond the boundaries</p>
          <h2 id="land-story-heading" data-editorial-group="wipe">
            <span className={styles.lineClip}><span data-editorial-line>Land is more </span></span>
            <span className={styles.lineClip}><span data-editorial-line>than <em>area.</em></span></span>
          </h2>
          <div className={styles.storyLines} data-editorial-sequence>
            <p className={styles.lineClip}><span data-editorial-line>It is the road in.</span></p>
            <p className={styles.lineClip}><span data-editorial-line>The tree line.</span></p>
            <p className={styles.lineClip}><span data-editorial-line>The rain pattern.</span></p>
            <p className={styles.lineClip}><span data-editorial-line>The view you wake up to.</span></p>
          </div>
        </div>
        <div className={styles.storyProgress} aria-hidden="true"><span data-editorial-progress /></div>
      </EditorialReveal>
      <p className={styles.storyCaption}>The feeling of Coorg · Atmospheric imagery</p>
    </section>
  );
}
