"use client";

import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import styles from "./PageTransition.module.css";
import FogClouds from "./FogClouds";

type NavigationOptions = { replace?: boolean; scroll?: boolean };
type NavigationContext = { navigate: (href: string, options?: NavigationOptions) => boolean };
type Journey = {
  id: number;
  href: string;
  pathname: string;
  replace: boolean;
  scroll: boolean;
  phase: "covering" | "covered" | "revealing";
  reduced: boolean;
};

const TransitionContext = createContext<NavigationContext | null>(null);
export const usePageTransition = () => useContext(TransitionContext);

const announce = (name: string, detail?: object) => window.dispatchEvent(new CustomEvent(name, { detail }));
const twoFrames = () => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
const waitForHeroImage = () => {
  const image = document.querySelector<HTMLImageElement>("main [data-chapter-hero] img, main .hero-landscape img");
  if (!image || (image.complete && image.naturalWidth > 0)) return Promise.resolve();
  return new Promise<void>((resolve) => {
    const timer = setTimeout(resolve, 1000);
    image.decode().catch(() => undefined).finally(() => { clearTimeout(timer); resolve(); });
  });
};

/** A persistent cover: navigation happens only after the old page is obscured. */
export default function PageTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const veil = useRef<HTMLDivElement>(null);
  const journey = useRef<Journey | null>(null);
  const sequence = useRef(0);
  const animations = useRef<Animation[]>([]);
  const watchdog = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousPathname = useRef(pathname);
  const historyScroll = useRef<number | null>(null);
  const inertElements = useRef<Array<{ element: HTMLElement; wasInert: boolean }>>([]);

  const clearAnimations = useCallback(() => {
    animations.current.forEach((animation) => animation.cancel());
    animations.current = [];
  }, []);

  const finish = useCallback((id?: number) => {
    if (id !== undefined && journey.current?.id !== id) return;
    journey.current = null;
    if (watchdog.current) clearTimeout(watchdog.current);
    watchdog.current = null;
    clearAnimations();
    if (veil.current) veil.current.dataset.phase = "idle";
    delete document.documentElement.dataset.pageTransition;
    const dialogStillOpen = Boolean(document.querySelector('[role="dialog"]'));
    inertElements.current.forEach(({ element, wasInert }) => { element.inert = wasInert && dialogStillOpen; });
    inertElements.current = [];
    announce("coorg:page-transition-end");
  }, [clearAnimations]);

  const animateVeil = useCallback(async (direction: "cover" | "reveal", reduced: boolean) => {
    const root = veil.current;
    if (!root) return;
    clearAnimations();
    const cover = direction === "cover";
    const duration = reduced ? 140 : cover ? 850 : 900;
    const timing: KeyframeAnimationOptions = { duration, fill: "forwards", easing: "cubic-bezier(.22,.61,.36,1)" };
    const density = root.querySelector<HTMLElement>("[data-fog-density]");
    if (density) {
      animations.current.push(density.animate(cover ? [
        { opacity: 0, offset: 0 },
        { opacity: reduced ? 0.55 : 0.04, offset: 0.48 },
        { opacity: 1, offset: 1 },
      ] : [
        { opacity: 1, offset: 0 },
        { opacity: 0.18, offset: 0.48 },
        { opacity: 0, offset: 1 },
      ], timing));
    }
    root.querySelectorAll<HTMLElement>("[data-fog-bank]").forEach((bank, index) => {
      const sign = index % 2 === 0 ? 1 : -1;
      const from = reduced ? "none" : `translate3d(${sign * -24}%, ${8 + index * 3}%, 0) scale(1.06)`;
      const middle = reduced ? "none" : "translate3d(0, 0, 0) scale(1)";
      const to = reduced ? "none" : `translate3d(${sign * 22}%, ${-10 - index * 3}%, 0) scale(1.08)`;
      animations.current.push(bank.animate(cover ? [
        { opacity: 0, transform: from },
        { opacity: reduced ? 0 : 1, transform: middle },
      ] : [
        { opacity: reduced ? 0 : 1, transform: middle },
        { opacity: 0, transform: to },
      ], { ...timing, easing: "cubic-bezier(.25,.46,.45,.94)" }));
    });
    await Promise.all(animations.current.map((animation) => animation.finished.catch(() => undefined)));
  }, [clearAnimations]);

  const uncover = useCallback(async (current: Journey, committed: boolean) => {
    if (journey.current?.id !== current.id || current.phase === "revealing") return;
    current.phase = "revealing";
    if (watchdog.current) clearTimeout(watchdog.current);
    watchdog.current = null;

    // Wait for the new DOM and its layout effects, then reset Lenis under the fog.
    await twoFrames();
    if (journey.current?.id !== current.id) return;
    if (committed) {
      if (current.scroll) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      announce("coorg:route-scroll-sync", { top: current.scroll ? 0 : window.scrollY });
      await Promise.all([twoFrames(), waitForHeroImage()]);
      if (journey.current?.id !== current.id) return;
    }
    document.documentElement.dataset.pageTransition = "revealing";
    if (veil.current) veil.current.dataset.phase = "revealing";
    announce("coorg:page-reveal", { pathname: window.location.pathname });
    await animateVeil("reveal", current.reduced);
    if (journey.current?.id !== current.id) return;
    finish(current.id);
    if (committed) {
      const heading = document.querySelector<HTMLElement>("main h1") ?? document.querySelector<HTMLElement>("main");
      if (heading) {
        const hadTabIndex = heading.hasAttribute("tabindex");
        if (!hadTabIndex) heading.setAttribute("tabindex", "-1");
        heading.focus({ preventScroll: true });
        if (!hadTabIndex) heading.addEventListener("blur", () => heading.removeAttribute("tabindex"), { once: true });
      }
    }
  }, [animateVeil, finish]);

  const navigate = useCallback((href: string, options: NavigationOptions = {}) => {
    const destination = new URL(href, window.location.href);
    if (destination.origin !== window.location.origin || !["http:", "https:"].includes(destination.protocol)) return false;
    // Anchors and query-only changes retain normal Next/Lenis navigation semantics.
    if (destination.hash || destination.pathname === window.location.pathname) return false;
    if (journey.current) return true;
    window.history.replaceState({ ...window.history.state, coorgScrollY: window.scrollY }, "");

    const current: Journey = {
      id: ++sequence.current,
      href: `${destination.pathname}${destination.search}`,
      pathname: destination.pathname,
      replace: options.replace ?? false,
      scroll: options.scroll ?? true,
      phase: "covering",
      reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    };
    journey.current = current;
    inertElements.current = Array.from(document.querySelectorAll<HTMLElement>("main, header, footer, [role='dialog']"), (element) => {
      const wasInert = element.inert;
      element.inert = true;
      return { element, wasInert };
    });
    if (veil.current) veil.current.dataset.phase = "covering";
    document.documentElement.dataset.pageTransition = "covering";
    announce("coorg:page-transition-start", { pathname: current.pathname });
    void (async () => {
      await animateVeil("cover", current.reduced);
      if (journey.current?.id !== current.id) return;
      current.phase = "covered";
      document.documentElement.dataset.pageTransition = "covered";
      if (veil.current) veil.current.dataset.phase = "covered";
      // An interrupted/failed request must never leave a blocking curtain behind.
      watchdog.current = setTimeout(() => void uncover(current, false), 8000);
      try {
        if (current.replace) router.replace(current.href, { scroll: false });
        else router.push(current.href, { scroll: false });
      } catch {
        void uncover(current, false);
      }
    })();
    return true;
  }, [animateVeil, router, uncover]);

  useEffect(() => {
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;
    const current = journey.current;
    if (current?.phase === "covered" && current.pathname === pathname) {
      void uncover(current, true);
    } else {
      // Browser history, redirects, and ordinary links must not inherit a stale cover.
      finish();
      void twoFrames().then(() => {
        const top = historyScroll.current ?? window.scrollY;
        historyScroll.current = null;
        announce("coorg:route-scroll-sync", { top });
        announce("coorg:page-reveal", { pathname });
      });
    }
  }, [finish, pathname, uncover]);

  useEffect(() => {
    const preventScroll = (event: Event) => {
      if (journey.current && event.cancelable) event.preventDefault();
    };
    const preventScrollKey = (event: KeyboardEvent) => {
      if (journey.current && ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " ", "Tab"].includes(event.key)) event.preventDefault();
    };
    const historyNavigation = (event: PopStateEvent) => {
      historyScroll.current = typeof event.state?.coorgScrollY === "number" ? event.state.coorgScrollY : null;
      finish();
    };
    const restoreFromCache = (event: PageTransitionEvent) => { if (event.persisted) finish(); };
    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });
    window.addEventListener("keydown", preventScrollKey);
    window.addEventListener("popstate", historyNavigation);
    window.addEventListener("pageshow", restoreFromCache);
    return () => {
      finish();
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      window.removeEventListener("keydown", preventScrollKey);
      window.removeEventListener("popstate", historyNavigation);
      window.removeEventListener("pageshow", restoreFromCache);
    };
  }, [finish]);

  return <TransitionContext.Provider value={{ navigate }}>
    {children}
    <div ref={veil} className={styles.veil} data-phase="idle" data-page-fog aria-hidden="true" data-lenis-prevent>
      <div className={styles.density} data-fog-density />
      <FogClouds />
    </div>
  </TransitionContext.Provider>;
}
