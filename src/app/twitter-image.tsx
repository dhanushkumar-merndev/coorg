import { createShareImage } from "@/lib/og-image";

export const alt = "Star Managed Farmlands — Thoughtful farmland. A life closer to nature.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function TwitterImage() {
  return createShareImage();
}
