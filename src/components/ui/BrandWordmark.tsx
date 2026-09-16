import { siteName, siteTagline } from "@/lib/site";
import styles from "./BrandWordmark.module.css";

export default function BrandWordmark() {
  return <span className={styles.wordmark}><span className={styles.name}>{siteName}</span><small className={styles.tagline}>{siteTagline}</small></span>;
}
