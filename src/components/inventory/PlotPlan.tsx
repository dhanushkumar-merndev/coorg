"use client";

import { useRef, useState, type PointerEvent } from "react";
import { activePlotColor, plan, plots, statusColors, statusLabelColors, statusLabels, formatArea, type PlotStatus } from "@/data/inventory";
import styles from "./inventory.module.css";

type Props = {
  statuses: Record<string, PlotStatus>;
  selectedId: string | null;
  hoveredId: string | null;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
  zoom: number;
};

export default function PlotPlan({ statuses, selectedId, hoveredId, onSelect, onHover, zoom }: Props) {
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; panX: number; panY: number; moved: boolean } | null>(null);
  const svg = useRef<SVGSVGElement>(null);
  const [x, y, width, height] = plan.viewBox;
  const centerX = x + width / 2, centerY = y + height / 2;
  const points = (vertices: number[][]) => vertices.map(point => point.join(",")).join(" ");
  const start = (event: PointerEvent<SVGSVGElement>) => {
    drag.current = null;
    if (zoom <= 1) return;
    drag.current = { x: event.clientX, y: event.clientY, panX: pan.x, panY: pan.y, moved: false };
  };
  const move = (event: PointerEvent<SVGSVGElement>) => {
    if (!drag.current || !svg.current || !event.buttons) return;
    const deltaX = event.clientX - drag.current.x, deltaY = event.clientY - drag.current.y;
    if (Math.abs(deltaX) + Math.abs(deltaY) < 6) return;
    drag.current.moved = true;
    svg.current.setPointerCapture(event.pointerId);
    const rect = svg.current.getBoundingClientRect();
    const scale = Math.max(width / rect.width, height / rect.height) / zoom;
    const limitX = width * (1 - 1 / zoom) / 2, limitY = height * (1 - 1 / zoom) / 2;
    setPan({ x: Math.max(-limitX, Math.min(limitX, drag.current.panX + deltaX * scale)), y: Math.max(-limitY, Math.min(limitY, drag.current.panY + deltaY * scale)) });
  };
  return <svg ref={svg} className={styles.planSvg} viewBox={plan.viewBox.join(" ")} aria-label="Interactive Star Gardens plot plan" style={{ touchAction: zoom > 1 ? "none" : "pan-y" }} onPointerDown={start} onPointerMove={move} onPointerUp={event => { if (svg.current?.hasPointerCapture(event.pointerId)) svg.current.releasePointerCapture(event.pointerId); }} onPointerCancel={() => { drag.current = null; }}>
    <title>Star Gardens — proposed plot plan, revision 04</title>
    <defs><pattern id="inventory-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><path d="M0 0V6" stroke="#ffffff" strokeOpacity=".25" strokeWidth="1.8" /></pattern></defs>
    <g transform={`translate(${centerX} ${centerY}) scale(${zoom}) translate(${-centerX + (zoom > 1 ? pan.x : 0)} ${-centerY + (zoom > 1 ? pan.y : 0)})`}>
      <polygon points={points(plan.boundary)} fill="#d5dcc9" stroke="#65765c" strokeWidth="1.5" />
      {plan.roads.map((road, index) => <polygon key={index} points={points(road.points)} fill="#f8f4e9" stroke="#cecbb9" strokeWidth="0.6" />)}
      {plots.map((plot, index) => {
        const active = plot.id === selectedId || plot.id === hoveredId;
        const status = statuses[plot.id];
        return <g key={plot.id} data-plan-plot={plot.id} data-status={status} data-live={status === "available" && !active ? "" : undefined} role="button" tabIndex={0} aria-label={`Plot ${plot.id}, ${formatArea(plot.areaSqFt)} square feet, ${statusLabels[status]}`} aria-pressed={plot.id === selectedId} className={styles.svgPlot}
          onMouseEnter={() => onHover(plot.id)} onMouseLeave={() => onHover(null)}
          onClick={() => { if (!drag.current?.moved) onSelect(plot.id); drag.current = null; }}
          onKeyDown={event => {
            if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onSelect(plot.id); }
            if (["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(event.key)) {
              event.preventDefault();
              const direction = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
              const next = plots[(index + direction + plots.length) % plots.length];
              svg.current?.querySelector<SVGGElement>(`[data-plan-plot="${next.id}"]`)?.focus();
            }
          }}>
          <polygon points={points(plot.points)} fill={active ? activePlotColor : statusColors[status]} stroke={active ? "#c2a569" : "#f4f0e7"} strokeWidth={active ? 2.5 : 1.2} strokeLinejoin="round" />
          {status === "sold" && <polygon points={points(plot.points)} fill="url(#inventory-hatch)" pointerEvents="none" />}
          <text x={plot.centroid[0]} y={plot.centroid[1]} dy=".35em" textAnchor="middle" fill={active ? "#fffaf0" : statusLabelColors[status]} fontSize={Math.max(width, height) / 77} fontWeight="600" pointerEvents="none">{plot.id}</text>
        </g>;
      })}
    </g>
  </svg>;
}
