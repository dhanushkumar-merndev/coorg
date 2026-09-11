"use client";

import { useLayoutEffect, useMemo, useRef, type CSSProperties } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./PagePatterns.module.css";

function contour(seed: number, ring: number) {
  const radius = 112 - ring * 9;
  const phase = (seed % 97) / 11;
  const points = Array.from({ length: 48 }, (_, index) => {
    const angle = (index / 48) * Math.PI * 2;
    const wave = 1 + Math.sin(angle * 3 + phase) * 0.13 + Math.cos(angle * 5 - phase) * 0.07;
    return [160 + Math.cos(angle) * radius * wave, 160 + Math.sin(angle) * radius * wave * 0.91];
  });
  const midpoint = (a: number[], b: number[]) => `${((a[0] + b[0]) / 2).toFixed(2)} ${((a[1] + b[1]) / 2).toFixed(2)}`;
  return `M ${midpoint(points[47], points[0])} ${points.map((point, index) => `Q ${point[0].toFixed(2)} ${point[1].toFixed(2)} ${midpoint(point, points[(index + 1) % 48])}`).join(" ")} Z`;
}

/** Decorative, route-seeded linework; stable across server and client renders. */
export default function PagePatterns() {
  const pathname = usePathname();
  const root = useRef<HTMLDivElement>(null);
  const motifs = useMemo(() => {
    let seed = [...pathname].reduce((value, character) => (value * 31 + character.charCodeAt(0)) >>> 0, 17);
    const random = () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    return [17, 28, 40, 51, 63, 76, 89].map((top, index) => {
      const inner = index === 2 || index === 4 || index === 5;
      return {
        top: top + random() * 5,
        size: Math.round(155 + random() * 225),
        rotation: random() * 240 - 120,
        inner,
        left: inner ? 24 + random() * 49 : null,
        paths: Array.from({ length: 9 }, (_, ring) => contour(seed + index * 19, ring)),
      };
    });
  }, [pathname]);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const layer = root.current;
    const main = layer?.parentElement;
    // Put interior motifs in section seams, where there is room for linework.
    // Re-measure after images/fonts change layout without adding document height.
    const placeBetweenSections = () => {
      if (!layer || !main) return;
      const origin = main.getBoundingClientRect().top;
      const sections = Array.from(main.querySelectorAll<HTMLElement>("section"))
        .filter((section) => !section.parentElement?.closest("section") && section.getBoundingClientRect().height > 180)
        .slice(1);
      layer.querySelectorAll<HTMLElement>('[data-contour-position="between"]').forEach((motif, index) => {
        const section = sections[Math.floor((index + 1) * sections.length / 4)];
        if (!section) return;
        motif.style.top = `${section.getBoundingClientRect().top - origin - motif.offsetWidth * 0.42}px`;
      });
    };
    placeBetweenSections();
    const resize = new ResizeObserver(placeBetweenSections);
    if (main) resize.observe(main);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>("[data-contour-motif]").forEach((motif) => {
          const timeline = gsap.timeline({ scrollTrigger: { trigger: motif, start: "top 97%", end: "bottom 52%", scrub: 0.8, invalidateOnRefresh: true } });
          timeline.fromTo(motif, { y: 26, opacity: 0.03 }, { y: 0, opacity: 0.18, duration: 1, ease: "none" }, 0);
          timeline.fromTo(motif.querySelectorAll("path"), { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, stagger: 0.06, duration: 0.8, ease: "none" }, 0);
        });
      }, root);
      return () => context.revert();
    });
    return () => { resize.disconnect(); media.revert(); };
  }, [pathname]);

  return <div ref={root} className={styles.layer} aria-hidden="true" data-page-patterns>
    {motifs.map((motif, index) => <div key={`${pathname}-${index}`} className={`${styles.motif} ${motif.inner ? styles.between : index % 2 ? styles.right : styles.left}`} style={{ top: `${motif.top}%`, left: motif.left === null ? undefined : `${motif.left}%`, "--motif-size": `${motif.size}px` } as CSSProperties} data-contour-motif data-contour-position={motif.inner ? "between" : "edge"}>
      <svg viewBox="0 0 320 320" fill="none" focusable="false" style={{ transform: `rotate(${motif.rotation}deg)` }}>
        {motif.paths.map((path, ring) => <path key={ring} d={path} pathLength={1} stroke="currentColor" strokeWidth="0.85" opacity={1 - ring * 0.06} />)}
      </svg>
    </div>)}
  </div>;
}
