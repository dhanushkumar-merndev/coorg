"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollInk } from "./scrollInk";

export default function RevealText({ children, className = "", scrollDriven = false }: { children: ReactNode; className?: string; scrollDriven?: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const node = root.current;
      if (!node) return;
      const context = gsap.context(() => {
        gsap.from(node, { y: scrollDriven ? 18 : 28, opacity: 0.7, duration: 1.2, ease: scrollDriven ? "none" : "power3.out", scrollTrigger: { trigger: node, start: "top 100%", end: "top 74%", scrub: scrollDriven, once: !scrollDriven } });
        node.querySelectorAll<HTMLElement>("h2, h3").forEach((heading) => {
          scrollInk(heading, [heading], { end: "bottom 58%" });
        });
      }, node);
      return () => context.revert();
    });
    return () => media.revert();
  }, [scrollDriven]);
  return <div ref={root} className={className}>{children}</div>;
}
