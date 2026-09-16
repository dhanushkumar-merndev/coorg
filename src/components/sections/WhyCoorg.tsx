import Image from "next/image";
import { EditorialReveal } from "./EditorialReveal";
import styles from "./sections.module.css";
import TransitionLink from "../navigation/TransitionLink";
import { LuArrowUpRight } from "react-icons/lu";

export function WhyCoorg() {
  return (
    <section id="why-star" className={styles.whySection} aria-labelledby="why-star-heading">
      <EditorialReveal className={styles.whyGrid}>
        <div className={styles.whyImageColumn}>
          <p className={styles.eyebrow}><span className={styles.smallLine} /> Rooted in nature</p>
          <figure data-editorial-reveal>
            <div className={styles.whyImage} data-parallax-frame>
              <div className={styles.parallaxImage} data-editorial-parallax>
                <Image src="/images/coorg/supplied/generic/forest-road.webp" alt="A quiet road winding between tall trees and dense green foliage" fill sizes="(max-width: 700px) 210vw, (max-width: 1000px) 175vw, 115vw" />
              </div>
              <span className={styles.imageCorner} aria-hidden="true">ROOM TO GROW<br />SPACE TO BELONG</span>
            </div>
            <figcaption className={styles.caption}>A glimpse of the landscape · Atmospheric imagery</figcaption>
          </figure>
        </div>
        <div className={styles.whyCopy}>
          <p className={styles.eyebrow} data-editorial-reveal>02 / Why Star Managed Farmlands</p>
          <h2 id="why-star-heading" className={styles.editorialHeading} data-editorial-group>
            <span className={styles.lineClip}><span data-editorial-line>Your vision. </span></span>
            <span className={styles.lineClip}><span data-editorial-line>A place </span></span>
            <span className={styles.lineClip}><span data-editorial-line><em>to grow.</em></span></span>
          </h2>
          <p className={styles.bodyCopy} data-editorial-reveal>A connection with the land starts with what matters to you. At Star Managed Farmlands, we believe in thoughtful choices, respect for nature and clear conversations.</p>
          <div className={styles.themes} data-editorial-reveal>
            <p><span>01</span> Your priorities.<i className={styles.themeRule} data-editorial-rule aria-hidden="true" /></p>
            <p><span>02</span> Nature at heart.<i className={styles.themeRule} data-editorial-rule aria-hidden="true" /></p>
            <p><span>03</span> Clarity at every step.<i className={styles.themeRule} data-editorial-rule aria-hidden="true" /></p>
          </div>
          <p className={styles.whyClosing} data-editorial-reveal>Rooted in nature.<br />Grown with care.</p>
          <TransitionLink href="/about" className={styles.textLink}>Get to know us <LuArrowUpRight size={18} aria-hidden="true" /></TransitionLink>
        </div>
      </EditorialReveal>
    </section>
  );
}
