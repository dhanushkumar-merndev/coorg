"use client";

import { Canvas } from "@react-three/fiber";
import { Component, Suspense, useCallback, useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import MountainScene, { type SceneProgress } from "./MountainScene";

function SceneReady({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    let second = 0;
    const first = requestAnimationFrame(() => { second = requestAnimationFrame(onReady); });
    return () => { cancelAnimationFrame(first); cancelAnimationFrame(second); };
  }, [onReady]);
  return null;
}

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function HeroCanvas({ state, reduced, coarse }: { state: RefObject<SceneProgress>; reduced: boolean; coarse: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);
  const [lost, setLost] = useState(false);
  const reveal = useCallback(() => { root.current?.classList.add("is-ready"); }, []);
  useEffect(() => {
    let visible = true;
    const update = () => setActive(visible && document.visibilityState === "visible");
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); }, { rootMargin: "120px" });
    if (root.current) observer.observe(root.current);
    document.addEventListener("visibilitychange", update);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", update); };
  }, []);
  return <div className={`hero-canvas${lost ? " is-lost" : ""}`} ref={root} aria-hidden="true">
    {!lost && <SceneBoundary><Canvas dpr={[1, coarse ? 1 : 1.35]} frameloop={active && !reduced ? "always" : "demand"}
      camera={{ position: [0, 0, 24], fov: 37, near: 0.1, far: 180 }} gl={{ alpha: true, antialias: !coarse, powerPreference: "low-power" }}
      onCreated={({ gl }) => { gl.setClearColor(0x000000, 0); gl.domElement.addEventListener("webglcontextlost", () => setLost(true), { once: true }); }} fallback={null}>
      <Suspense fallback={null}><MountainScene state={state} reduced={reduced} coarse={coarse} /><SceneReady onReady={reveal} /></Suspense>
    </Canvas></SceneBoundary>}
  </div>;
}
