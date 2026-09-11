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

export default function CoorgHero() {
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
        const timeline = gsap.timeline({ scrollTrigger: { trigger: journey.current, start: "top top", end: "bottom bottom", scrub: true, invalidateOnRefresh: true } });
        timeline.to(progress.current, { progress: 1, ease: "none", duration: 1 }, 0)
          .to(".hero-heading-depth", { y: -125, scale: 1.12, opacity: 0.3, duration: 1 }, 0)
          .to(".hero-support", { opacity: 0, y: -70, duration: 0.65 }, 0)
          .to(".hero-landscape", { yPercent: -8, duration: 1, ease: "none" }, 0)
          .to(".hero-title-land", { xPercent: -7, yPercent: -22, duration: 1 }, 0)
          .to(".hero-title-coorg", { xPercent: 4, yPercent: 8, duration: 1 }, 0)
          .to("[data-hero-birds]", { yPercent: -18, opacity: 0, duration: 1 }, 0)
          .to(".hero-mist-transition", { opacity: 1, duration: 0.55 }, 0.45)
          .to(".hero-bottom", { opacity: 0, duration: 0.3 }, 0);
        return () => { progress.current.progress = 0; };
      });
      media.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } })
          .to(".hero-landscape, .hero-canvas", { yPercent: 10, scale: 1.08, duration: 1 }, 0)
          .to(".hero-heading-depth", { y: -45, duration: 1 }, 0)
          .to(".hero-mist-transition", { opacity: 1, duration: 0.6 }, 0.4);
      });
      return () => media.revert();
    }, root);
    return () => context.revert();
  }, []);

  return <div ref={journey} className="hero-journey" id="home"><section ref={root} className="coorg-hero" aria-label="Discover Land in Coorg">
    <div className="hero-landscape" aria-hidden="true"><Image src={heroImage} alt="" fill preload sizes="(max-aspect-ratio: 16/9) 178vh, 100vw" className="hero-photograph" /></div>
    <HeroCanvas state={progress} reduced={reduced} coarse={coarse} />
    <div className="hero-vignette" aria-hidden="true" />
    <div className="hero-initial-mist" aria-hidden="true" />
    <BirdFlock />
    <div className="hero-copy-layout">
    <div className="hero-heading-depth">
      <p className="hero-eyebrow eyebrow">LAND <span>·</span> ESTATES <span>·</span> PLANTATIONS <span>·</span> COORG</p>
      <h1 className="hero-title"><span className="hero-title-land"><span className="hero-copy-entry">LAND IN</span></span><span className="hero-title-coorg"><span className="hero-copy-entry">COORG</span></span></h1>
    </div>
    <div className="hero-support"><span className="hero-horizon-line" aria-hidden="true" /><p>Where the mist settles,<br className="mobile-break" /> your land begins.</p><div className="hero-actions"><MagneticButton href="/opportunities">Explore Opportunities</MagneticButton><MagneticButton href="/enquiry" variant="line">Enquire Privately</MagneticButton></div></div>
    </div>
    <div className="hero-type-mist" aria-hidden="true" />
    <div className="hero-bottom"><a href="#opportunities" className="scroll-cue"><span className="scroll-line" /><span>SCROLL TO DISCOVER</span></a><span className="hero-location"><span className="location-dot" />THE WESTERN GHATS, KARNATAKA</span></div>
    <MistTransition />
  </section></div>;
}
