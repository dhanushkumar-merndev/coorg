"use client";

import { Component, useEffect, useLayoutEffect, useMemo, useRef, useState, type ComponentRef, type ReactNode } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { activePlotColor, statusColors, statusLabelColors, type InventoryPlot, type PlotStatus, type Point } from "@/data/inventory";

type InventorySceneProps = {
  plots: InventoryPlot[];
  boundary: Point[];
  roads: { points: Point[] }[];
  viewBox: [number, number, number, number];
  statuses: Record<string, PlotStatus>;
  selectedId: string | null;
  hoveredId: string | null;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
  onError: () => void;
  resetKey: number;
  zoom: number;
  /** Pixels on the right of the canvas covered by the floating legend. */
  reserveRight: number;
};

const PLOT_HEIGHT = 0.13;
const CAMERA_POSITION = new THREE.Vector3(24, 25, 11);
const CAMERA_TARGET = new THREE.Vector3(0, 0, 0);
const BASE_HEIGHT = 0.32;
// Screen space kept clear for the toolbar above and the hint/controls below.
const FIT_PADDING = { side: 40, top: 96, bottom: 64 };
const PULSE_PERIOD = 2.4;

type ModelPlot = {
  id: string;
  label: string;
  points: Point[];
  centroid: Point;
  firstVertex: number;
  vertexCount: number;
};

/** PDF y grows down the page; positive world z therefore points south. */
function polygonShape(points: Point[]) {
  const shape = new THREE.Shape();
  points.forEach(([x, z], index) => {
    if (index === 0) shape.moveTo(x, -z);
    else shape.lineTo(x, -z);
  });
  shape.closePath();
  return shape;
}

function raisedPolygon(points: Point[], height: number) {
  const geometry = new THREE.ExtrudeGeometry(polygonShape(points), {
    depth: height,
    bevelEnabled: false,
    steps: 1,
    curveSegments: 1,
  });
  geometry.rotateX(-Math.PI / 2);
  return geometry;
}

function lineGeometry(polygons: Point[][], height: number) {
  const vertices: number[] = [];
  for (const points of polygons) {
    points.forEach(([x, z], index) => {
      const next = points[(index + 1) % points.length];
      vertices.push(x, height, z, next[0], height, next[1]);
    });
  }
  return new THREE.BufferGeometry().setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
}

function makeModel({ plots, boundary, roads, viewBox }: Pick<InventorySceneProps, "plots" | "boundary" | "roads" | "viewBox">) {
  const [left, top, width, depth] = viewBox;
  const scale = 24 / Math.max(width, depth, 1);
  const convert = ([x, y]: Point): Point => [(x - left - width / 2) * scale, (y - top - depth / 2) * scale];
  const modelPlots: ModelPlot[] = [];
  const geometries: THREE.BufferGeometry[] = [];
  let firstVertex = 0;

  for (const plot of plots) {
    const points = plot.points.map(convert);
    const geometry = raisedPolygon(points, PLOT_HEIGHT);
    const vertexCount = geometry.getAttribute("position").count;
    modelPlots.push({ id: plot.id, label: plot.label, points, centroid: convert(plot.centroid), firstVertex, vertexCount });
    firstVertex += vertexCount;
    geometries.push(geometry);
  }

  // One interactive mesh and one border mesh keep all 46 plots inexpensive.
  const plotsGeometry = mergeGeometries(geometries) ?? new THREE.BufferGeometry();
  geometries.forEach(geometry => geometry.dispose());
  plotsGeometry.setAttribute("color", new THREE.Float32BufferAttribute(new Float32Array(firstVertex * 3), 3));
  const estate = boundary.map(convert);
  const roadGeometries = roads.filter(road => road.points.length >= 3).map(road => {
    const geometry = new THREE.ShapeGeometry(polygonShape(road.points.map(convert)));
    geometry.rotateX(-Math.PI / 2);
    return geometry;
  });
  const roadsGeometry = roadGeometries.length ? mergeGeometries(roadGeometries) : null;
  roadGeometries.forEach(geometry => geometry.dispose());

  return {
    plots: modelPlots,
    plotsGeometry,
    roadsGeometry,
    estate,
    baseGeometry: raisedPolygon(estate, BASE_HEIGHT),
    bordersGeometry: lineGeometry(modelPlots.map(plot => plot.points), PLOT_HEIGHT + 0.009),
    boundaryGeometry: lineGeometry([estate], 0.005),
  };
}

