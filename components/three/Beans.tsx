"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";
import type { ThreeElements } from "@react-three/fiber";

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Roasted coffee bean: squashed ellipsoid with a centre crease on its flat side. */
export function beanGeometry() {
  const g = new THREE.SphereGeometry(1, 40, 28);
  const pos = g.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    let y = v.y;
    if (y > 0) {
      y *= 0.55; // flat face
      const crease = Math.exp(-Math.pow(v.x / 0.09, 2)) * 0.32 * (1 - Math.abs(v.z) ** 4);
      y -= crease;
    }
    pos.setXYZ(i, v.x * 0.62, y * 0.5, v.z * 0.85);
  }
  g.computeVertexNormals();
  return g;
}

const beanMat = () =>
  new THREE.MeshPhysicalMaterial({ color: "#3d1f10", roughness: 0.38, clearcoat: 0.55, clearcoatRoughness: 0.4, sheen: 0.4, sheenColor: new THREE.Color("#8a4b25") });

export function Bean(props: ThreeElements["group"]) {
  const geo = useMemo(beanGeometry, []);
  const mat = useMemo(beanMat, []);
  return (
    <group {...props}>
      <mesh geometry={geo} material={mat} />
    </group>
  );
}

export function IceCube(props: ThreeElements["group"]) {
  return (
    <group {...props}>
      <RoundedBox args={[0.6, 0.6, 0.6]} radius={0.09} smoothness={4}>
        <meshPhysicalMaterial color="#dff6ff" roughness={0.06} transparent opacity={0.5} clearcoat={1} envMapIntensity={2.4} />
      </RoundedBox>
    </group>
  );
}

function woodTexture() {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 512;
  const ctx = c.getContext("2d")!;
  const r = rng(77);
  ctx.fillStyle = "#c98a4e";
  ctx.fillRect(0, 0, c.width, c.height);
  for (let i = 0; i < 140; i++) {
    const y = r() * c.height;
    ctx.strokeStyle = r() > 0.5 ? "rgba(120,62,24,0.35)" : "rgba(235,180,120,0.3)";
    ctx.lineWidth = 1 + r() * 4;
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= c.width; x += 32) ctx.lineTo(x, y + Math.sin(x * 0.01 + i) * 6 + (r() - 0.5) * 3);
    ctx.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(1, 1);
  return t;
}

export function BeanBowl(props: ThreeElements["group"]) {
  const inst = useRef<THREE.InstancedMesh>(null);
  const { bowl, bean, mat, wood, count } = useMemo(() => {
    const profile: [number, number][] = [
      [0, -0.62], [0.9, -0.62], [1.0, -0.58], [1.3, -0.4], [1.6, -0.05], [1.78, 0.3], [1.82, 0.42],
      [1.74, 0.44], [1.68, 0.3], [1.5, -0.02], [1.2, -0.32], [0.8, -0.46], [0, -0.48],
    ];
    return {
      bowl: new THREE.LatheGeometry(profile.map(([x, y]) => new THREE.Vector2(x, y)), 96),
      bean: beanGeometry(),
      mat: beanMat(),
      wood: woodTexture(),
      count: 420,
    };
  }, []);

  useLayoutEffect(() => {
    const r = rng(9);
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    const s = new THREE.Vector3();
    const p = new THREE.Vector3();
    for (let i = 0; i < count; i++) {
      const rad = Math.sqrt(r()) * 1.5;
      const a = r() * Math.PI * 2;
      // domed heap that rises above the rim
      const mound = 0.2 + 0.5 * (1 - (rad / 1.6) ** 2);
      p.set(Math.cos(a) * rad, 0.12 + mound + (r() - 0.5) * 0.12, Math.sin(a) * rad);
      e.set(r() * Math.PI, r() * Math.PI * 2, r() * Math.PI);
      q.setFromEuler(e);
      const k = 0.2 + r() * 0.03;
      s.set(k, k, k);
      m.compose(p, q, s);
      inst.current!.setMatrixAt(i, m);
    }
    inst.current!.instanceMatrix.needsUpdate = true;
  }, [count]);

  return (
    <group {...props} dispose={null}>
      <mesh geometry={bowl}>
        <meshStandardMaterial map={wood} roughness={0.55} side={THREE.DoubleSide} />
      </mesh>
      <instancedMesh ref={inst} args={[bean, mat, count]} />
    </group>
  );
}
