"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { LuMinus, LuPlus, LuRotateCcw, LuSearch } from "react-icons/lu";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { formatArea, plan, plotStatuses as statuses, plots, statusCounts as legendCounts, statusLabels, type PlotStatus } from "@/data/inventory";
import { PlotDrawer } from "./PlotDetails";
import PlotPlan from "./PlotPlan";
import LiveIndicator from "./LiveIndicator";
import styles from "./inventory.module.css";

const InventoryScene = dynamic(() => import("./InventoryScene"), { ssr: false, loading: () => <div className={styles.sceneLoading} role="status">Preparing your perspective…</div> });

const legendOrder: PlotStatus[] = ["available", "booked", "sold"];
// Width the floating desktop legend covers on the right of the map, including
// its offset and breathing room, so the 3D model is fitted beside it.
const LEGEND_RESERVE = 280;
const MIN_ZOOM = 0.75, MAX_ZOOM = 2.8;
const clampZoom = (value: number) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));

export default function InventoryExplorer() {
  const desktop = useMediaQuery("(min-width: 1024px) and (pointer: fine)");
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [failed, setFailed] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [resetKey, setResetKey] = useState(0);
  const viewport = useRef<HTMLDivElement>(null);
  const show3d = desktop && !reduced && !failed;
  const selected = plots.find(plot => plot.id === selectedId);
  const preview = plots.find(plot => plot.id === hoveredId);
  const closeDrawer = useCallback(() => setSelectedId(null), []);
  const onError = useCallback(() => setFailed(true), []);
  const onSelect = useCallback((id: string) => { setSelectedId(id); setHoveredId(null); }, []);
  const reset = () => { setZoom(1); setResetKey(key => key + 1); setHoveredId(null); };

  useEffect(() => {
    const element = viewport.current;
    if (!element) return;
    // Ctrl/⌘ + wheel (and trackpad pinch, which browsers report as ctrl+wheel)
    // zooms the map instead of the page. A plain wheel still scrolls the page.
    const onWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      const delta = event.deltaMode === WheelEvent.DOM_DELTA_LINE ? event.deltaY * 33 : event.deltaY;
      setZoom(value => clampZoom(value * Math.exp(-delta * 0.002)));
    };
    element.addEventListener("wheel", onWheel, { passive: false });
    return () => element.removeEventListener("wheel", onWheel);
  }, []);

  return <section className={styles.explorer} aria-label="Star Gardens inventory explorer">
    <div className={styles.workspace}>
      <div ref={viewport} className={styles.mapViewport} data-inventory-view={show3d ? "3d" : "plan"}>
        <div className={styles.mapToolbar}>
          <div className={styles.mapActions}><LiveIndicator /><label className={styles.plotPicker}><LuSearch aria-hidden="true" /><select aria-label="Find a plot" value="" onChange={event => { if (event.target.value) onSelect(event.target.value); }}><option value="" disabled>Find a plot</option>{plots.map(plot => <option value={plot.id} key={plot.id}>{plot.id} · {formatArea(plot.areaSqFt)} sq ft</option>)}</select></label></div>
        </div>
        {!show3d && <div className={styles.compass} aria-label="North toward the top of the plan"><span>N</span><svg width="22" height="32" viewBox="0 0 22 32" aria-hidden="true"><path d="M11 2 19 27 11 22 3 27Z" fill="none" stroke="currentColor" /><path d="M11 2V22L3 27Z" fill="currentColor" /></svg></div>}
        <div className={styles.mapSurface}>
          {show3d ? <InventoryScene plots={plots} boundary={plan.boundary} roads={plan.roads} viewBox={plan.viewBox} statuses={statuses} selectedId={selectedId} hoveredId={hoveredId} onSelect={onSelect} onHover={setHoveredId} onError={onError} resetKey={resetKey} zoom={zoom} reserveRight={LEGEND_RESERVE} /> : <PlotPlan key={resetKey} statuses={statuses} selectedId={selectedId} hoveredId={hoveredId} onSelect={onSelect} onHover={setHoveredId} zoom={zoom} />}
        </div>
        {desktop && preview && !selected && <div className={styles.hoverCard} data-plot-hover={preview.id}><strong>{preview.id}</strong><span>{formatArea(preview.areaSqFt)} sq ft</span><small>{statusLabels[statuses[preview.id]]}</small></div>}
        <div className={styles.mapControls}><button type="button" onClick={() => setZoom(value => clampZoom(value + 0.25))} disabled={zoom >= MAX_ZOOM} aria-label="Zoom in"><LuPlus /></button><button type="button" onClick={() => setZoom(value => clampZoom(value - 0.25))} disabled={zoom <= MIN_ZOOM} aria-label="Zoom out"><LuMinus /></button><button type="button" onClick={reset} aria-label="Reset view"><LuRotateCcw /></button></div>
        <div className={styles.mapHint}>{failed ? "3D unavailable · interactive 2D plan" : show3d ? "Drag to explore · Ctrl + scroll to zoom · click a plot" : zoom > 1 ? "Drag to move · tap a plot" : "Tap a plot to explore"}</div>
      </div>
      <div className={styles.legend} role="group" aria-label="Plot status legend">
        <strong>Plot status</strong>
        {legendOrder.map(status => <span key={status} data-status={status}><i />{statusLabels[status]}<b>{legendCounts[status]}</b></span>)}
      </div>
    </div>
    <AnimatePresence>{selected && <PlotDrawer key={selected.id} plot={selected} status={statuses[selected.id]} onClose={closeDrawer} />}</AnimatePresence>
  </section>;
}
