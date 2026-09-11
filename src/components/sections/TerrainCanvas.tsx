"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { kodaguTerrain as dem } from "@/data/kodagu-terrain";

type TerrainCanvasProps = {
  active: boolean;
  reduced: boolean;
  coarse: boolean;
  turn: number;
  exaggeration: number;
  progress: RefObject<number>;
  onHeading: (degrees: number) => void;
  onElevation: (metres: number | null) => void;
  onReady?: () => void;
};

type SceneProps = Omit<TerrainCanvasProps, "active"> & { heights: Uint16Array };

// Scene units: the model is 7.2 wide, and depth keeps the real 71.7 × 57 km proportion.
const WIDTH = 7.2;
const DEPTH = WIDTH * (dem.heightKm / dem.widthKm);
const BASE = -0.16;
const FOCUS = new THREE.Vector3(0, 0.12, 0.1);
// Seen from the south-west, the western escarpment faces the camera.
const AZIMUTH = -0.5;
const POLAR = 0.98;
const RADIUS = 9.4;
const FOG = new THREE.Color("#173b2e");
const SUN = new THREE.Vector3(-0.72, 0.58, -0.38).normalize();
const hitPoint = new THREE.Vector3();

const terrainVertex = /* glsl */ `
  attribute float elevation;
  varying float vElevation;
  varying vec3 vNormal;
  varying vec3 vWorld;
  varying float vDepth;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vec4 view = viewMatrix * world;
    vElevation = elevation;
    vNormal = normalize(mat3(modelMatrix) * normal);
    vWorld = world.xyz;
    vDepth = -view.z;
    gl_Position = projectionMatrix * view;
  }
`;

const terrainFragment = /* glsl */ `
  uniform vec3 uSun;
  uniform vec3 uFog;
  uniform float uFogNear;
  uniform float uFogFar;
  uniform float uMin;
  uniform float uMax;
  uniform float uReveal;
  uniform vec3 uHover;
  uniform float uHoverOn;
  varying float vElevation;
  varying vec3 vNormal;
  varying vec3 vWorld;
  varying float vDepth;

  vec3 ramp(float t) {
    vec3 valley = vec3(0.075, 0.180, 0.145);
    vec3 lowland = vec3(0.137, 0.263, 0.204);
    vec3 forest = vec3(0.235, 0.357, 0.259);
    vec3 moss = vec3(0.435, 0.494, 0.400);
    vec3 ridge = vec3(0.757, 0.725, 0.576);
    if (t < 0.2) return mix(valley, lowland, t / 0.2);
    if (t < 0.5) return mix(lowland, forest, (t - 0.2) / 0.3);
    if (t < 0.8) return mix(forest, moss, (t - 0.5) / 0.3);
    return mix(moss, ridge, (t - 0.8) / 0.2);
  }

  float contour(float value, float width) {
    float w = fwidth(value);
    float line = 1.0 - smoothstep(0.0, w * width, abs(fract(value + 0.5) - 0.5));
    return line * (1.0 - smoothstep(0.18, 0.5, w));
  }

  void main() {
    vec3 n = normalize(vNormal);
    float t = clamp((vElevation - uMin) / (uMax - uMin), 0.0, 1.0);
    vec3 base = ramp(pow(t, 0.85));
    float slope = 1.0 - n.y;
    base *= mix(1.0, 0.7, smoothstep(0.12, 0.65, slope));
    float diffuse = max(dot(n, uSun), 0.0);
    float sky = 0.5 + 0.5 * n.y;
    vec3 color = base * (0.36 * sky + 1.05 * diffuse) + vec3(0.025, 0.03, 0.02) * sky;

    // Real 100 m contours, with every 500 m drawn as an index line.
    float level = uReveal * (uMax + 80.0);
    float shown = 1.0 - smoothstep(level - 70.0, level, vElevation);
    vec3 brass = vec3(0.788, 0.722, 0.522);
    color = mix(color, brass, contour(vElevation / 100.0, 1.2) * 0.16 * shown);
    color = mix(color, brass * 1.08, contour(vElevation / 500.0, 1.6) * 0.38 * shown);
    float sweep = 1.0 - smoothstep(0.0, 45.0, abs(vElevation - level + 35.0));
    color += brass * sweep * 0.16 * step(0.001, uReveal) * step(uReveal, 0.999);

    float ring = 1.0 - smoothstep(0.0, 0.014, abs(distance(vWorld.xz, uHover.xz) - 0.11));
    color = mix(color, vec3(0.96, 0.94, 0.89), ring * uHoverOn * 0.9);

    float fog = smoothstep(uFogNear, uFogFar, vDepth);
    gl_FragColor = vec4(mix(color, uFog, fog * 0.8), 1.0);
  }
`;

const skirtVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vWorld;
  varying float vDepth;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vec4 view = viewMatrix * world;
    vNormal = normalize(mat3(modelMatrix) * normal);
    vWorld = world.xyz;
    vDepth = -view.z;
    gl_Position = projectionMatrix * view;
  }
`;

const skirtFragment = /* glsl */ `
  uniform vec3 uSun;
  uniform vec3 uFog;
  uniform float uFogNear;
  uniform float uFogFar;
  uniform float uBase;
  uniform float uTop;
  varying vec3 vNormal;
  varying vec3 vWorld;
  varying float vDepth;
  void main() {
    float k = clamp((vWorld.y - uBase) / (uTop - uBase), 0.0, 1.0);
    vec3 color = mix(vec3(0.043, 0.098, 0.078), vec3(0.13, 0.23, 0.18), k);
    color *= 0.9 + 0.12 * smoothstep(0.32, 0.5, abs(fract(vWorld.y * 42.0) - 0.5));
    color *= 0.6 + 0.4 * max(dot(normalize(vNormal), uSun), 0.0);
    float fog = smoothstep(uFogNear, uFogFar, vDepth);
    gl_FragColor = vec4(mix(color, uFog, fog * 0.8), 1.0);
  }
`;

const mistVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Mist pools only where the real ground sits below its level, so it settles into valleys.
const mistFragment = /* glsl */ `
  uniform sampler2D uHeight;
  uniform float uLevel;
  uniform float uTime;
  uniform float uOpacity;
  uniform float uSpeed;
  uniform vec3 uColor;
  varying vec2 vUv;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }
  float fbm(vec2 p) {
    float value = 0.0, amplitude = 0.5;
    for (int i = 0; i < 4; i++) { value += amplitude * noise(p); p = p * 2.03 + 17.1; amplitude *= 0.5; }
    return value;
  }
  void main() {
    float ground = texture2D(uHeight, vec2(vUv.x, 1.0 - vUv.y)).r;
    float pooled = smoothstep(0.0, 0.07, uLevel - ground);
    float cloud = smoothstep(0.38, 0.8, fbm(vUv * vec2(6.0, 4.8) + vec2(uTime * uSpeed, uTime * uSpeed * 0.35)));
    float frame = smoothstep(0.0, 0.05, vUv.x) * smoothstep(1.0, 0.95, vUv.x) * smoothstep(0.0, 0.05, vUv.y) * smoothstep(1.0, 0.95, vUv.y);
    gl_FragColor = vec4(uColor, pooled * cloud * frame * uOpacity);
  }
`;

function useElevation() {
  const [heights, setHeights] = useState<Uint16Array | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    fetch(dem.src, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Elevation data returned ${response.status}`);
        return response.arrayBuffer();
      })
      .then((buffer) => setHeights(new Uint16Array(buffer)))
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) console.error(error);
      });
    return () => controller.abort();
  }, []);
  return heights;
}

function buildSurface(heights: Uint16Array, stride: number, metre: number) {
  const cols = Math.floor((dem.cols - 1) / stride) + 1;
  const rows = Math.floor((dem.rows - 1) / stride) + 1;
  const geometry = new THREE.PlaneGeometry(WIDTH, DEPTH, cols - 1, rows - 1);
  geometry.rotateX(-Math.PI / 2);
  const position = geometry.getAttribute("position") as THREE.BufferAttribute;
  const elevation = new Float32Array(position.count);
  // Row 0 of the data is the northern edge, which rotates to the far side (-z).
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const index = row * cols + col;
      elevation[index] = heights[row * stride * dem.cols + col * stride];
      position.setY(index, elevation[index] * metre);
    }
  }
  geometry.setAttribute("elevation", new THREE.BufferAttribute(elevation, 1));
  geometry.computeVertexNormals();
  return { geometry, cols, rows };
}

