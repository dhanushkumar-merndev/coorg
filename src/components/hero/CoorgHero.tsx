"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import MagneticButton from "../ui/MagneticButton";
import MistTransition from "./MistTransition";
import BirdFlock from "./BirdFlock";

const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });
const heroImage = "/images/coorg/conceptual/hero-mist-valley.webp";
// Mobile-only glance figures for Star Garden. The plot count arrives from the
// server page so the inventory plan data stays out of this client bundle.
const heroKpis = (plotCount: number) => [["10", "Acres of coffee"], [String(plotCount), "Total plots"], ["09", "Stream plots"]] as const;

export default function CoorgHero({ plotCount }: { plotCount: number }) {
  const root = useRef<HTMLElement>(null);
  const journey = useRef<HTMLDivElement>(null);
  const progress = useRef({ progress: 0 });
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const coarse = useMediaQuery("(pointer: coarse)");
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      const media = gsap.matchMedia();
      media.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        // Lenis supplies easing. Direct scrubbing avoids a second delayed
        // animation that would keep settling after the visitor stops scrolling.
        // The timeline runs until the hero has fully left the viewport: the first
        // half covers the pinned range, the second half the release scroll, so the
        // title keeps drifting apart instead of freezing when the pin ends.
        const timeline = gsap.timeline({ scrollTrigger: { trigger: journey.current, start: "top top", end: "bottom top", scrub: true, invalidateOnRefresh: true } });
        timeline.to(progress.current, { progress: 1, ease: "none", duration: 0.5 }, 0)
          .to(".hero-heading-depth", { y: -220, scale: 1.16, duration: 1, ease: "none" }, 0)
          .to(".hero-logo", { opacity: 0, y: -40, duration: 0.35 }, 0)
          .to(".hero-support", { opacity: 0, y: -70, duration: 0.33 }, 0)
          .to(".hero-landscape", { yPercent: -8, duration: 0.5, ease: "none" }, 0)
          .to(".hero-title-land", { xPercent: -34, yPercent: -30, duration: 1, ease: "none" }, 0)
          .to(".hero-title-coorg", { xPercent: 34, yPercent: 10, duration: 1, ease: "none" }, 0)
          .to("[data-hero-birds]", { yPercent: -18, opacity: 0, duration: 0.5 }, 0)
          .to(".hero-mist-transition", { opacity: 1, duration: 0.28 }, 0.22)
          .to(".hero-bottom", { opacity: 0, duration: 0.15 }, 0);
        return () => { progress.current.progress = 0; };
      });
      media.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } })
          .to(".hero-landscape, .hero-canvas", { yPercent: 10, scale: 1.08, duration: 1 }, 0)
          .to(".hero-heading-depth", { y: -45, duration: 1 }, 0)
          .to(".hero-title-land", { xPercent: -20, duration: 1, ease: "none" }, 0)
          .to(".hero-title-coorg", { xPercent: 20, duration: 1, ease: "none" }, 0);
      });
      return () => media.revert();
    }, root);
    return () => context.revert();
  }, []);

  return <div ref={journey} className="hero-journey" id="home"><section ref={root} className="coorg-hero" aria-label="Discover Star Managed Farmlands">
    <div className="hero-landscape" aria-hidden="true"><Image src={heroImage} alt="" fill preload sizes="(max-aspect-ratio: 16/9) 178vh, 100vw" className="hero-photograph" /></div>
    <HeroCanvas state={progress} reduced={reduced} coarse={coarse} />
    <div className="hero-vignette" aria-hidden="true" />
    <div className="hero-initial-mist" aria-hidden="true" />
    <BirdFlock />
    <div className="hero-copy-layout">
    <div className="hero-heading-depth">
      <span className="hero-logo" aria-hidden="true"><Image src="/brand-logo.svg" alt="" width={512} height={512} unoptimized /></span>
      <h1 className="hero-title"><span className="hero-title-land"><span className="hero-copy-entry">STAR</span></span>{" "}<span className="hero-title-coorg"><span className="hero-copy-entry">MANAGED FARMLANDS</span></span></h1>
    </div>
    <div className="hero-support"><span className="hero-horizon-line" aria-hidden="true" /><div className="hero-actions"><MagneticButton href="/opportunities">Explore Opportunities</MagneticButton><MagneticButton href="/enquiry" variant="line">Enquire Privately</MagneticButton><MagneticButton href="/live-inventory" variant="live"><i className="hero-live-dot" aria-hidden="true" />Live Inventory</MagneticButton></div>
    </div>
    </div>
    <div className="hero-type-mist" aria-hidden="true" />
    <div className="hero-kpis"><p className="hero-kpis-caption" id="hero-kpis-caption">STAR GARDEN · MADIKERI</p><dl aria-labelledby="hero-kpis-caption">{heroKpis(plotCount).map(([value, label]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></div>
    <div className="hero-bottom"><a href="#opportunities" className="scroll-cue"><span className="scroll-line" /><span>SCROLL TO DISCOVER</span></a><span className="hero-location"><span className="location-dot" />THE WESTERN GHATS, KARNATAKA</span></div>
    <MistTransition />
  </section></div>;
}
