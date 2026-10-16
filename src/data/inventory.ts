import source from "./star-gardens-plan.json";

export type Point = [number, number];
export type PlotStatus = "available" | "sold" | "booked";
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
  status: PlotStatus;
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

// Sales and bookings confirmed by the client; every other plot is available.
const SOLD_PLOTS = ["P02", "P03", "P04", "P05"];
const BOOKED_PLOTS = ["P23", "P24"];
const statusOf = (id: string): PlotStatus => SOLD_PLOTS.includes(id) ? "sold" : BOOKED_PLOTS.includes(id) ? "booked" : "available";

export const plots: InventoryPlot[] = plan.plots.map(plot => ({ ...plot, status: statusOf(plot.id), price: null }));
export const plotStatuses: Record<string, PlotStatus> = Object.fromEntries(plots.map(plot => [plot.id, plot.status]));
/** Plot totals by status; project copy reads these so it always matches the map. */
export const statusCounts = Object.fromEntries((["available", "booked", "sold"] as const)
  .map(status => [status, plots.filter(plot => plot.status === status).length])) as Record<PlotStatus, number>;
export const sourcePlanUrl = "/documents/star-gardens-master-plan.pdf";

export const statusLabels: Record<PlotStatus, string> = {
  available: "Available",
  sold: "Sold out",
  booked: "Booked",
};

export const statusColors: Record<PlotStatus, string> = {
  available: "#356b3c",
  sold: "#8e2420",
  booked: "#b8860b",
};

/** Plot-number colours that stay legible on each status fill. */
export const statusLabelColors: Record<PlotStatus, string> = {
  available: "#fbf7ea",
  sold: "#fbf7ea",
  booked: "#2b2410",
};

/** Fill for the hovered or selected plot in both the plan and the 3D view. */
export const activePlotColor = "#173427";

export const formatArea = (area: number) => new Intl.NumberFormat("en-IN").format(area);
