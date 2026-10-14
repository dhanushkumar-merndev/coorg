"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LuArrowUpRight, LuX } from "react-icons/lu";
import { whatsappUrl } from "@/data/contact";
import styles from "./InventoryPrompts.module.css";

type Props = { paused: boolean; onSelect: (id: string) => void };

const suggestions = [
  { id: "P01", heading: "A little room to imagine.", copy: "Explore P01 — 8,702 sq ft in the proposed Star Gardens layout." },
  { id: "P29", heading: "Another perspective.", copy: "Take a closer look at P29 — 9,903 sq ft in the proposed layout." },
] as const;

export default function InventoryPrompts({ paused, onSelect }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLElement>(null);
  const focusInside = useRef(false);
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [delay, setDelay] = useState(10_000);
  const [inView, setInView] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const eligible = !paused && inView && tabVisible;
  const suggestion = suggestions[index];

  const restoreFocus = useCallback(() => {
    if (focusInside.current || card.current?.contains(document.activeElement)) {
      document.querySelector<HTMLSelectElement>('select[aria-label="Find a plot"]')?.focus({ preventScroll: true });
    }
    focusInside.current = false;
  }, []);

  const dismiss = useCallback((nextDelay: number) => {
    restoreFocus();
    setOpen(false);
    setIndex(value => (value + 1) % 3);
    setDelay(nextDelay);
  }, [restoreFocus]);

  useEffect(() => {
    const visibility = () => setTabVisible(!document.hidden);
    visibility();
    document.addEventListener("visibilitychange", visibility);
    const map = host.current?.closest("[data-inventory-view]") ?? host.current?.parentElement;
    const observer = new IntersectionObserver(entries => setInView(entries.some(entry => entry.isIntersecting)), { threshold: 0 });
    if (map) observer.observe(map);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", visibility); };
  }, []);

  useEffect(() => {
    if (!eligible) {
      let cancelled = false;
      queueMicrotask(() => { if (!cancelled) { restoreFocus(); setOpen(false); } });
      return () => { cancelled = true; };
    }
    if (open) return;
    let timer: ReturnType<typeof setTimeout>;
    const reveal = () => {
      // Other dialogs and route transitions get the same quiet waiting period.
      if (document.querySelector('[role="dialog"]') || document.documentElement.hasAttribute("data-page-transition")) {
        timer = setTimeout(reveal, delay);
        return;
      }
      setOpen(true);
    };
    timer = setTimeout(reveal, delay);
    return () => clearTimeout(timer);
  }, [eligible, open, delay, index, restoreFocus]);

  useEffect(() => {
    if (!open || !eligible) return;
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !card.current?.contains(event.target)) dismiss(10_000);
    };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") dismiss(30_000); };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape); };
  }, [open, eligible, dismiss]);

  return <div ref={host} className={styles.host}>
    {open && eligible && <aside ref={card} className={styles.card} role="region" aria-label="Plot suggestion" aria-live="polite" aria-atomic="true"
      onFocusCapture={() => { focusInside.current = true; }}
      onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) focusInside.current = false; }}>
      <button type="button" className={styles.close} aria-label="Dismiss plot suggestion" onClick={() => dismiss(30_000)}><LuX aria-hidden="true" /></button>
      <span className={styles.eyebrow}>{suggestion ? "EXPLORE THE PLAN" : "LET’S TALK LAND"}</span>
      <h3>{suggestion?.heading ?? "A question in mind?"}</h3>
      <p>{suggestion?.copy ?? "Ask our team about Star Gardens, plot details or arranging a visit."}</p>
      <div className={styles.actions}>
        {suggestion
          ? <button type="button" className={styles.primary} onClick={() => { dismiss(10_000); onSelect(suggestion.id); }}>View {suggestion.id}<LuArrowUpRight aria-hidden="true" /></button>
          : <a className={styles.primary} href={whatsappUrl("Hello Star Managed Farmlands, I would like to know more about Star Gardens, Kedakal. Please help me with plot details and actual availability.")} target="_blank" rel="noopener noreferrer" onClick={() => dismiss(10_000)}>Enquire privately<LuArrowUpRight aria-hidden="true" /></a>}
        <button type="button" className={styles.cancel} onClick={() => dismiss(30_000)}>Cancel</button>
      </div>
    </aside>}
  </div>;
}
