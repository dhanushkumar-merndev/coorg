"use client";

import { useEffect, useRef } from "react";
import { LuArrowDown } from "react-icons/lu";
import styles from "./HeroScrollIndicator.module.css";

export default function HeroScrollIndicator({ anchor }: { anchor: string }) {
  const link = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const node = link.current;
    const hero = node?.closest<HTMLElement>("[data-chapter-hero]");
    if (!node || !hero) return;

    const update = () => {
      const bounds = hero.getBoundingClientRect();
      const hidden = bounds.top < -24 || bounds.top > innerHeight / 2 || bounds.bottom < 120;
      node.dataset.scrolled = String(hidden);
      node.tabIndex = hidden ? -1 : 0;
      node.setAttribute("aria-hidden", String(hidden));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [anchor]);

  return <a ref={link} href={`#${anchor}`} className={styles.indicator} aria-label="Scroll to explore" data-hero-scroll-indicator>
    <span className={styles.label}>Scroll</span>
    <span className={styles.circle}><LuArrowDown size={24} strokeWidth={1.5} aria-hidden="true" /></span>
  </a>;
}
