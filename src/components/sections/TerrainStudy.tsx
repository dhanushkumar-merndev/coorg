"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LuArrowLeft, LuArrowRight } from "react-icons/lu";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { kodaguTerrain as dem } from "@/data/kodagu-terrain";
import styles from "./terrain.module.css";

const TerrainCanvas = dynamic(() => import("./TerrainCanvas"), { ssr: false });
const EXAGGERATION = 4.5;
const metres = (value: number) => `${value.toLocaleString("en-IN")} m`;
const { north, south, east, west } = dem.bounds;

class TerrainBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}

export function TerrainStudy() {
  const frame = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const compass = useRef<HTMLSpanElement>(null);
  const readout = useRef<HTMLSpanElement>(null);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const coarse = useMediaQuery("(pointer: coarse)");
  const [state, setState] = useState({ seen: false, inView: false, webgl: false, visible: true });
  const [ready, setReady] = useState(false);
  const [turn, setTurn] = useState(0);
  const onReady = useCallback(() => setReady(true), []);
  // The canvas reports heading and elevation; this component owns the DOM it writes to.
  const setHeading = useCallback((degrees: number) => {
    if (compass.current) compass.current.style.transform = `rotate(${degrees.toFixed(2)}deg)`;
  }, []);
  const setElevation = useCallback((value: number | null) => {
    const element = readout.current;
    if (!element) return;
    element.dataset.visible = String(value !== null);
    if (value !== null) element.textContent = `≈ ${value.toLocaleString("en-IN")} m`;
  }, []);

  useEffect(() => {
    if (!frame.current) return;
    let supported = false;
    let checked = false;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !checked) {
        checked = true;
        const probe = document.createElement("canvas");
        const gl = probe.getContext("webgl2");
        supported = Boolean(gl);
        gl?.getExtension("WEBGL_lose_context")?.loseContext();
      }
      setState((previous) => ({ seen: previous.seen || entry.isIntersecting, inView: entry.isIntersecting, webgl: supported, visible: !document.hidden }));
    }, { rootMargin: "200px 0px" });
    const visibility = () => setState((previous) => ({ ...previous, visible: !document.hidden }));
    observer.observe(frame.current);
    document.addEventListener("visibilitychange", visibility);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", visibility); };
  }, []);

  // GSAP only measures scroll; the WebGL camera reads this value on its own frame.
  useEffect(() => {
    if (!frame.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const trigger = ScrollTrigger.create({
      trigger: frame.current,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => { progress.current = self.progress; },
    });
    return () => trigger.kill();
  }, []);

  const showCanvas = state.seen && state.webgl;
  return <>
    <div ref={frame} className={styles.study} data-ready={ready && showCanvas}>
      <div className={styles.stage} role="img" aria-label={`Three-dimensional model of real elevation in Kodagu, Western Ghats, from ${metres(dem.minMetres)} to ${metres(dem.maxMetres)} across roughly ${Math.round(dem.widthKm)} by ${Math.round(dem.heightKm)} kilometres. Not a property map.`}>
        <div className={styles.relief} aria-hidden="true">
          <Image src={dem.reliefImage} alt="" fill sizes="(max-width: 700px) 100vw, 900px" />
        </div>
        {showCanvas && <div className={styles.canvas}>
          <TerrainBoundary>
            <TerrainCanvas active={state.inView && state.visible} reduced={reduced} coarse={coarse} turn={turn} exaggeration={EXAGGERATION} progress={progress} onHeading={setHeading} onElevation={setElevation} onReady={onReady} />
          </TerrainBoundary>
        </div>}
      </div>

      <div className={styles.copy} data-editorial-reveal>
        <p className={styles.label}>Landscape study <i aria-hidden="true" /> Real elevation</p>
        <p className={styles.title}>A different<br /><em>perspective.</em></p>
        <p className={styles.caption}>Kodagu, in the Western Ghats. West of the Coorg plateau the land falls away into deep valleys, where the mist settles.</p>
      </div>

      <div className={styles.orientation} data-editorial-reveal>
        <span>{south.toFixed(2)}°–{north.toFixed(2)}° N<br />{west.toFixed(2)}°–{east.toFixed(2)}° E</span>
        <span className={styles.compass} aria-hidden="true"><span ref={compass} className={styles.rose}><b>N</b><i /></span></span>
      </div>

      <div className={styles.legend} data-editorial-reveal>
        <span ref={readout} className={styles.readout} data-visible="false" aria-hidden="true" />
        <span className={styles.ramp} aria-hidden="true" />
        <span className={styles.rampLabels}><span>{metres(dem.minMetres)}</span><span>{metres(dem.maxMetres)}</span></span>
        <span className={styles.facts}>Contours 100 m <i aria-hidden="true" /> Vertical scale ×{EXAGGERATION} <i aria-hidden="true" /> ≈ {Math.round(dem.widthKm)} × {Math.round(dem.heightKm)} km</span>
      </div>

      {showCanvas && <div className={styles.controls}>
        <span>{coarse ? "Swipe to turn" : "Drag to explore"}</span>
        <button type="button" aria-label="Rotate terrain left" onClick={() => setTurn((value) => value - 1)}><LuArrowLeft size={18} aria-hidden="true" /></button>
        <button type="button" aria-label="Rotate terrain right" onClick={() => setTurn((value) => value + 1)}><LuArrowRight size={18} aria-hidden="true" /></button>
      </div>}
    </div>
    <p className={styles.credit}>Explore the shape of the landscape. This terrain study is not a survey, boundary or property map.</p>
  </>;
}
