"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import contours from "@/data/hero-contours.json";

export type SceneProgress = { progress: number };
const PHOTO_ASPECT = 1672 / 941;

const landscapeVertex = `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const landscapeFragment = `
  varying vec2 vUv;
  uniform sampler2D uPhoto;
  uniform sampler2D uEdges;
  uniform float uBand;
  void main(){
    vec3 edge=texture2D(uEdges,vec2(vUv.x,.5)).rgb;
    float y=1.-vUv.y;
    float alpha=1.;
    if(uBand<.5) alpha=1.-smoothstep(edge.r+edge.b,edge.r+edge.b*2.,y);
    else if(uBand<1.5) alpha=smoothstep(edge.r-edge.b,edge.r+edge.b,y)*(1.-smoothstep(edge.g+.001,edge.g+.004,y));
    else alpha=smoothstep(edge.g-.001,edge.g+.001,y);
    if(alpha<.001) discard;
    gl_FragColor=vec4(texture2D(uPhoto,vUv).rgb,alpha);
    #include <colorspace_fragment>
  }`;

function LandscapeLayers({ state, reduced }: { state: RefObject<SceneProgress>; reduced: boolean }) {
  const source = useTexture("/images/coorg/conceptual/hero-mist-valley.webp");
  const group = useRef<THREE.Group>(null);
  const { size } = useThree();
  const texture = useMemo(() => {
    const photo = source.clone();
    photo.colorSpace = THREE.SRGBColorSpace;
    photo.needsUpdate = true;
    return photo;
  }, [source]);
  const edges = useMemo(() => {
    const values = new Float32Array(contours.width * 4);
    for (let index = 0; index < contours.width; index++) {
      values[index * 4] = contours.ridge[index] / contours.height;
      values[index * 4 + 1] = contours.trees[index] / contours.height;
      // The centre ridge disappears into real mist behind the canopy. Feather
      // that occluded valley broadly; preserve fine foliage edges elsewhere.
      const valley = THREE.MathUtils.smoothstep(index, 560, 720) * (1 - THREE.MathUtils.smoothstep(index, 990, 1140));
      values[index * 4 + 2] = THREE.MathUtils.lerp(.0015, .024, valley);
      values[index * 4 + 3] = 1;
    }
    const map = new THREE.DataTexture(values, contours.width, 1, THREE.RGBAFormat, THREE.FloatType);
    map.minFilter = map.magFilter = THREE.LinearFilter;
    map.needsUpdate = true;
    return map;
  }, []);
  const geometries = useMemo(() => {
    const aspect = size.width / size.height;
    return [0, 1, 2].map((depth) => {
      const viewHeight = 2 * (24 - depth) * Math.tan(THREE.MathUtils.degToRad(37) / 2);
      const geometry = new THREE.PlaneGeometry(viewHeight * aspect, viewHeight);
      const uv = geometry.attributes.uv;
      for (let index = 0; index < uv.count; index++) {
        if (aspect < PHOTO_ASPECT) uv.setX(index, (uv.getX(index) - .5) * aspect / PHOTO_ASPECT + .5);
        else uv.setY(index, (uv.getY(index) - .5) * PHOTO_ASPECT / aspect + .5);
      }
      return geometry;
    });
  }, [size.width, size.height]);
  const uniforms = useMemo(() => [0, 1, 2].map((band) => ({ uPhoto: { value: texture }, uEdges: { value: edges }, uBand: { value: band } })), [edges, texture]);
  useFrame(() => {
    const progress = reduced ? 0 : state.current.progress;
    // Each photo region occurs exactly once. The nearer piece moves upwards
    // faster, overlapping the cut below it without exposing missing scenery.
    group.current?.children.forEach((layer, index) => { layer.position.y = progress * [0.32, 0.98, 1.95][index]; });
  });
  useEffect(() => () => geometries.forEach((geometry) => geometry.dispose()), [geometries]);
  useEffect(() => () => { texture.dispose(); edges.dispose(); }, [texture, edges]);
  return <group ref={group}>{geometries.map((geometry, index) => <mesh key={index} position={[0, 0, index]} geometry={geometry} renderOrder={index}>
    <shaderMaterial vertexShader={landscapeVertex} fragmentShader={landscapeFragment} uniforms={uniforms[index]} transparent depthWrite={false} toneMapped={false} />
  </mesh>)}</group>;
}

const mistVertex = `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const mistFragment = `
  varying vec2 vUv; uniform float uTime;
  float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
  float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
  void main(){vec2 p=vUv*vec2(7.,3.);p.x+=uTime*.022;float n=noise(p)*.65+noise(p*2.1)*.35;
    float edge=smoothstep(0.,.2,vUv.x)*(1.-smoothstep(.8,1.,vUv.x));float veil=pow(sin(vUv.y*3.14159),2.);
    gl_FragColor=vec4(.64,.70,.62,n*veil*edge*.065*smoothstep(0.,2.4,uTime));
  }`;

function MistLayer({ z, y, reduced }: { z: number; y: number; reduced: boolean }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  useFrame((_, delta) => { if (material.current && !reduced) material.current.uniforms.uTime.value += Math.min(delta, 0.05); });
  return <mesh position={[0, y, z]}><planeGeometry args={[60, 5]} /><shaderMaterial ref={material} vertexShader={mistVertex} fragmentShader={mistFragment} uniforms={uniforms} transparent depthWrite={false} /></mesh>;
}

export default function MountainScene({ state, reduced, coarse }: { state: RefObject<SceneProgress>; reduced: boolean; coarse: boolean }) {
  useFrame(({ camera, pointer }, delta) => {
    const x = coarse || reduced ? 0 : THREE.MathUtils.clamp(pointer.x, -1, 1) * 0.18;
    const y = coarse || reduced ? 0 : THREE.MathUtils.clamp(pointer.y, -1, 1) * 0.07;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, x, 2, Math.min(delta, 0.05));
    camera.position.y = THREE.MathUtils.damp(camera.position.y, y, 2, Math.min(delta, 0.05));
    camera.position.z = 24;
    camera.lookAt(0, 0, 0);
  });
  return <>
    <LandscapeLayers state={state} reduced={reduced} />
    <MistLayer z={4} y={-1.2} reduced={reduced} />
    <MistLayer z={6} y={-3.4} reduced={reduced} />
  </>;
}
