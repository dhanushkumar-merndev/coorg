"use client";

import { useEffect, useRef } from "react";
import styles from "./PageTransition.module.css";

const SIZE = 256;
let cloudTexture: HTMLCanvasElement | null = null;

/** Bake a small, deterministic cloud field once. Navigation only composites it. */
function createCloudTexture() {
  if (cloudTexture) return cloudTexture;
  const texture = document.createElement("canvas");
  texture.width = SIZE * 2;
  texture.height = SIZE;
  const context = texture.getContext("2d");
  if (!context) return texture;
  const pixels = context.createImageData(texture.width, texture.height);
  const grid = new Float32Array(128 * 128);
  let seed = 2749;
  for (let index = 0; index < grid.length; index++) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    grid[index] = seed / 4294967295;
  }
  const noise = (x: number, y: number) => {
    const ix = Math.floor(x), iy = Math.floor(y);
    const fx = x - ix, fy = y - iy;
    const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
    const a = grid[(iy & 127) * 128 + (ix & 127)];
    const b = grid[(iy & 127) * 128 + ((ix + 1) & 127)];
    const c = grid[((iy + 1) & 127) * 128 + (ix & 127)];
    const d = grid[((iy + 1) & 127) * 128 + ((ix + 1) & 127)];
    return (a + (b - a) * sx) * (1 - sy) + (c + (d - c) * sx) * sy;
  };
  for (let y = 0; y < texture.height; y++) {
    for (let x = 0; x < texture.width; x++) {
      const u = x / texture.width, v = y / texture.height;
      const warp = noise(u * 4 + 18, v * 3 + 7);
      let density = 0, weight = 0.55, frequency = 1;
      for (let octave = 0; octave < 5; octave++) {
        density += noise(u * 7 * frequency + warp * 1.8, v * 4 * frequency + warp) * weight;
        frequency *= 2.04;
        weight *= 0.48;
      }
      const edgeX = Math.min(1, Math.min(u, 1 - u) * 5);
      const edgeY = Math.min(1, Math.min(v, 1 - v) * 4);
      const envelope = edgeX * edgeX * (3 - 2 * edgeX) * edgeY * edgeY * (3 - 2 * edgeY);
      const alpha = Math.min(1, Math.max(0, (density - 0.24) * 2.9)) * envelope;
      const light = Math.min(1, density * 1.3);
      const index = (y * texture.width + x) * 4;
      pixels.data[index] = 191 + light * 53;
      pixels.data[index + 1] = 204 + light * 43;
      pixels.data[index + 2] = 190 + light * 48;
      pixels.data[index + 3] = alpha * 246;
    }
  }
  context.putImageData(pixels, 0, 0);
  cloudTexture = texture;
  return texture;
}

export default function FogClouds() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const texture = createCloudTexture();
    root.current?.querySelectorAll("canvas").forEach((canvas, index) => {
      const context = canvas.getContext("2d");
      if (!context) return;
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);
      if (index === 1) { context.translate(canvas.width, 0); context.scale(-1, 1); }
      if (index === 2) { context.translate(0, canvas.height); context.scale(1, -1); }
      context.drawImage(texture, 0, 0);
    });
  }, []);
  return <div ref={root} aria-hidden="true">
    {[styles.bankFar, styles.bankNear, styles.bankLow].map((position) => <canvas key={position} width={SIZE * 2} height={SIZE} className={`${styles.bank} ${position}`} data-fog-bank />)}
  </div>;
}
