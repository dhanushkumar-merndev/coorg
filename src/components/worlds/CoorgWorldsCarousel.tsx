"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent as ReactMouseEvent } from "react";
import { motion, type PanInfo } from "framer-motion";
import { LuArrowLeft, LuArrowRight, LuArrowLeftRight, LuArrowUpRight } from "react-icons/lu";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import RevealText from "@/components/ui/RevealText";
import { coorgWorlds } from "@/data/worlds";
import WorldCard from "./WorldCard";
import WorldDetail, { type CardRect } from "./WorldDetail";
import styles from "./worlds.module.css";

const wrap = (index: number) => (index + coorgWorlds.length) % coorgWorlds.length;

export default function CoorgWorldsCarousel() {
  const [selected, setSelected] = useState<{ index: number; rect: CardRect } | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(350);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const stageRef = useRef<HTMLDivElement>(null);
  const selectionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suppressClick = useRef(false);
  const dragResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wheelLastAt = useRef(0);
  const wheelAmount = useRef(0);

  const cancelSelection = useCallback(() => {
    if (selectionTimer.current) clearTimeout(selectionTimer.current);
    selectionTimer.current = null;
  }, []);

  const advance = useCallback((direction: number) => {
    cancelSelection();
    setActiveIndex((current) => wrap(current + direction));
  }, [cancelSelection]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new ResizeObserver(([entry]) => {
      setCardWidth(Math.min(350, Math.max(240, entry.contentRect.width * 0.76)));
    });
    observer.observe(stage);
    return () => {
      observer.disconnect();
      cancelSelection();
      if (dragResetTimer.current) clearTimeout(dragResetTimer.current);
    };
  }, [cancelSelection]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const onWheel = (event: WheelEvent) => {
      // A vertical wheel continues down the page. Horizontal gestures (or Shift+wheel)
      // are deliberate carousel input, and never capture ordinary native scrolling.
      const horizontalIntent = Math.abs(event.deltaX) > Math.abs(event.deltaY) || event.shiftKey;
      if (!horizontalIntent) return;
      const delta = event.shiftKey && Math.abs(event.deltaX) < 1 ? event.deltaY : event.deltaX;
      if (Math.abs(delta) < 2) return;
      event.preventDefault();
      const now = performance.now();
      if (now - wheelLastAt.current < 480) return;
      wheelAmount.current += delta;
      if (Math.abs(wheelAmount.current) > 38) {
        advance(wheelAmount.current > 0 ? 1 : -1);
        wheelLastAt.current = now;
        wheelAmount.current = 0;
      }
    };
    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => stage.removeEventListener("wheel", onWheel);
  }, [advance]);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    let nextIndex: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      nextIndex = wrap(activeIndex + (event.key === "ArrowRight" ? 1 : -1));
      advance(event.key === "ArrowRight" ? 1 : -1);
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      cancelSelection();
      nextIndex = event.key === "Home" ? 0 : coorgWorlds.length - 1;
      setActiveIndex(nextIndex);
    }
    if (nextIndex !== null && event.target instanceof HTMLElement && event.target.hasAttribute("data-world-id")) {
      stageRef.current?.querySelector<HTMLAnchorElement>(`[data-world-id="${coorgWorlds[nextIndex].id}"]`)?.focus({ preventScroll: true });
    }
  }

  function handleSelectWorld(index: number, event: ReactMouseEvent<HTMLAnchorElement>) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    if (suppressClick.current) return;
    cancelSelection();
    const openDetail = () => {
      const card = stageRef.current?.querySelector<HTMLElement>(`[data-world-id="${coorgWorlds[index].id}"]`);
      if (!card) return;
      card.focus({ preventScroll: true });
      const rect = card.getBoundingClientRect();
      setSelected({ index, rect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height } });
    };
    if (index !== activeIndex) {
      setActiveIndex(index);
      selectionTimer.current = setTimeout(openDetail, reducedMotion ? 0 : 550);
    } else {
      openDetail();
    }
  }

  function handleDragEnd(_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    if (dragResetTimer.current) clearTimeout(dragResetTimer.current);
    dragResetTimer.current = setTimeout(() => { suppressClick.current = false; }, 250);
    if (Math.abs(info.offset.x) > 45 || Math.abs(info.velocity.x) > 450) advance(info.offset.x < 0 ? 1 : -1);
  }

  return (
      <section id="opportunities" className={styles.worlds} aria-labelledby="worlds-heading">
        <RevealText className={styles.heading} scrollDriven>
          <span className={styles.eyebrow}>01 <span aria-hidden="true">/</span> FIVE WAYS TO BELONG</span>
          <h2 id="worlds-heading">Find your own kind of <em>quiet.</em></h2>
          <p>Different ways of living. One extraordinary landscape.</p>
        </RevealText>
        <div className={styles.carousel} onKeyDown={handleKeyDown} role="region" aria-roledescription="carousel" aria-label="Explore five Coorg worlds">
          <div className={styles.stage} ref={stageRef} style={{ "--card-width": `${cardWidth}px` } as CSSProperties}>
            <motion.div
              className={styles.arc}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.14}
              dragMomentum={false}
              onDragEnd={handleDragEnd}
              onDragStart={() => {
                cancelSelection();
                if (dragResetTimer.current) clearTimeout(dragResetTimer.current);
                // Suppress the release click before it reaches a card's link.
                suppressClick.current = true;
              }}
              style={{ touchAction: "pan-y", perspective: reducedMotion ? "none" : "1400px" }}
            >
              {coorgWorlds.map((world, index) => {
                let distance = index - activeIndex;
                const midpoint = Math.floor(coorgWorlds.length / 2);
                if (distance > midpoint) distance -= coorgWorlds.length;
                if (distance < -midpoint) distance += coorgWorlds.length;
                return <WorldCard key={world.id} world={world} index={index} distance={distance} width={cardWidth} reducedMotion={reducedMotion} selected={selected?.index === index} onSelect={(event) => handleSelectWorld(index, event)} />;
              })}
            </motion.div>
          </div>
          <div className={styles.carouselFooter}>
            <span className={styles.dragHint}><LuArrowLeftRight size={28} aria-hidden="true" /> DRAG TO DISCOVER</span>
            <div className={styles.pagination}>
              <button type="button" className={styles.arrowButton} aria-label="Previous Coorg world" onClick={() => advance(-1)}><LuArrowLeft size={23} aria-hidden="true" /></button>
              <div className={styles.counter} aria-hidden="true"><span>0{activeIndex + 1}</span><span className={styles.counterRule} /><span>{String(coorgWorlds.length).padStart(2, "0")}</span></div>
              <button type="button" className={styles.arrowButton} aria-label="Next Coorg world" onClick={() => advance(1)}><LuArrowRight size={23} aria-hidden="true" /></button>
            </div>
            <span className={styles.selectionHint}>A WORLD WAITING TO BE YOURS <LuArrowUpRight size={18} aria-hidden="true" /></span>
          </div>
          <p className={styles.srOnly} aria-live="polite" aria-atomic="true">{coorgWorlds[activeIndex].title}, {activeIndex + 1} of {coorgWorlds.length}. Select to explore.</p>
        </div>
        {selected && <WorldDetail world={coorgWorlds[selected.index]} origin={selected.rect} reduced={reducedMotion} returnRect={() => {
          const rect = stageRef.current?.querySelector<HTMLElement>(`[data-world-id="${coorgWorlds[selected.index].id}"]`)?.getBoundingClientRect();
          return rect ? { left: rect.left, top: rect.top, width: rect.width, height: rect.height } : selected.rect;
        }} onClosed={() => {
          const index = selected.index;
          setSelected(null);
          requestAnimationFrame(() => stageRef.current?.querySelector<HTMLElement>(`[data-world-id="${coorgWorlds[index].id}"]`)?.focus({ preventScroll: true }));
        }} />}
      </section>
  );
}
