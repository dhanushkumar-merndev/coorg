"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./projects.module.css";

/** Scroll transforms live on the crop wrapper; CSS hover lives on its image. */
export default function ProjectMotion({ children, className = "" }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add({ motion: "(prefers-reduced-motion: no-preference)", compact: "(max-width: 700px)" }, ({ conditions }) => {
      if (!conditions?.motion) return;
      const context = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>("[data-project-frame]").forEach((frame) => {
          gsap.fromTo(frame, { clipPath: "inset(8% 5% 8% 5% round 8px)" }, {
            clipPath: "inset(0% 0% 0% 0% round 8px)", ease: "none",
            scrollTrigger: { trigger: frame, start: "top 95%", end: "top 40%", scrub: 0.7 },
          });
        });
        gsap.utils.toArray<HTMLElement>("[data-project-image]").forEach((image) => {
          const distance = conditions.compact ? 3 : 7;
          gsap.fromTo(image, { yPercent: -distance }, {
            yPercent: distance, ease: "none",
            scrollTrigger: { trigger: image.parentElement, start: "top bottom", end: "bottom top", scrub: 0.8 },
          });
        });
        gsap.utils.toArray<HTMLElement>("[data-project-copy]").forEach((copy) => {
          gsap.fromTo(copy.children, { y: 26, opacity: 0 }, {
            y: 0, opacity: 1, duration: 0.9, stagger: 0.1, ease: "power3.out",
            scrollTrigger: { trigger: copy, start: "top 94%", once: true },
          });
        });
        gsap.utils.toArray<HTMLElement>("[data-project-number]").forEach((number) => {
          gsap.fromTo(number, { y: 30 }, {
            y: -30, ease: "none",
            scrollTrigger: { trigger: number.closest("article"), start: "top bottom", end: "bottom top", scrub: true },
          });
        });
      }, root);
      return () => context.revert();
    });
    return () => media.revert();
  }, []);

  return <div ref={root} className={`${styles.motionRoot} ${className}`}>{children}</div>;
}
