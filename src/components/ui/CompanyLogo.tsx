import Image from "next/image";
import styles from "./CompanyLogo.module.css";

/** Vector outlines traced from the supplied logo keep the transparent mark crisp at every display density. */
export default function CompanyLogo() {
  return <span className={styles.logo}><Image className={styles.onDark} src="/brand-logo.svg" alt="Company logo" width={512} height={512} unoptimized /><Image className={styles.onLight} src="/brand-logo-on-light.svg" alt="" aria-hidden="true" width={512} height={512} unoptimized /></span>;
}
