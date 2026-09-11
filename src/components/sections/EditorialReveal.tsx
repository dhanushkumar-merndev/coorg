"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollInk } from "@/components/ui/scrollInk";

export function EditorialReveal({ children, className }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add({ motion: "(prefers-reduced-motion: no-preference)", compact: "(max-width: 700px)" }, (conditions) => {
      if (!conditions.conditions?.motion) return;
      const compact = Boolean(conditions.conditions.compact);
      const context = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>("[data-editorial-reveal]").forEach((element) => {
          gsap.fromTo(element, { y: compact ? 20 : 32, autoAlpha: 0.65 }, {
            y: 0,
            autoAlpha: 1,
            duration: 1.1,
            ease: "power2.out",
            scrollTrigger: { trigger: element, start: "top 94%", once: true },
          });
        });

        // Text and image movement are separate targets, so a heading can unfold
        // while its neighbouring photograph moves gently through the crop.
        gsap.utils.toArray<HTMLElement>("[data-editorial-group]").forEach((group) => {
          const lines = Array.from(group.querySelectorAll<HTMLElement>("[data-editorial-line]"));
          const words = Array.from(group.querySelectorAll<HTMLElement>("[data-editorial-ink-word]"));
          const green = group.dataset.editorialInk === "green";
          scrollInk(group, words.length ? words : lines, green ? { fromColor: "#f4f0e7", toColor: "#3f9e64" } : {});
          if (group.dataset.editorialGroup === "ink") {
            return;
          }
          if (group.dataset.editorialGroup === "wipe") {
            gsap.fromTo(lines, { clipPath: "inset(0 100% 0 0)" }, {
              clipPath: "inset(0 0% 0 0)", stagger: 0.18, duration: 1.2, ease: "power2.out",
              scrollTrigger: { trigger: group, start: "top 86%", once: true },
            });
            return;
          }
          gsap.fromTo(lines, { yPercent: 108, rotation: compact ? 0 : 1.7, transformOrigin: "0% 100%" }, {
            yPercent: 0,
            rotation: 0,
            stagger: compact ? 0.1 : 0.14,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: { trigger: group, start: "top 88%", once: true },
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-editorial-parallax]").forEach((element) => {
          const distance = compact ? 2 : 5;
          gsap.fromTo(element, { yPercent: -distance }, {
            yPercent: distance,
            ease: "none",
            scrollTrigger: {
              trigger: element.closest("[data-parallax-frame]") ?? element.parentElement,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.15,
              invalidateOnRefresh: true,
            },
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-editorial-rule]").forEach((line) => {
          gsap.fromTo(line, { scaleX: 0, transformOrigin: "left center" }, {
            scaleX: 1,
            ease: "none",
            scrollTrigger: { trigger: line.parentElement, start: "top 91%", end: "top 58%", scrub: 0.7 },
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-editorial-sequence]").forEach((group) => {
          const lines = Array.from(group.querySelectorAll<HTMLElement>("[data-editorial-line]"));
          const words = Array.from(group.querySelectorAll<HTMLElement>("[data-editorial-ink-word]"));
          if (words.length) scrollInk(group, words, {
            fromColor: "#f4f0e7", toColor: "#3f9e64",
            start: "top 96%", end: compact ? "bottom 62%" : "bottom 48%",
          });
          gsap.fromTo(lines, { x: compact ? 12 : 25 }, {
            x: 0,
            duration: 1,
            stagger: 0.28,
            ease: "power2.out",
            scrollTrigger: { trigger: group, start: "top 96%", end: compact ? "bottom 76%" : "bottom 68%", scrub: 0.7 },
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-editorial-progress]").forEach((line) => {
          gsap.fromTo(line, { scaleX: 0, transformOrigin: "left center" }, {
            scaleX: 1,
            ease: "none",
            scrollTrigger: { trigger: line.closest("section"), start: "top 65%", end: "bottom 72%", scrub: 0.8 },
          });
        });
      }, root);
      return () => context.revert();
    });

    // Opening a review drawer changes the page height; re-measure triggers
    // below it once the height transition settles.
    const node = root.current;
    let refreshTimer = 0;
    const refreshAfterToggle = () => {
      window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 520);
    };
    node?.addEventListener("toggle", refreshAfterToggle, true);
    return () => {
      node?.removeEventListener("toggle", refreshAfterToggle, true);
      window.clearTimeout(refreshTimer);
      media.revert();
    };
  }, []);

  return <div ref={root} className={className}>{children}</div>;
}
