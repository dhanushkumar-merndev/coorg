import Image from "next/image";
import { EditorialReveal } from "./EditorialReveal";
import styles from "./sections.module.css";
import TransitionLink from "../navigation/TransitionLink";
import { LuArrowUpRight } from "react-icons/lu";

export function WhyCoorg() {
  return (
    <section id="about-coorg" className={styles.whySection} aria-labelledby="why-coorg-heading">
      <EditorialReveal className={styles.whyGrid}>
        <div className={styles.whyImageColumn}>
          <p className={styles.eyebrow}><span className={styles.smallLine} /> A sense of place</p>
          <figure data-editorial-reveal>
            <div className={styles.whyImage} data-parallax-frame>
              <div className={styles.parallaxImage} data-editorial-parallax>
                <Image src="/images/coorg/supplied/generic/forest-road.webp" alt="A quiet road winding between tall trees and dense green foliage" fill sizes="(max-width: 700px) 210vw, (max-width: 1000px) 175vw, 115vw" />
              </div>
              <span className={styles.imageCorner} aria-hidden="true">COORG<br />IN EVERY SEASON</span>
            </div>
            <figcaption className={styles.caption}>A glimpse of the landscape · Atmospheric imagery</figcaption>
          </figure>
        </div>
        <div className={styles.whyCopy}>
          <p className={styles.eyebrow} data-editorial-reveal>02 / Why Coorg</p>
          <h2 id="why-coorg-heading" className={styles.editorialHeading} data-editorial-group>
            <span className={styles.lineClip}><span data-editorial-line>Some places </span></span>
            <span className={styles.lineClip}><span data-editorial-line>are visited. </span></span>
            <span className={styles.lineClip}><span data-editorial-line><em>Others are felt.</em></span></span>
          </h2>
          <p className={styles.bodyCopy} data-editorial-reveal>The scent of earth after rain. A road that takes its time. A world of green, with room to find your own rhythm.</p>
          <div className={styles.themes} data-editorial-reveal>
            <p><span>01</span> Altitude.<i className={styles.themeRule} data-editorial-rule aria-hidden="true" /></p>
            <p><span>02</span> Rain.<i className={styles.themeRule} data-editorial-rule aria-hidden="true" /></p>
            <p><span>03</span> Plantation culture.<i className={styles.themeRule} data-editorial-rule aria-hidden="true" /></p>
          </div>
          <p className={styles.whyClosing} data-editorial-reveal>A landscape that changes<br />with every cloud.</p>
          <TransitionLink href="/about-coorg" className={styles.textLink}>Discover Coorg <LuArrowUpRight size={18} aria-hidden="true" /></TransitionLink>
        </div>
      </EditorialReveal>
    </section>
  );
}
