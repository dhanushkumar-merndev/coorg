"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SmoothScroll() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({
      lerp: 0.095,
      smoothWheel: true,
      syncTouch: false,
      respectReducedMotion: true,
      anchors: { offset: -90 },
      prevent: (node) => node.hasAttribute("data-lenis-prevent"),
      virtualScroll: ({ event, deltaX, deltaY }) => !event.shiftKey && Math.abs(deltaY) >= Math.abs(deltaX),
    });
    const tick = (time: number) => lenis.raf(time * 1000);
    const update = () => ScrollTrigger.update();
    lenis.on("scroll", update);
    gsap.ticker.add(tick);

    // Modal/menu scroll locks also stop any in-flight smooth scroll momentum.
    const syncLock = () => {
      if (document.body.style.overflow === "hidden" || document.documentElement.hasAttribute("data-page-transition")) lenis.stop();
      else lenis.start();
    };
    const observer = new MutationObserver(syncLock);
    observer.observe(document.body, { attributes: true, attributeFilter: ["style"] });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-page-transition"] });
    const syncRoute = (event: Event) => {
      const top = (event as CustomEvent<{ top?: number }>).detail?.top ?? window.scrollY;
      lenis.resize();
      // A previous route's cached scroll value must not replace native Back/Forward restoration.
      ScrollTrigger.clearScrollMemory();
      ScrollTrigger.refresh();
      lenis.scrollTo(top, { immediate: true, force: true });
      ScrollTrigger.update();
      syncLock();
    };
    window.addEventListener("coorg:route-scroll-sync", syncRoute);
    window.addEventListener("coorg:page-transition-start", syncLock);
    window.addEventListener("coorg:page-transition-end", syncLock);
    const resize = () => lenis.resize();
    ScrollTrigger.addEventListener("refresh", resize);
    return () => {
      observer.disconnect();
      window.removeEventListener("coorg:route-scroll-sync", syncRoute);
      window.removeEventListener("coorg:page-transition-start", syncLock);
      window.removeEventListener("coorg:page-transition-end", syncLock);
      ScrollTrigger.removeEventListener("refresh", resize);
      gsap.ticker.remove(tick);
      lenis.off("scroll", update);
      lenis.destroy();
    };
  }, []);
  return null;
}
