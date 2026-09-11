"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./birds.module.css";

const birds = Array.from({ length: 16 }, (_, index) => ({
  id: index,
  top: 13 + ((index * 7) % 19),
  size: 9 + ((index * 3) % 13),
  duration: 46 + ((index * 7) % 25),
  delay: -((index * 13) % 60),
  opacity: 0.35 + (index % 4) * 0.13,
  flap: 1.2 + (index % 5) * 0.3,
}));

export default function BirdFlock() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);
  useEffect(() => {
    let visible = true;
    const update = () => setActive(visible && document.visibilityState === "visible");
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); });
    if (root.current) observer.observe(root.current);
    document.addEventListener("visibilitychange", update);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", update); };
  }, []);
  return <div ref={root} className={styles.flock} data-active={active} data-hero-birds aria-hidden="true">
    {birds.map((bird) => <span key={bird.id} className={styles.bird} style={{
      "--bird-top": `${bird.top}%`, "--bird-size": `${bird.size}px`, "--bird-duration": `${bird.duration}s`,
      "--bird-delay": `${bird.delay}s`, "--bird-opacity": bird.opacity, "--wing-duration": `${bird.flap}s`,
    } as CSSProperties}>
      <svg viewBox="0 0 32 18" fill="currentColor"><g className={styles.wings}><path d="M16 11C12 6 7 4 1 5c5 1 9 5 14 8Z"/><path d="M16 11c4-5 9-7 15-6-5 1-9 5-14 8Z"/></g><path d="m15 10 2 0 1 6-2-1-2 1z"/></svg>
    </span>)}
  </div>;
}
