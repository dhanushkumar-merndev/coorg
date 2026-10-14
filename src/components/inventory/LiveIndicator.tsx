import styles from "./LiveIndicator.module.css";

/** Marks the interactive map, independently of the plot availability data. */
export default function LiveIndicator() {
  return <span className={styles.indicator} role="img" aria-label="Live interactive map">
    <span className={styles.signal} aria-hidden="true" />
    <span aria-hidden="true">LIVE</span>
  </span>;
}