type Model = ReturnType<typeof makeModel>;

function PlotLabel({ plot, color }: { plot: ModelPlot; color: string }) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 64;
    const context = canvas.getContext("2d");
    if (context) {
      context.fillStyle = "#ffffff";
      context.font = "600 38px system-ui, sans-serif";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(plot.label, 64, 33);
    }
    const result = new THREE.CanvasTexture(canvas);
    result.colorSpace = THREE.SRGBColorSpace;
    result.minFilter = THREE.LinearFilter;
    result.generateMipmaps = false;
    return result;
  }, [plot.label]);
  useEffect(() => () => texture.dispose(), [texture]);

  return <sprite position={[plot.centroid[0], PLOT_HEIGHT + 0.12, plot.centroid[1]]} scale={[0.78, 0.39, 1]} renderOrder={4} raycast={() => {}}>
    <spriteMaterial map={texture} color={color} transparent depthWrite={false} depthTest={false} toneMapped={false} />
  </sprite>;
}

function PlotOutline({ points, selected }: { points: Point[]; selected: boolean }) {
  const geometry = useMemo(() => lineGeometry([points], PLOT_HEIGHT + 0.018), [points]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <lineSegments geometry={geometry} renderOrder={3} raycast={() => {}}>
    <lineBasicMaterial color={selected ? "#ddc287" : "#f7f1de"} depthTest={false} toneMapped={false} />
  </lineSegments>;
}

/** A soft light that breathes over every available plot, so the plan reads as live. */
function LivePulse({ model, statuses, paused }: { model: Model; statuses: Record<string, PlotStatus>; paused: boolean }) {
  const material = useRef<THREE.MeshBasicMaterial>(null);
  const geometry = useMemo(() => {
    const faces = model.plots.filter(plot => statuses[plot.id] === "available").map(plot => {
      const face = new THREE.ShapeGeometry(polygonShape(plot.points));
      face.rotateX(-Math.PI / 2);
      return face;
    });
    const merged = faces.length ? mergeGeometries(faces) : null;
    faces.forEach(face => face.dispose());
    return merged;
  }, [model, statuses]);
  useEffect(() => () => geometry?.dispose(), [geometry]);

  // The canvas renders on demand; requesting the next frame here keeps only
  // this pulse running, and it stops while plot details cover the map.
  useFrame(({ clock, invalidate }) => {
    if (!material.current) return;
    if (paused) { material.current.opacity = 0; return; }
    material.current.opacity = 0.02 + 0.16 * (0.5 + 0.5 * Math.sin(clock.elapsedTime * Math.PI * 2 / PULSE_PERIOD));
    invalidate();
  });

  if (!geometry) return null;
  return <mesh geometry={geometry} position={[0, PLOT_HEIGHT + 0.003, 0]} renderOrder={1} raycast={() => {}}>
    <meshBasicMaterial ref={material} color="#cfe9a6" transparent opacity={0} depthWrite={false} toneMapped={false} />
  </mesh>;
}

function CameraControls({ estate, resetKey, zoom, reserveRight }: { estate: Point[]; resetKey: number; zoom: number; reserveRight: number }) {
  const controls = useRef<ComponentRef<typeof OrbitControls>>(null);
  const get = useThree(state => state.get);
  const size = useThree(state => state.size);
  const invalidate = useThree(state => state.invalidate);

  useLayoutEffect(() => {
    const camera = get().camera;
    camera.position.copy(CAMERA_POSITION);
    camera.lookAt(CAMERA_TARGET);
    if (controls.current) {
      // Clear residual orbit damping before restoring the exact initial view.
      controls.current.enableDamping = false;
      controls.current.target.copy(CAMERA_TARGET);
      controls.current.update();
      camera.position.copy(CAMERA_POSITION);
      camera.lookAt(CAMERA_TARGET);
      controls.current.update();
      controls.current.enableDamping = true;
    }
    invalidate();
  }, [get, resetKey, invalidate]);

  useLayoutEffect(() => {
    const camera = get().camera;
    if (!(camera instanceof THREE.OrthographicCamera)) return;
    // Fit the estate outline itself (not its bounding rectangle) into the space
    // beside the legend, so the oblique plan fills the view without cropping.
    const orientation = new THREE.Matrix4().lookAt(CAMERA_POSITION, CAMERA_TARGET, new THREE.Vector3(0, 1, 0)).invert();
    const projected = estate.flatMap(([x, z]) => [0, -BASE_HEIGHT].map(y => new THREE.Vector3(x, y, z).applyMatrix4(orientation)));
    const xs = projected.map(point => point.x), ys = projected.map(point => point.y);
    const [minX, maxX, minY, maxY] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
    const { side, top, bottom } = FIT_PADDING;
    const fit = Math.min((size.width - reserveRight - side * 2) / (maxX - minX), (size.height - top - bottom) / (maxY - minY));
    camera.zoom = Math.max(1, fit) * THREE.MathUtils.clamp(zoom, 0.7, 2.8);
    // Shift the rendered view (not the orbit target) so the outline's centre
    // sits in the middle of the free area left of the legend.
    const centerX = (minX + maxX) / 2 * camera.zoom, centerY = (minY + maxY) / 2 * camera.zoom;
    camera.setViewOffset(size.width, size.height, centerX + reserveRight / 2, -(centerY + (top - bottom) / 2), size.width, size.height);
    camera.updateProjectionMatrix();
    invalidate();
  }, [get, size.width, size.height, estate, zoom, reserveRight, resetKey, invalidate]);

  return <OrbitControls
    ref={controls}
    makeDefault
    enablePan={false}
    enableZoom={false}
    enableDamping
    dampingFactor={0.12}
    rotateSpeed={0.45}
    minPolarAngle={0.24}
    maxPolarAngle={0.96}
  />;
}

function EstateModel({ model, statuses, selectedId, hoveredId, onSelect, onHover, onError, resetKey, zoom, reserveRight }: Omit<InventorySceneProps, "plots" | "boundary" | "roads" | "viewBox"> & { model: Model }) {
  const gl = useThree(state => state.gl);
  const invalidate = useThree(state => state.invalidate);
  const selected = model.plots.find(plot => plot.id === selectedId);
  const hovered = model.plots.find(plot => plot.id === hoveredId && plot.id !== selectedId);

  useEffect(() => {
    const canvas = gl.domElement;
    const onContextLost = (event: Event) => { event.preventDefault(); onError(); };
    canvas.addEventListener("webglcontextlost", onContextLost);
    return () => canvas.removeEventListener("webglcontextlost", onContextLost);
  }, [gl, onError]);

  useEffect(() => {
    gl.domElement.style.setProperty("cursor", hoveredId ? "pointer" : "grab");
    return () => { gl.domElement.style.removeProperty("cursor"); };
  }, [gl, hoveredId]);

  useLayoutEffect(() => {
    const colors = model.plotsGeometry.getAttribute("color") as THREE.BufferAttribute;
    const normals = model.plotsGeometry.getAttribute("normal");
    const color = new THREE.Color();
    for (const plot of model.plots) {
      color.set(plot.id === selectedId ? activePlotColor : statusColors[statuses[plot.id]]);
      if (plot.id === hoveredId && plot.id !== selectedId) color.lerp(new THREE.Color("#f6f1df"), 0.22);
      for (let index = plot.firstVertex; index < plot.firstVertex + plot.vertexCount; index++) {
        const shade = normals.getY(index) > 0.5 ? 1 : 0.76;
        colors.setXYZ(index, color.r * shade, color.g * shade, color.b * shade);
      }
    }
    colors.needsUpdate = true;
    invalidate();
  }, [model, statuses, selectedId, hoveredId, invalidate]);

  const hitPlot = (event: ThreeEvent<PointerEvent | MouseEvent>) => {
    if (event.faceIndex == null) return null;
    const vertex = event.faceIndex * 3;
    return model.plots.find(plot => vertex >= plot.firstVertex && vertex < plot.firstVertex + plot.vertexCount);
  };

  return <>
    <ambientLight intensity={1.4} />
    <directionalLight position={[-12, 24, 10]} intensity={2} color="#fff7e5" />
    <mesh geometry={model.baseGeometry} position={[0, -BASE_HEIGHT, 0]} raycast={() => {}}>
      <meshStandardMaterial color="#ede8d8" roughness={1} metalness={0} />
    </mesh>
    {model.roadsGeometry && <mesh geometry={model.roadsGeometry} position={[0, 0.008, 0]} raycast={() => {}}>
      <meshBasicMaterial color="#f4efdf" side={THREE.DoubleSide} />
    </mesh>}
    <lineSegments geometry={model.boundaryGeometry} raycast={() => {}}>
      <lineBasicMaterial color="#b6b6a4" />
    </lineSegments>
    <mesh
      geometry={model.plotsGeometry}
      onPointerMove={event => { event.stopPropagation(); onHover(hitPlot(event)?.id ?? null); }}
      onPointerOut={() => onHover(null)}
      onClick={event => {
        event.stopPropagation();
        const plot = hitPlot(event);
        if (event.delta <= 5 && plot) onSelect(plot.id);
      }}
    >
      {/* Untone-mapped so the deep status colours render as specified. */}
      <meshStandardMaterial vertexColors roughness={1} metalness={0} toneMapped={false} />
    </mesh>
    <lineSegments geometry={model.bordersGeometry} raycast={() => {}}>
      <lineBasicMaterial color="#e7eed8" transparent opacity={0.45} />
    </lineSegments>
    <LivePulse model={model} statuses={statuses} paused={selectedId !== null} />
    {selected && <PlotOutline points={selected.points} selected />}
    {hovered && <PlotOutline points={hovered.points} selected={false} />}
    {model.plots.map(plot => <PlotLabel key={plot.id} plot={plot} color={plot.id === selectedId ? "#fff8e8" : statusLabelColors[statuses[plot.id]]} />)}
    <CameraControls estate={model.estate} resetKey={resetKey} zoom={zoom} reserveRight={reserveRight} />
  </>;
}

class SceneBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? null : this.props.children; }
}

