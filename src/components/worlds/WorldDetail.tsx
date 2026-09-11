"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { animate, motion, type Variants } from "framer-motion";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { LuArrowUpRight, LuX } from "react-icons/lu";
import TransitionLink from "@/components/navigation/TransitionLink";
import type { CoorgWorld } from "@/data/worlds";
import styles from "./WorldDetail.module.css";

export type CardRect = { left: number; top: number; width: number; height: number };

type Props = {
  world: CoorgWorld;
  origin: CardRect;
  reduced: boolean;
  returnRect: () => CardRect;
  onClosed: () => void;
};

type Corners = [number, number, number, number];
type Bezier = [number, number, number, number];

const RADIUS = 10;
const OPEN_EASE: Bezier = [0.22, 1, 0.36, 1];
const CLOSE_EASE: Bezier = [0.45, 0, 0.15, 1];
const REVEAL_EASE: Bezier = [0.16, 1, 0.3, 1];
const OPEN_PAPER = "inset(0% 0% 0% 0%)";
// On close the panel folds away first; the image leaves once it has gone.
const PANEL_EXIT = 0.3;
const lerp = (from: number, to: number, progress: number) => from + (to - from) * progress;

const rise: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: REVEAL_EASE } },
  exit: { opacity: 0, y: 6, transition: { duration: 0.18, ease: "easeIn" } },
};
const fade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.12 } },
};

