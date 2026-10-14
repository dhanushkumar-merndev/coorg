"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { LuBox, LuLayers, LuMinus, LuPlus, LuRotateCcw, LuSearch } from "react-icons/lu";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { formatArea, getDisplayStatuses, plan, plots, recordDemoVisit, statusLabels } from "@/data/inventory";
import { PlotDrawer } from "./PlotDetails";
import PlotPlan from "./PlotPlan";
import LiveIndicator from "./LiveIndicator";
import styles from "./inventory.module.css";

const InventoryScene = dynamic(() => import("./InventoryScene"), { ssr: false, loading: () => <div className={styles.sceneLoading} role="status">Preparing your perspective…</div> });

export default function InventoryExplorer() {
  const desktop = useMediaQuery("(min-width: 1024px) and (pointer: fine)");
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [view, setView] = useState<"3d" | "plan" | null>(null);
  const [failed, setFailed] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [partialId, setPartialId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [resetKey, setResetKey] = useState(0);
  const visit = useRef<{ partialId: string | null } | null>(null);
  const show3d = desktop && !reduced && !failed && view !== "plan";
  const statuses = useMemo(() => getDisplayStatuses(true, partialId), [partialId]);
  const selected = plots.find(plot => plot.id === selectedId);
  const preview = plots.find(plot => plot.id === hoveredId);
  const closeDrawer = useCallback(() => setSelectedId(null), []);
  const onError = useCallback(() => setFailed(true), []);
  const onSelect = useCallback((id: string) => { setSelectedId(id); setHoveredId(null); }, []);
  useEffect(() => {
    // A microtask avoids changing server-rendered status colours during hydration.
    let cancelled = false;
    if (!visit.current) {
      let id: string | null = null;
      try { id = recordDemoVisit(window.localStorage); } catch { /* Storage may be denied by the browser. */ }
      visit.current = { partialId: id };
    }
    const id = visit.current.partialId;
    queueMicrotask(() => { if (!cancelled) setPartialId(id); });
    return () => { cancelled = true; };
  }, []);
  const reset = () => { setZoom(1); setResetKey(key => key + 1); setHoveredId(null); };

  return <section className={styles.explorer} aria-label="Star Gardens inventory explorer">
    <div className={styles.workspace}>
      <div className={styles.mapViewport} data-inventory-view={show3d ? "3d" : "plan"}>
        <div className={styles.mapToolbar}>
          <div className={styles.viewTabs} aria-label="Plan view">
            <button type="button" aria-pressed={!show3d} onClick={() => { setView("plan"); reset(); }}><LuLayers aria-hidden="true" />2D plan</button>
            {desktop && !reduced && !failed && <button type="button" aria-pressed={show3d} onClick={() => { setView("3d"); reset(); }}><LuBox aria-hidden="true" />3D view</button>}
          </div>
          <div className={styles.mapActions}><LiveIndicator /><label className={styles.plotPicker}><LuSearch aria-hidden="true" /><select aria-label="Find a plot" value="" onChange={event => { if (event.target.value) onSelect(event.target.value); }}><option value="" disabled>Find a plot</option>{plots.map(plot => <option value={plot.id} key={plot.id}>{plot.id} · {formatArea(plot.areaSqFt)} sq ft</option>)}</select></label></div>
        </div>
        {!show3d && <div className={styles.compass} aria-label="North toward the top of the plan"><span>N</span><svg width="22" height="32" viewBox="0 0 22 32" aria-hidden="true"><path d="M11 2 19 27 11 22 3 27Z" fill="none" stroke="currentColor" /><path d="M11 2V22L3 27Z" fill="currentColor" /></svg></div>}
        <div className={styles.mapSurface}>
          {show3d ? <InventoryScene plots={plots} boundary={plan.boundary} roads={plan.roads} viewBox={plan.viewBox} statuses={statuses} selectedId={selectedId} hoveredId={hoveredId} onSelect={onSelect} onHover={setHoveredId} onError={onError} resetKey={resetKey} zoom={zoom} /> : <PlotPlan key={resetKey} statuses={statuses} selectedId={selectedId} hoveredId={hoveredId} onSelect={onSelect} onHover={setHoveredId} zoom={zoom} />}
        </div>
        {desktop && preview && !selected && <div className={styles.hoverCard} data-plot-hover={preview.id}><strong>{preview.id}</strong><span>{formatArea(preview.areaSqFt)} sq ft</span><small>{statusLabels[statuses[preview.id]]}</small></div>}
        <div className={styles.mapControls}><button type="button" onClick={() => setZoom(value => Math.min(2.8, value + 0.25))} disabled={zoom >= 2.8} aria-label="Zoom in"><LuPlus /></button><button type="button" onClick={() => setZoom(value => Math.max(0.75, value - 0.25))} disabled={zoom <= 0.75} aria-label="Zoom out"><LuMinus /></button><button type="button" onClick={reset} aria-label="Reset view"><LuRotateCcw /></button></div>
        <div className={styles.mapHint}>{failed ? "3D unavailable · interactive 2D plan" : show3d ? "Drag to explore · click a plot" : zoom > 1 ? "Drag to move · tap a plot" : "Tap a plot to explore"}</div>
      </div>
      <div className={styles.legend} aria-label="Plot status legend">{["available", "sold", "partial"].map(status => <span key={status} data-status={status}><i />{status === "available" ? "Available" : status === "sold" ? "Sold out" : "Partially booked"}<b>{Object.values(statuses).filter(value => value === status).length}</b></span>)}<small>Demo availability</small></div>
    </div>
    <AnimatePresence>{selected && <PlotDrawer key={selected.id} plot={selected} status={statuses[selected.id]} onClose={closeDrawer} />}</AnimatePresence>
  </section>;
}
