"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollInk } from "@/components/ui/scrollInk";

/** GSAP owns scroll wrappers; hover tilt lives on a separate child in DepthCard. */
export default function PageMotion({ children, className, tone = "editorial" }: { children: ReactNode; className?: string; tone?: "editorial" | "plantation" | "estate" | "landscape" | "quiet" }) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add({ motion: "(prefers-reduced-motion: no-preference)", compact: "(max-width: 700px)" }, (context) => {
      if (!context.conditions?.motion) return;
      const compact = Boolean(context.conditions.compact);
      let revealPage: (() => void) | undefined;
      const animation = gsap.context(() => {
        const entry = gsap.timeline({ paused: true });
        const entryFrom = tone === "estate" ? { x: compact ? -20 : -55, opacity: 0 }
          : tone === "landscape" ? { scale: 1.035, opacity: 0 }
          : tone === "quiet" ? { y: 15, opacity: 0 }
          : tone === "plantation" ? { yPercent: 65, opacity: 0 }
          : { yPercent: 105, opacity: 0 };
        const entryTargets = gsap.utils.toArray<HTMLElement>("[data-chapter-entry]");
        const introTargets = gsap.utils.toArray<HTMLElement>("[data-chapter-intro]");
        if (entryTargets.length) entry.fromTo(entryTargets, entryFrom, {
          x: 0, y: 0, yPercent: 0, scale: 1, opacity: 1, duration: 1.1, stagger: 0.12, ease: "power3.out",
        });
        if (introTargets.length) entry.fromTo(introTargets, { y: 20, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.07, ease: "power2.out",
        }, 0.25);
        revealPage = () => { entry.play(); };
        const state = document.documentElement.dataset.pageTransition;
        if (state !== "covering" && state !== "covered") entry.play();

        gsap.utils.toArray<HTMLElement>("[data-chapter-words]").forEach((heading) => {
          const treatment = heading.dataset.chapterWords || ({ plantation: "ink", estate: "wipe", landscape: "settle", quiet: "ink", editorial: "rise" }[tone]);
          const words = Array.from(heading.querySelectorAll<HTMLElement>("[data-chapter-word]"));
          scrollInk(heading, words);
          if (treatment === "wipe") {
            gsap.fromTo(words, { clipPath: "inset(0 100% 0 0)" }, {
              clipPath: "inset(0 0% 0 0)", duration: 0.85, stagger: 0.07, ease: "power2.out",
              scrollTrigger: { trigger: heading, start: "top 92%", once: true },
            });
          } else if (treatment === "settle") {
            gsap.fromTo(heading, { x: compact ? 12 : 32 }, {
              x: 0, ease: "none",
              scrollTrigger: { trigger: heading, start: "top 95%", end: "bottom 72%", scrub: true },
            });
          } else if (treatment === "rise") {
            gsap.fromTo(words, { yPercent: 90 }, {
              yPercent: 0, duration: 0.9, stagger: 0.055, ease: "power3.out",
              scrollTrigger: { trigger: heading, start: "top 94%", once: true },
            });
          }
        });
        gsap.utils.toArray<HTMLElement>("[data-chapter-depth]").forEach((copy) => {
          gsap.to(copy, {
            y: compact ? -20 : -70,
            ease: "none",
            scrollTrigger: { trigger: copy.closest("[data-chapter-hero]"), start: "top top", end: "bottom top", scrub: 0.8 },
          });
        });
        gsap.utils.toArray<HTMLElement>("[data-chapter-image]").forEach((image) => {
          const hero = Boolean(image.closest("[data-chapter-hero]"));
          const distance = compact ? 4 : hero ? 13 : 8;
          gsap.fromTo(image, { yPercent: -distance / 2, scale: compact ? 1.025 : 1.06 }, {
            yPercent: distance / 2, scale: 1, ease: "none",
            scrollTrigger: {
              trigger: image.parentElement, start: hero ? "top top" : "top bottom",
              end: "bottom top", scrub: true, invalidateOnRefresh: true,
            },
          });
        });
        gsap.utils.toArray<HTMLElement>("[data-chapter-image-frame]").forEach((frame) => {
          gsap.fromTo(frame, { clipPath: "inset(7% 5% 7% 5% round 16px)" }, {
            clipPath: "inset(0% 0% 0% 0% round 5px)", ease: "none",
            scrollTrigger: { trigger: frame, start: "top 94%", end: "top 45%", scrub: 0.8 },
          });
        });
        gsap.utils.toArray<HTMLElement>("[data-chapter-rise]").forEach((element) => {
          gsap.fromTo(element, { y: compact ? 20 : 36, opacity: 0.6 }, {
            y: 0, opacity: 1, duration: 1, ease: "power3.out",
            scrollTrigger: { trigger: element, start: "top 96%", once: true },
          });
        });
        gsap.utils.toArray<HTMLElement>("[data-chapter-rule]").forEach((element) => {
          gsap.fromTo(element, { scaleX: 0, transformOrigin: "left center" }, {
            scaleX: 1, ease: "none",
            scrollTrigger: { trigger: element.parentElement, start: "top 94%", end: "top 64%", scrub: true },
          });
        });
        gsap.utils.toArray<HTMLElement>("[data-card-copy]").forEach((copy) => {
          gsap.fromTo(copy.children, { opacity: 0 }, {
            opacity: 1, duration: 0.7, stagger: 0.1, ease: "power2.out",
            scrollTrigger: { trigger: copy, start: "top 96%", once: true },
          });
        });
        gsap.utils.toArray<HTMLElement>("[data-chapter-drift]").forEach((element) => {
          gsap.fromTo(element, { xPercent: compact ? 2 : 6 }, {
            xPercent: compact ? -2 : -6, ease: "none",
            scrollTrigger: { trigger: element.parentElement, start: "top bottom", end: "bottom top", scrub: true },
          });
        });
      }, root);
      const reveal = () => { revealPage?.(); };
      window.addEventListener("coorg:page-reveal", reveal);
      return () => {
        window.removeEventListener("coorg:page-reveal", reveal);
        animation.revert();
      };
    });
    return () => media.revert();
  }, [tone]);

  return <div ref={root} className={className}>{children}</div>;
}
