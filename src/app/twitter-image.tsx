import { createShareImage } from "@/lib/og-image";

export const alt = "Land in Coorg — Where the mist settles, your land begins.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function TwitterImage() {
  return createShareImage();
}