export default function WorldDetail({ world, origin, reduced, returnRect, onClosed }: Props) {
  const dialog = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const picture = useRef<HTMLDivElement>(null);
  const lettering = useRef<HTMLDivElement>(null);
  const flight = useRef<ReturnType<typeof animate> | null>(null);
  const progress = useRef(0);
  const cardRadius = useRef(RADIUS);
  const [closing, setClosing] = useState(false);
  const [destination, setDestination] = useState(origin);
  const [landed, setLanded] = useState(reduced);
  const [sharp, setSharp] = useState(false);
  // The card has already decoded this exact file, so the flight never starts blank.
  const [cardImage] = useState(() => document.querySelector<HTMLImageElement>(`[data-world-id="${world.id}"] img`)?.currentSrc ?? "");
  const [viewport, setViewport] = useState(() => ({ width: innerWidth, height: innerHeight }));
  const compact = viewport.width < 760;
  const width = Math.min(1170, viewport.width - (compact ? 28 : 80));
  const height = Math.min(compact ? 850 : 730, viewport.height - (compact ? 28 : 80));
  const left = (viewport.width - width) / 2;
  const top = (viewport.height - height) / 2;
  const imageWidth = compact ? width : Math.round(width / 2);
  const imageHeight = compact ? Math.round(Math.min(340, height * 0.42)) : height;
  const hiddenPaper = compact ? "inset(0% 0% 100% 0%)" : "inset(0% 100% 0% 0%)";
  const panelOpen = landed && !closing;
  const geometry = useRef({ left, top, imageWidth, imageHeight, corners: [RADIUS, 0, 0, RADIUS] as Corners });

  useLayoutEffect(() => {
    // Only the outer corners of the dialog stay rounded; the seam with the paper is square.
    geometry.current = { left, top, imageWidth, imageHeight, corners: compact ? [RADIUS, RADIUS, 0, 0] : [RADIUS, 0, 0, RADIUS] };
  });

  // One progress value drives the whole flight. The clipping box may scale unevenly,
  // but the photograph inside keeps a single cover scale, so it never stretches.
  const paint = useCallback((value: number, card: CardRect) => {
    const box = frame.current;
    const photo = picture.current;
    if (!box || !photo) return;
    progress.current = value;
    const target = geometry.current;
    const scaleX = lerp(card.width, target.imageWidth, value) / target.imageWidth;
    const scaleY = lerp(card.height, target.imageHeight, value) / target.imageHeight;
    const cover = Math.max(scaleX, scaleY);
    const x = lerp(card.left, target.left, value) - target.left;
    const y = lerp(card.top, target.top, value) - target.top;
    box.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scaleX}, ${scaleY})`;
    photo.style.transform = `scale(${cover / scaleX}, ${cover / scaleY})`;
    const radii = target.corners.map((corner) => lerp(cardRadius.current, corner, value));
    box.style.borderRadius = `${radii.map((radius) => `${radius / scaleX}px`).join(" ")} / ${radii.map((radius) => `${radius / scaleY}px`).join(" ")}`;
    // The card's lettering rides on the image: it dissolves as the image leaves the card
    // and returns as it lands, so it never waits at the card as an empty placeholder.
    const letters = lettering.current;
    if (letters) {
      const fade = 1 - Math.min(1, value / 0.3);
      letters.style.opacity = String(fade);
      if (fade > 0) {
        const shiftX = lerp(card.left, target.left, value) - card.left;
        const shiftY = lerp(card.top, target.top, value) - card.top;
        const growX = lerp(card.width, target.imageWidth, value) / card.width;
        const growY = lerp(card.height, target.imageHeight, value) / card.height;
        letters.style.transform = `translate3d(${shiftX}px, ${shiftY}px, 0) scale(${growX}, ${growY})`;
      }
    }
  }, []);

  const placeLettering = useCallback((card: CardRect) => {
    const element = lettering.current;
    if (!element) return;
    Object.assign(element.style, { left: `${card.left}px`, top: `${card.top}px`, width: `${card.width}px`, height: `${card.height}px` });
  }, []);

  useLayoutEffect(() => {
    const card = document.querySelector<HTMLElement>(`[data-world-id="${world.id}"]`);
    if (card && lettering.current) {
      cardRadius.current = parseFloat(getComputedStyle(card).borderTopLeftRadius) || RADIUS;
      const copy = card.cloneNode(true) as HTMLElement;
      copy.querySelectorAll("img").forEach((image) => image.remove());
      copy.querySelectorAll("[id]").forEach((node) => node.removeAttribute("id"));
      ["href", "id", "data-world-id", "aria-label", "aria-haspopup"].forEach((name) => copy.removeAttribute(name));
      Object.assign(copy.style, { background: "transparent", boxShadow: "none" });
      lettering.current.replaceChildren(copy);
    }
    placeLettering(origin);
    if (reduced) {
      paint(1, origin);
      return;
    }
    paint(0, origin);
    flight.current = animate(0, 1, { duration: 0.72, ease: OPEN_EASE, onUpdate: (value) => paint(value, origin), onComplete: () => setLanded(true) });
    return () => flight.current?.stop();
  }, [origin, paint, placeLettering, reduced, world.id]);

  const closedHandler = useRef(onClosed);
  useEffect(() => { closedHandler.current = onClosed; });

  useLayoutEffect(() => {
    if (!closing) return;
    flight.current?.stop();
    placeLettering(destination);
    if (reduced) {
      const timer = setTimeout(() => closedHandler.current(), 160);
      return () => clearTimeout(timer);
    }
    // Closed before landing: there is no panel to fold, so return straight away.
    const start = progress.current;
    flight.current = animate(start, 0, {
      delay: landed ? PANEL_EXIT : 0,
      duration: 0.35 + 0.3 * start,
      ease: CLOSE_EASE,
      onUpdate: (value) => paint(value, destination),
      onComplete: () => closedHandler.current(),
    });
    return () => flight.current?.stop();
  }, [closing, destination, landed, paint, placeLettering, reduced]);

  useLayoutEffect(() => {
    if (landed && !closing) paint(1, origin);
  }, [compact, width, height, landed, closing, origin, paint]);

  const close = () => {
    if (closing) return;
    setDestination(returnRect());
    setClosing(true);
  };
  const closeRef = useRef(close);
  useEffect(() => { closeRef.current = close; });

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    const scrollbar = innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    const siblings = Array.from(document.querySelectorAll<HTMLElement>("main, header, footer"), (element) => ({ element, inert: element.inert }));
    siblings.forEach(({ element }) => { element.inert = true; });
    closeButton.current?.focus({ preventScroll: true });
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); closeRef.current(); }
      if (event.key !== "Tab") return;
      const items = dialog.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex="0"]');
      if (!items?.length) return;
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    const resize = () => setViewport({ width: innerWidth, height: innerHeight });
    window.addEventListener("keydown", keydown);
    window.addEventListener("resize", resize);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
      siblings.forEach(({ element, inert }) => { element.inert = inert; });
      window.removeEventListener("keydown", keydown);
      window.removeEventListener("resize", resize);
      // A fog route owns focus when leaving this dialog for another page.
      if (!document.documentElement.dataset.pageTransition) previousFocus?.focus({ preventScroll: true });
    };
  }, []);

  const panel = compact
    ? { left: 0, top: imageHeight, width, height: height - imageHeight }
    : { left: imageWidth, top: 0, width: width - imageWidth, height };
  const paperRadius = compact ? `0 0 ${RADIUS}px ${RADIUS}px` : `0 ${RADIUS}px ${RADIUS}px 0`;
  const items = reduced ? fade : rise;

  return createPortal(<div className={styles.overlay} data-lenis-prevent>
    <motion.div
      className={styles.scrim}
      initial={{ opacity: 0 }}
      animate={{ opacity: closing ? 0 : 1 }}
      transition={{ duration: reduced ? 0.12 : closing ? 0.6 : 0.5, delay: closing && landed && !reduced ? PANEL_EXIT : 0, ease: [0.4, 0, 0.2, 1] }}
      onClick={close}
      aria-hidden="true"
    />
    <div ref={dialog} role="dialog" aria-modal="true" aria-labelledby="world-detail-title" className={styles.dialog} style={{ left, top, width, height }}>
      {/* The panel unfolds from the image edge only once the image has landed. */}
      <motion.div
        className={styles.paper}
        style={{ ...panel, borderRadius: paperRadius }}
        initial={{ clipPath: hiddenPaper }}
        animate={{ clipPath: panelOpen ? OPEN_PAPER : hiddenPaper }}
        transition={reduced ? { duration: 0.12 } : closing ? { duration: PANEL_EXIT, ease: [0.55, 0, 0.75, 0.2] } : { duration: 0.8, ease: REVEAL_EASE }}
      />
      <div ref={frame} className={styles.image} style={{ width: imageWidth, height: imageHeight }} data-landed={panelOpen}>
        <div ref={picture} className={styles.picture}>
          {cardImage && !sharp && (
            // eslint-disable-next-line @next/next/no-img-element -- reuses the card's decoded source for the first frame of the flight
            <img src={cardImage} alt="" className={styles.photo} draggable={false} />
          )}
          <Image src={world.image} alt={world.imageAlt} fill sizes="(max-width: 759px) 100vw, 600px" className={styles.photo} style={{ opacity: sharp || !cardImage ? 1 : 0 }} onLoad={() => setSharp(true)} />
        </div>
      </div>
      <motion.div
        className={styles.copy}
        style={panel}
        initial="hidden"
        animate={closing ? "exit" : landed ? "show" : "hidden"}
        variants={{ hidden: {}, show: { transition: { delayChildren: reduced ? 0 : 0.16, staggerChildren: reduced ? 0 : 0.06 } }, exit: {} }}
        data-lenis-prevent
      >
        <motion.p variants={items} className={styles.eyebrow}>A Coorg world <i aria-hidden="true" /> {world.title}</motion.p>
        <motion.h2 variants={items} id="world-detail-title">{world.introduction}</motion.h2>
        <motion.p variants={items} className={styles.line}>{world.line}</motion.p>
        <motion.p variants={items} className={styles.description}>{world.description}</motion.p>
        <motion.div variants={items} className={styles.considerations}>
          <span>A CONVERSATION AROUND</span>
          <ul>{world.considerations.map((item) => <li key={item}>{item}</li>)}</ul>
        </motion.div>
        <motion.div variants={items}>
          <TransitionLink href="/enquiry" className={styles.cta}>Enquire about this world <LuArrowUpRight size={19} aria-hidden="true" /></TransitionLink>
        </motion.div>
        <motion.p variants={items} className={styles.disclosure}>An editorial category. Individual opportunities and their details are shared after confirmation.</motion.p>
      </motion.div>
      <motion.button
        ref={closeButton}
        className={styles.close}
        type="button"
        onClick={close}
        aria-label="Close world details"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: panelOpen ? 1 : 0, scale: panelOpen ? 1 : 0.92 }}
        transition={{ duration: closing ? 0.15 : 0.45, delay: panelOpen && !reduced ? 0.35 : 0 }}
      >
        <LuX size={18} aria-hidden="true" />
      </motion.button>
      <div ref={lettering} className={styles.lettering} aria-hidden="true" inert />
    </div>
  </div>, document.body);
}
