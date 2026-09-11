"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function RevealText({ children, className = "", scrollDriven = false }: { children: ReactNode; className?: string; scrollDriven?: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(root.current, { y: scrollDriven ? 18 : 28, opacity: scrollDriven ? 0.55 : 0.15, duration: 1.2, ease: scrollDriven ? "none" : "power3.out", scrollTrigger: { trigger: root.current, start: "top 100%", end: "top 74%", scrub: scrollDriven, once: !scrollDriven } });
    });
    return () => media.revert();
  }, [scrollDriven]);
  return <div ref={root} className={className}>{children}</div>;
}