function ReportUnavailable({ onError }: { onError: () => void }) {
  useEffect(() => onError(), [onError]);
  return null;
}

function hasWebGL2() {
  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true });
    if (!context) return false;
    context.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

export default function InventoryScene(props: InventorySceneProps) {
  const [supported] = useState(hasWebGL2);
  const { plots, boundary, roads, viewBox } = props;
  const model = useMemo(() => makeModel({ plots, boundary, roads, viewBox }), [plots, boundary, roads, viewBox]);
  useEffect(() => () => {
    model.plotsGeometry.dispose();
    model.roadsGeometry?.dispose();
    model.baseGeometry.dispose();
    model.bordersGeometry.dispose();
    model.boundaryGeometry.dispose();
  }, [model]);

  if (!supported) return <ReportUnavailable onError={props.onError} />;

  return <SceneBoundary onError={props.onError}>
    <Canvas
      orthographic
      camera={{ position: CAMERA_POSITION.toArray(), near: 0.1, far: 180, zoom: 25 }}
      dpr={[1, 1.5]}
      frameloop="demand"
      gl={{ antialias: true, alpha: true, powerPreference: "low-power", failIfMajorPerformanceCaveat: true }}
      style={{ width: "100%", height: "100%" }}
      aria-hidden="true"
      onPointerLeave={() => props.onHover(null)}
      onCreated={({ gl }) => { gl.setClearColor("#e2e8d8", 0); }}
    >
      <EstateModel {...props} model={model} />
    </Canvas>
  </SceneBoundary>;
}
