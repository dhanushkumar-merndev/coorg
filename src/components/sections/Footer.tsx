import styles from "./sections.module.css";
import TransitionLink from "../navigation/TransitionLink";
import CompanyLogo from "../ui/CompanyLogo";
import { LuArrowUp } from "react-icons/lu";
import { contactPhone, contactTelephone, whatsappUrl } from "@/data/contact";
import { navLinks } from "@/data/navigation";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerTop}>
        <TransitionLink href="/" className={styles.footerBrand} aria-label="Land in Coorg home">
          <CompanyLogo />
          <span>LAND IN COORG<small>ROOTED IN THE LANDSCAPE</small></span>
        </TransitionLink>
        <p className={styles.footerLocation}>Coorg, Karnataka, India.<br /><span>A little closer to what matters.</span><br /><a href={`tel:${contactTelephone}`}>{contactPhone}</a><br /><a href={whatsappUrl()} target="_blank" rel="noreferrer">WhatsApp us ↗</a></p>
        <nav className={styles.footerNav} aria-label="Footer navigation">{navLinks.map((link) => <TransitionLink key={link.href} href={link.href}>{link.label}</TransitionLink>)}<TransitionLink href="/enquiry">Enquire</TransitionLink></nav>
      </div>
      <div className={styles.footerBottom}><p>© {new Date().getFullYear()} Land in Coorg</p><p>Land. Estates. Thoughtful living.</p><TransitionLink href="/">Back to the hills <LuArrowUp size={14} aria-hidden="true" /></TransitionLink></div>
    </footer>
  );
}
