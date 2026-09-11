import styles from "./sections.module.css";
import TransitionLink from "../navigation/TransitionLink";
import { MountainMark } from "../ui/Icons";
import { LuArrowUp } from "react-icons/lu";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerTop}>
        <TransitionLink href="/" className={styles.footerBrand} aria-label="Land in Coorg home">
          <MountainMark />
          <span>LAND IN COORG<small>ROOTED IN THE LANDSCAPE</small></span>
        </TransitionLink>
        <p className={styles.footerLocation}>Coorg, Karnataka, India.<br /><span>A little closer to what matters.</span></p>
        <nav className={styles.footerNav} aria-label="Footer navigation"><TransitionLink href="/opportunities">Opportunities</TransitionLink><TransitionLink href="/plantations">Plantations</TransitionLink><TransitionLink href="/estates">Estates</TransitionLink><TransitionLink href="/about-coorg">About Coorg</TransitionLink><TransitionLink href="/enquiry">Enquire</TransitionLink></nav>
      </div>
      <div className={styles.footerBottom}><p>© {new Date().getFullYear()} Land in Coorg</p><p>Land. Estates. Plantations. Possibilities.</p><TransitionLink href="/">Back to the hills <LuArrowUp size={14} aria-hidden="true" /></TransitionLink></div>
    </footer>
  );
}
