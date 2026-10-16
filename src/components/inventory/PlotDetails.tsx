"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "framer-motion";
import { LuArrowUpRight, LuX } from "react-icons/lu";
import { whatsappUrl } from "@/data/contact";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { formatArea, statusLabels, type InventoryPlot, type PlotStatus } from "@/data/inventory";
import styles from "./inventory.module.css";

export function PlotDetails({ plot, status }: { plot: InventoryPlot; status: PlotStatus }) {
  return <>
    <div className={styles.detailHeading}><span className={styles.kicker}>YOUR PIECE OF THE PLAN</span><h2>Plot <em>{plot.id}</em></h2></div>
    <span className={styles.statusBadge} data-status={status}><i />{statusLabels[status]}</span>
    <div className={styles.plotArea}><strong>{formatArea(plot.areaSqFt)}</strong><span>sq ft · proposed plot area</span></div>
    <dl className={styles.facts}>
      <div><dt>Project</dt><dd>Star Gardens</dd></div>
      <div><dt>Location</dt><dd>Kedakal</dd></div>
      <div><dt>Availability</dt><dd>{statusLabels[status]}</dd></div>
      <div><dt>Price</dt><dd>On enquiry</dd></div>
      {plot.roadFrontageFt != null && <div><dt>Proposed road frontage</dt><dd>{plot.roadFrontageFt.toFixed(2)} ft</dd></div>}
    </dl>
    {plot.sideLengthsFt.length > 0 && <details className={styles.measurements}><summary>Boundary measurements <span>{plot.sideLengthsFt.length} sides</span></summary><ol>{plot.sideLengthsFt.map((length, index) => <li key={index}><span>Side {index + 1}</span><strong>{length.toFixed(2)} ft</strong></li>)}</ol><p>Numbered sides follow the PDF sketches. Dimensions are measured from the concept polygon; verify on site.</p></details>}
    <a className={styles.enquire} href={whatsappUrl(`Hello Star Managed Farmlands, I am interested in Plot ${plot.id} at Star Gardens, Kedakal (${formatArea(plot.areaSqFt)} sq ft in concept revision 04). Please confirm its actual availability, price and final measurements.`)} target="_blank" rel="noopener noreferrer">Enquire about {plot.id}<LuArrowUpRight aria-hidden="true" /></a>
    <p className={styles.detailNote}>Proposed layout, revision 04. Final boundaries, road levels and approvals must be verified.</p>
  </>;
}

export function PlotDrawer({ plot, status, onClose }: { plot: InventoryPlot; status: PlotStatus; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const desktop = useMediaQuery("(min-width: 1024px)");
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    const background = Array.from(document.querySelectorAll<HTMLElement>("main, .site-header, footer"), element => ({ element, inert: element.inert }));
    background.forEach(({ element }) => { element.inert = true; });
    document.body.style.overflow = "hidden";
    ref.current?.querySelector<HTMLButtonElement>("button")?.focus({ preventScroll: true });
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab") return;
      const items = ref.current?.querySelectorAll<HTMLElement>("button,a,summary");
      if (!items?.length) return;
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("keydown", key);
      document.body.style.overflow = overflow;
      background.forEach(({ element, inert }) => { element.inert = inert; });
      // Resizing can replace the SVG trigger with the desktop canvas while
      // details are open. Restore focus to the persistent picker in that case.
      const target = previous?.isConnected && previous.getClientRects().length
        ? previous
        : document.querySelector<HTMLElement>('select[aria-label="Find a plot"]');
      target?.focus({ preventScroll: true });
    };
  }, [onClose]);
  return createPortal(<motion.div className={styles.drawerBackdrop} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} onClick={onClose}>
    <motion.div ref={ref} role="dialog" aria-modal="true" aria-label={`Plot ${plot.id} details`} className={styles.drawer} data-lenis-prevent onClick={event => event.stopPropagation()} initial={{ y: reduced ? 0 : desktop ? 16 : "100%", scale: desktop && !reduced ? 0.97 : 1 }} animate={{ y: 0, scale: 1 }} exit={{ y: reduced ? 0 : desktop ? 12 : "100%", scale: desktop && !reduced ? 0.97 : 1 }} transition={{ duration: reduced ? 0.12 : 0.35, ease: [0.16, 1, 0.3, 1] }}>
      <div className={styles.drawerHandle} /><button className={styles.drawerClose} onClick={onClose} aria-label="Close plot details"><LuX /></button>
      <PlotDetails plot={plot} status={status} />
    </motion.div>
  </motion.div>, document.body);
}
