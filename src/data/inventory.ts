import source from "./star-gardens-plan.json";

export type Point = [number, number];
export type PlotStatus = "unconfirmed" | "available" | "sold" | "partial";
export type InventoryPlot = {
  id: string;
  label: string;
  areaSqFt: number;
  points: Point[];
  centroid: Point;
  sideLengthsFt: number[];
  spanFt?: number;
  averageWidthFt?: number;
  roadFrontageFt?: number;
  status: null;
  price: null;
};

type SourcePlan = {
  viewBox: [number, number, number, number];
  boundary: Point[];
  roads: { points: Point[] }[];
  plots: Omit<InventoryPlot, "status" | "price">[];
};

// Geometry and printed dimensions come from the supplied concept PDF. They
// describe a proposed layout, not a surveyed/approved construction model.
export const plan = source as unknown as SourcePlan;
export const plots: InventoryPlot[] = plan.plots.map(plot => ({ ...plot, status: null, price: null }));
export const sourcePlanUrl = "/documents/star-gardens-master-plan.pdf";

export const statusLabels: Record<PlotStatus, string> = {
  unconfirmed: "To be confirmed",
  available: "Available · demo",
  sold: "Sold out · demo",
  partial: "Partially booked · demo",
};

export const statusColors: Record<PlotStatus, string> = {
  unconfirmed: "#a4b29a",
  available: "#95ad7d",
  sold: "#ba8070",
  partial: "#d4b066",
};

/** Sample visual states are separate from the factual records above. */
export function getDisplayStatuses(demo: boolean, partialId: string | null): Record<string, PlotStatus> {
  return Object.fromEntries(plots.map(plot => [plot.id,
    !demo ? "unconfirmed" : ["P12", "P28"].includes(plot.id) ? "sold" : plot.id === partialId ? "partial" : "available",
  ]));
}

const DEMO_STORAGE_KEY = "star-gardens-demo-visits-v1";
type VisitCycle = { visit: number; slot: number; partialId: string };

/** One random demo visit per ten visits in THIS browser, never live activity.
 * Keeping the cycle in session memory also prevents Strict Mode's second
 * effect from counting a visit twice. Each genuine page mount calls this once.
 */
export function recordDemoVisit(storage: Pick<Storage, "getItem" | "setItem">, random = Math.random): string | null {
  try {
    const raw = storage.getItem(DEMO_STORAGE_KEY);
    let parsed: Partial<VisitCycle> | null = null;
    try { parsed = raw ? JSON.parse(raw) : null; } catch { /* Reset a damaged demo cycle. */ }
    const valid = parsed && Number.isInteger(parsed.visit) && parsed.visit! >= 1 && parsed.visit! <= 10
      && Number.isInteger(parsed.slot) && parsed.slot! >= 1 && parsed.slot! <= 10
      && plots.some(plot => plot.id === parsed.partialId && !["P12", "P28"].includes(plot.id));
    const candidates = plots.filter(plot => !["P12", "P28"].includes(plot.id));
    const sample = () => Math.max(0, Math.min(0.999999, random()));
    const cycle: VisitCycle = !parsed || !valid || parsed.visit === 10
      ? { visit: 1, slot: 1 + Math.floor(sample() * 10), partialId: candidates[Math.floor(sample() * candidates.length)].id }
      : { visit: parsed.visit! + 1, slot: parsed.slot!, partialId: parsed.partialId! };
    storage.setItem(DEMO_STORAGE_KEY, JSON.stringify(cycle));
    return cycle.visit === cycle.slot ? cycle.partialId : null;
  } catch {
    // Storage denial/corruption never prevents access to the plan.
    return null;
  }
}

export const formatArea = (area: number) => new Intl.NumberFormat("en-IN").format(area);