function buildSkirt(surface: THREE.BufferGeometry, cols: number, rows: number) {
  const position = surface.getAttribute("position") as THREE.BufferAttribute;
  // Walk the perimeter clockwise from above so every wall faces outward.
  const sides = [
    { indices: Array.from({ length: cols }, (_, col) => col), normal: [0, 0, -1] },
    { indices: Array.from({ length: rows }, (_, row) => row * cols + cols - 1), normal: [1, 0, 0] },
    { indices: Array.from({ length: cols }, (_, col) => (rows - 1) * cols + cols - 1 - col), normal: [0, 0, 1] },
    { indices: Array.from({ length: rows }, (_, row) => (rows - 1 - row) * cols), normal: [-1, 0, 0] },
  ];
  const vertices: number[] = [];
  const normals: number[] = [];
  const index: number[] = [];
  for (const side of sides) {
    const start = vertices.length / 3;
    for (const i of side.indices) {
      vertices.push(position.getX(i), position.getY(i), position.getZ(i), position.getX(i), BASE, position.getZ(i));
      normals.push(...side.normal, ...side.normal);
    }
    for (let k = 0; k < side.indices.length - 1; k++) {
      const top = start + k * 2;
      index.push(top, top + 2, top + 1, top + 1, top + 2, top + 3);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geometry.setIndex(index);
  return geometry;
}

function buildHeightTexture(heights: Uint16Array) {
  const data = new Uint8Array(heights.length);
  for (let i = 0; i < heights.length; i++) data[i] = Math.round((heights[i] / dem.maxMetres) * 255);
  const texture = new THREE.DataTexture(data, dem.cols, dem.rows, THREE.RedFormat, THREE.UnsignedByteType);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

/** Bilinear elevation in metres at a model-space position, or -Infinity outside the data. */
function sample(heights: Uint16Array, x: number, z: number) {
  const u = (x / WIDTH + 0.5) * (dem.cols - 1);
  const v = (z / DEPTH + 0.5) * (dem.rows - 1);
  if (u < 0 || v < 0 || u > dem.cols - 1 || v > dem.rows - 1) return Number.NEGATIVE_INFINITY;
  const c0 = Math.floor(u), r0 = Math.floor(v);
  const c1 = Math.min(c0 + 1, dem.cols - 1), r1 = Math.min(r0 + 1, dem.rows - 1);
  const fu = u - c0, fv = v - r0;
  const north = heights[r0 * dem.cols + c0] * (1 - fu) + heights[r0 * dem.cols + c1] * fu;
  const south = heights[r1 * dem.cols + c0] * (1 - fu) + heights[r1 * dem.cols + c1] * fu;
  return north * (1 - fv) + south * fv;
}

/** March a ray through the height field instead of raycasting tens of thousands of triangles. */
function probe(ray: THREE.Ray, heights: Uint16Array, metre: number, target: THREE.Vector3) {
  const min = [-WIDTH / 2, 0, -DEPTH / 2];
  const max = [WIDTH / 2, dem.maxMetres * metre + 0.01, DEPTH / 2];
  const origin = [ray.origin.x, ray.origin.y, ray.origin.z];
  const direction = [ray.direction.x, ray.direction.y, ray.direction.z];
  let near = 0, far = Number.POSITIVE_INFINITY;
  for (let axis = 0; axis < 3; axis++) {
    if (Math.abs(direction[axis]) < 1e-9) {
      if (origin[axis] < min[axis] || origin[axis] > max[axis]) return false;
      continue;
    }
    let t0 = (min[axis] - origin[axis]) / direction[axis];
    let t1 = (max[axis] - origin[axis]) / direction[axis];
    if (t0 > t1) [t0, t1] = [t1, t0];
    near = Math.max(near, t0);
    far = Math.min(far, t1);
    if (near > far) return false;
  }
  const above = (t: number) => {
    ray.at(t, target);
    return target.y - sample(heights, target.x, target.z) * metre;
  };
  let previous = near;
  for (let step = 1; step <= 160; step++) {
    const t = near + (far - near) * (step / 160);
    if (above(t) <= 0) {
      let low = previous, high = t;
      for (let i = 0; i < 8; i++) {
        const middle = (low + high) / 2;
        if (above(middle) > 0) low = middle;
        else high = middle;
      }
      ray.at(high, target);
      return true;
    }
    previous = t;
  }
  return false;
}

function Mist({ texture, level, opacity, speed, metre, reduced }: { texture: THREE.DataTexture; level: number; opacity: number; speed: number; metre: number; reduced: boolean }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({
    uHeight: { value: texture },
    uLevel: { value: level },
    uTime: { value: 3 },
    uOpacity: { value: opacity },
    uSpeed: { value: speed },
    uColor: { value: new THREE.Color("#e4e9dc") },
  }), [texture, level, opacity, speed]);
  useFrame((_, delta) => {
    if (!reduced && material.current) material.current.uniforms.uTime.value += Math.min(delta, 0.05);
  });
  return <mesh position={[0, level * dem.maxMetres * metre, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={2}>
    <planeGeometry args={[WIDTH, DEPTH, 1, 1]} />
    <shaderMaterial ref={material} vertexShader={mistVertex} fragmentShader={mistFragment} uniforms={uniforms} transparent depthWrite={false} />
  </mesh>;
}

function Scene({ heights, reduced, coarse, turn, exaggeration, progress, onHeading, onElevation, onReady }: SceneProps) {
  const gl = useThree((state) => state.gl);
  const invalidate = useThree((state) => state.invalidate);
  const terrain = useRef<THREE.ShaderMaterial>(null);
  const skirt = useRef<THREE.ShaderMaterial>(null);
  const drag = useRef({ azimuth: 0, polar: 0, pointer: -1, x: 0, y: 0 });
  const hover = useRef({ inside: false, metres: -1 });
  const view = useRef({ azimuth: AZIMUTH, polar: POLAR, radius: RADIUS, settled: false, offset: Number.NaN });
  // Real kilometres across, with the vertical scale exaggerated so the relief reads.
  const metre = exaggeration / (1000 * (dem.widthKm / WIDTH));

  const assets = useMemo(() => {
    const surface = buildSurface(heights, coarse ? 2 : 1, metre);
    return { ...surface, skirt: buildSkirt(surface.geometry, surface.cols, surface.rows), texture: buildHeightTexture(heights) };
  }, [heights, coarse, metre]);
  useEffect(() => () => {
    assets.geometry.dispose();
    assets.skirt.dispose();
    assets.texture.dispose();
  }, [assets]);

  const terrainUniforms = useMemo(() => ({
    uSun: { value: SUN },
    uFog: { value: FOG },
    uFogNear: { value: 7 },
    uFogFar: { value: 17 },
    uMin: { value: dem.minMetres },
    uMax: { value: dem.maxMetres },
    uReveal: { value: 0 },
    uHover: { value: new THREE.Vector3() },
    uHoverOn: { value: 0 },
  }), []);
  const skirtUniforms = useMemo(() => ({
    uSun: { value: SUN },
    uFog: { value: FOG },
    uFogNear: { value: 7 },
    uFogFar: { value: 17 },
    uBase: { value: BASE },
    uTop: { value: dem.maxMetres * metre },
  }), [metre]);

  useEffect(() => {
    const element = gl.domElement;
    const pointer = drag.current;
    const down = (event: PointerEvent) => {
      if (event.button !== 0) return;
      pointer.pointer = event.pointerId;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      element.setPointerCapture(event.pointerId);
    };
    const move = (event: PointerEvent) => {
      hover.current.inside = true;
      if (event.pointerId === pointer.pointer) {
        pointer.azimuth -= (event.clientX - pointer.x) * 0.0065;
        pointer.polar = THREE.MathUtils.clamp(pointer.polar - (event.clientY - pointer.y) * 0.004, -0.5, 0.25);
        pointer.x = event.clientX;
        pointer.y = event.clientY;
      }
      invalidate();
    };
    const up = (event: PointerEvent) => { if (event.pointerId === pointer.pointer) pointer.pointer = -1; };
    const leave = () => { hover.current.inside = false; invalidate(); };
    element.addEventListener("pointerdown", down);
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerup", up);
    element.addEventListener("pointercancel", up);
    element.addEventListener("pointerleave", leave);
    return () => {
      element.removeEventListener("pointerdown", down);
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerup", up);
      element.removeEventListener("pointercancel", up);
      element.removeEventListener("pointerleave", leave);
    };
  }, [gl, invalidate]);

  useEffect(() => { invalidate(); }, [turn, invalidate]);

  useEffect(() => {
    let second = 0;
    const first = requestAnimationFrame(() => { second = requestAnimationFrame(() => onReady?.()); });
    return () => { cancelAnimationFrame(first); cancelAnimationFrame(second); };
  }, [onReady]);

  useFrame((state, delta) => {
    const camera = state.camera as THREE.PerspectiveCamera;
    const dt = Math.min(delta, 0.05);
    const aspect = state.size.width / Math.max(1, state.size.height);
    const wide = aspect > 1.25;
    const scroll = reduced ? 0.5 : THREE.MathUtils.clamp(progress.current ?? 0, 0, 1);
    const fit = THREE.MathUtils.clamp(3 / aspect, 1.32, 3.6);
    const idle = reduced ? 0 : Math.sin(state.clock.elapsedTime * 0.06) * 0.08;
    // Scrolling through the section swings the view round the escarpment and gently closer.
    const goalAzimuth = AZIMUTH + (scroll - 0.5) * 0.8 + turn * 0.35 + drag.current.azimuth + idle;
    const goalPolar = THREE.MathUtils.clamp(POLAR + (wide ? 0 : -0.28) + (0.5 - scroll) * 0.22 + drag.current.polar, 0.42, 1.2);
    const goalRadius = (RADIUS - scroll * 1.1) * fit;
    const current = view.current;
    if (reduced || !current.settled) {
      current.azimuth = goalAzimuth;
      current.polar = goalPolar;
      current.radius = goalRadius;
      current.settled = true;
    } else {
      current.azimuth = THREE.MathUtils.damp(current.azimuth, goalAzimuth, 2.6, dt);
      current.polar = THREE.MathUtils.damp(current.polar, goalPolar, 2.6, dt);
      current.radius = THREE.MathUtils.damp(current.radius, goalRadius, 2.2, dt);
    }
    const sinPolar = Math.sin(current.polar);
    camera.position.set(
      FOCUS.x + current.radius * sinPolar * Math.sin(current.azimuth),
      FOCUS.y + current.radius * Math.cos(current.polar),
      FOCUS.z + current.radius * sinPolar * Math.cos(current.azimuth),
    );
    camera.lookAt(FOCUS);
    // On wide panels the model sits right of the copy without orbiting off-centre.
    const offset = wide ? -3.2 : 0;
    if (offset !== current.offset) {
      camera.filmOffset = offset;
      camera.updateProjectionMatrix();
      current.offset = offset;
    }
    onHeading(THREE.MathUtils.radToDeg(current.azimuth));

    const surface = terrain.current;
    if (!surface) return;
    const uniforms = surface.uniforms;
    uniforms.uFogNear.value = current.radius * 0.72;
    uniforms.uFogFar.value = current.radius * 1.8;
    if (skirt.current) {
      skirt.current.uniforms.uFogNear.value = uniforms.uFogNear.value;
      skirt.current.uniforms.uFogFar.value = uniforms.uFogFar.value;
    }
    const reveal = reduced ? 1 : THREE.MathUtils.clamp((scroll - 0.12) / 0.34, 0, 1);
    uniforms.uReveal.value = reduced ? 1 : THREE.MathUtils.damp(uniforms.uReveal.value, reveal, 5, dt);

    let hit = false;
    if (!coarse && hover.current.inside && drag.current.pointer < 0) {
      state.raycaster.setFromCamera(state.pointer, camera);
      hit = probe(state.raycaster.ray, heights, metre, hitPoint);
      if (hit) uniforms.uHover.value.copy(hitPoint);
    }
    uniforms.uHoverOn.value = reduced ? Number(hit) : THREE.MathUtils.damp(uniforms.uHoverOn.value, hit ? 1 : 0, 12, dt);
    const metres = hit ? Math.round(sample(heights, hitPoint.x, hitPoint.z) / 10) * 10 : -1;
    if (metres !== hover.current.metres) {
      hover.current.metres = metres;
      onElevation(metres >= 0 ? metres : null);
    }
  });

  return <>
    <mesh geometry={assets.geometry}>
      <shaderMaterial ref={terrain} vertexShader={terrainVertex} fragmentShader={terrainFragment} uniforms={terrainUniforms} />
    </mesh>
    <mesh geometry={assets.skirt}>
      <shaderMaterial ref={skirt} vertexShader={skirtVertex} fragmentShader={skirtFragment} uniforms={skirtUniforms} />
    </mesh>
    <Mist texture={assets.texture} level={0.22} opacity={0.5} speed={0.014} metre={metre} reduced={reduced} />
    <Mist texture={assets.texture} level={0.6} opacity={0.26} speed={0.009} metre={metre} reduced={reduced} />
  </>;
}

export default function TerrainCanvas({ active, ...scene }: TerrainCanvasProps) {
  const heights = useElevation();
  return <Canvas
    aria-hidden="true"
    dpr={[1, scene.coarse ? 1.25 : 1.6]}
    frameloop={!active ? "never" : scene.reduced ? "demand" : "always"}
    camera={{ position: [0, 6, 9], fov: 30, near: 0.1, far: 80 }}
    gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
    onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
  >
    {heights && <Scene heights={heights} {...scene} />}
  </Canvas>;
}
