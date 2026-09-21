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
  uniform float uTime;
  float pocket(vec2 uv,vec2 centre,vec2 radius){
    return 1.-smoothstep(.35,1.,length((uv-centre)/radius));
  }
  vec2 cloudMask(vec2 uv,vec3 colour){
    // Masks are in the original photograph's coordinates, so the same fog
    // pockets stay selected when the image is cropped on a phone.
    vec2 p=vec2(uv.x,1.-uv.y);
    vec3 edge=texture2D(uEdges,vec2(uv.x,.5)).rgb;
    float light=dot(colour,vec3(.2126,.7152,.0722));
    float sky=1.-smoothstep(.30,.345,p.y);
    sky*=1.-pocket(p,vec2(.214,.291),vec2(.055,.06));
    float valley=pocket(p,vec2(.035,.455),vec2(.065,.03));
    valley=max(valley,pocket(p,vec2(.365,.565),vec2(.105,.035)));
    valley=max(valley,pocket(p,vec2(.60,.638),vec2(.095,.05)));
    valley*=smoothstep(.20,.40,light);
    float right=pocket(p,vec2(.955,.727),vec2(.105,.083))*smoothstep(.10,.25,light);
    right=max(right,pocket(p,vec2(.86,.544),vec2(.095,.045))*smoothstep(.17,.32,light));
    valley=max(valley,right);
    // Keep dark terrain, tree silhouettes and photo-layer seams stationary.
    valley*=1.-smoothstep(edge.g-.028,edge.g-.008,p.y);
    valley*=smoothstep(.004,.018,abs(p.y-edge.r));
    float border=smoothstep(0.,.025,uv.x)*(1.-smoothstep(.975,1.,uv.x));
    return vec2(sky,valley)*border;
  }
  vec3 driftingPhoto(vec2 uv,vec3 original,float amount,float offset){
    vec2 movedUv=uv-vec2(offset,0.);
    vec3 moved=texture2D(uPhoto,movedUv).rgb;
    vec2 sourceMask=cloudMask(movedUv,moved);
    float safe=smoothstep(.02,.3,max(sourceMask.x,sourceMask.y));
    return mix(original,moved,amount*safe);
  }
  vec3 movingPhoto(vec2 uv){
    vec3 original=texture2D(uPhoto,uv).rgb;
    vec2 mask=cloudMask(uv,original);
    float amount=max(mask.x,mask.y);
    if(amount<.001 || uTime==0.) return original;
    // Both photo samples travel right at a constant speed. Each wraps only
    // while invisible; short crossfades hide the repeat without reversing it.
    float period=mix(8.,11.,mask.x);
    float distance=mix(.038,.054,mask.x);
    float phaseA=fract(uTime/period+.5);
    float phaseB=fract(phaseA+.5);
    // Hold one sample fully visible between handoffs. A continuous triangular
    // blend would cancel the translation and make the clouds appear still.
    float weightA=smoothstep(.20,.30,phaseA)*(1.-smoothstep(.70,.80,phaseA));
    vec3 a=driftingPhoto(uv,original,amount,distance*(phaseA-.5));
    vec3 b=driftingPhoto(uv,original,amount,distance*(phaseB-.5));
    return mix(b,a,weightA);
  }
  void main(){
    vec3 edge=texture2D(uEdges,vec2(vUv.x,.5)).rgb;
    float y=1.-vUv.y;
    float alpha=1.;
    if(uBand<.5) alpha=1.-smoothstep(edge.r+edge.b,edge.r+edge.b*2.,y);
    else if(uBand<1.5) alpha=smoothstep(edge.r-edge.b,edge.r+edge.b,y)*(1.-smoothstep(edge.g+.001,edge.g+.004,y));
    else alpha=smoothstep(edge.g-.001,edge.g+.001,y);
    if(alpha<.001) discard;
    gl_FragColor=vec4(movingPhoto(vUv),alpha);
    #include <colorspace_fragment>
  }`;

function LandscapeLayers({ state, reduced }: { state: RefObject<SceneProgress>; reduced: boolean }) {
  const source = useTexture("/images/coorg/conceptual/hero-mist-valley.webp");
  const group = useRef<THREE.Group>(null);
  const elapsed = useRef(0);
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
  const uniforms = useMemo(() => [0, 1, 2].map((band) => ({ uPhoto: { value: texture }, uEdges: { value: edges }, uBand: { value: band }, uTime: { value: 0 } })), [edges, texture]);
  useFrame((_, delta) => {
    const progress = reduced ? 0 : state.current.progress;
    if (!reduced) elapsed.current += Math.min(delta, .05);
    // Each photo region occurs exactly once. The nearer piece moves upwards
    // faster, overlapping the cut below it without exposing missing scenery.
    group.current?.children.forEach((layer, index) => {
      layer.position.y = progress * [0.32, 0.98, 1.95][index];
      const material = (layer as THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>).material;
      material.uniforms.uTime.value = reduced ? 0 : elapsed.current;
    });
  });
  useEffect(() => () => geometries.forEach((geometry) => geometry.dispose()), [geometries]);
  useEffect(() => () => { texture.dispose(); edges.dispose(); }, [texture, edges]);
  return <group ref={group}>{geometries.map((geometry, index) => <mesh key={index} position={[0, 0, index]} geometry={geometry} renderOrder={index}>
    <shaderMaterial vertexShader={landscapeVertex} fragmentShader={landscapeFragment} uniforms={uniforms[index]} transparent depthWrite={false} toneMapped={false} />
  </mesh>)}</group>;
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
  return <LandscapeLayers state={state} reduced={reduced} />;
}
