import Image from "next/image";
import styles from "./CompanyLogo.module.css";

/** Preserve the supplied logo's transparent background. */
export default function CompanyLogo() {
  return <span className={styles.logo}><Image className={styles.onDark} src="/logo.png" alt="Company logo" width={512} height={512} unoptimized /><Image className={styles.onLight} src="/logo-on-light.png" alt="" aria-hidden="true" width={512} height={512} unoptimized /></span>;
}
