"use client";

/**
 * Procedural desserts + hot coffees for the gallery renders. Everything is built
 * from primitives/lathes with canvas textures, matching the hero's 3D style.
 */
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { ThreeElements } from "@react-three/fiber";

type G = ThreeElements["group"];

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

const lathe = (pts: [number, number][], seg = 96) => new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), seg);

/* ------------------------------------------------------------------ donut */
export function Donut({ glaze = "#f2a7c3", sprinkles = true, ...props }: G & { glaze?: string; sprinkles?: boolean }) {
  const inst = useRef<THREE.InstancedMesh>(null);
  const { icing, count, sprinkleGeo } = useMemo(() => {
    // icing: upper half of a slightly larger torus with a wavy drip edge
    const g = new THREE.TorusGeometry(1, 0.5, 48, 128);
    const pos = g.attributes.position as THREE.BufferAttribute;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const a = Math.atan2(v.y, v.x);
      const edge = -0.12 + Math.sin(a * 9) * 0.06 + Math.sin(a * 23) * 0.025;
      if (v.z < edge) v.z = edge; // flatten below the drip line onto the dough
      pos.setXYZ(i, v.x * 1.025, v.y * 1.025, v.z * 1.06 + 0.012);
    }
    g.computeVertexNormals();
    return { icing: g, count: sprinkles ? 140 : 0, sprinkleGeo: new THREE.CapsuleGeometry(0.025, 0.11, 4, 8) };
  }, [sprinkles]);

  useLayoutEffect(() => {
    if (!inst.current || !count) return;
    const r = rng(3);
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    const p = new THREE.Vector3();
    const col = new THREE.Color();
    const palette = ["#ffffff", "#2fd69c", "#f6c445", "#7ec8ff", "#c46b31", "#ff6f91"];
    for (let i = 0; i < count; i++) {
      const a = r() * Math.PI * 2;
      const tube = r() * Math.PI * 0.55; // upper side only
      const R = 1 + Math.cos(tube) * 0.53 * (r() > 0.5 ? 1 : -1) * 0.95;
      p.set(Math.cos(a) * R, Math.sin(a) * R, Math.sin(tube) * 0.55 + 0.01);
      e.set(0, 0, r() * Math.PI);
      q.setFromEuler(e); // capsule axis lies in the icing plane
      m.compose(p, q, new THREE.Vector3(1, 1, 1));
      inst.current.setMatrixAt(i, m);
      inst.current.setColorAt(i, col.set(palette[i % palette.length]));
    }
    inst.current.instanceMatrix.needsUpdate = true;
    if (inst.current.instanceColor) inst.current.instanceColor.needsUpdate = true;
  }, [count]);

  return (
    <group {...props}>
      <mesh>
        <torusGeometry args={[1, 0.5, 48, 128]} />
        <meshStandardMaterial color="#d9954e" roughness={0.75} />
      </mesh>
      <mesh geometry={icing}>
        <meshPhysicalMaterial color={glaze} roughness={0.25} clearcoat={0.8} clearcoatRoughness={0.2} />
      </mesh>
      {count > 0 && (
        <instancedMesh ref={inst} args={[sprinkleGeo, undefined, count]}>
          <meshStandardMaterial roughness={0.4} />
        </instancedMesh>
      )}
    </group>
  );
}

/* --------------------------------------------------------------- macarons */
function Macaron({ color, filling = "#f6efe2", ...props }: G & { color: string; filling?: string }) {
  const shell = useMemo(() => lathe([[0, 0], [0.62, 0], [0.7, 0.05], [0.72, 0.12], [0.66, 0.24], [0.48, 0.33], [0.2, 0.37], [0, 0.375]], 64), []);
  const foot = useMemo(() => {
    const g = new THREE.CylinderGeometry(0.66, 0.64, 0.08, 64, 1, true);
    const pos = g.attributes.position as THREE.BufferAttribute;
    const r = rng(color.length);
    for (let i = 0; i < pos.count; i++) {
      const k = 1 + (r() - 0.5) * 0.06;
      pos.setX(i, pos.getX(i) * k);
      pos.setZ(i, pos.getZ(i) * k);
    }
    g.computeVertexNormals();
    return g;
  }, [color]);
  return (
    <group {...props}>
      <mesh geometry={shell} position={[0, 0.2, 0]}>
        <meshStandardMaterial color={color} roughness={0.55} />
      </mesh>
      <mesh geometry={foot} position={[0, 0.16, 0]}>
        <meshStandardMaterial color={color} roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.16, 48]} />
        <meshStandardMaterial color={filling} roughness={0.5} />
      </mesh>
      <mesh geometry={foot} position={[0, -0.04, 0]}>
        <meshStandardMaterial color={color} roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={shell} position={[0, -0.08, 0]} rotation={[Math.PI, 0, 0]}>
        <meshStandardMaterial color={color} roughness={0.55} />
      </mesh>
    </group>
  );
}

export function MacaronStack(props: G) {
  return (
    <group {...props}>
      <Macaron color="#2fd69c" position={[0, -0.9, 0]} />
      <Macaron color="#c88a5a" filling="#5b3220" position={[0.06, -0.2, 0]} rotation={[0.05, 0.6, 0.06]} />
      <Macaron color="#f3b3c6" position={[-0.04, 0.5, 0]} rotation={[-0.06, 1.2, -0.05]} />
      <Macaron color="#f1e3c0" filling="#c46b31" position={[0.9, -0.95, 0.5]} rotation={[0.2, 0.3, 1.3]} />
    </group>
  );
}

/* ------------------------------------------------------------- cake slice */
export function CakeSlice(props: G) {
  const { slice, frost } = useMemo(() => {
    // wedge profile extruded: sponge/cream layers via a canvas texture on the sides
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(1.9, -0.55);
    shape.absarc(0, 0, 1.98, -0.28, 0.28, false);
    shape.lineTo(0, 0);
    const c = document.createElement("canvas");
    c.width = 64;
    c.height = 512;
    const ctx = c.getContext("2d")!;
    const layers = ["#3b1d10", "#f4e6cc", "#4a2516", "#f4e6cc", "#3b1d10", "#f4e6cc", "#4a2516"];
    layers.forEach((col, i) => {
      ctx.fillStyle = col;
      ctx.fillRect(0, (i * c.height) / layers.length, c.width, c.height / layers.length + 1);
    });
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    const geo = new THREE.ExtrudeGeometry(shape, { depth: 1.2, bevelEnabled: false, curveSegments: 32 });
    // planar-map the side UVs to height so layers read as horizontal bands
    geo.computeBoundingBox();
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const uv = geo.attributes.uv as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) uv.setXY(i, 0.5, 1 - pos.getZ(i) / 1.2);
    return { slice: { geo, tex }, frost: new THREE.CapsuleGeometry(0.11, 0.08, 6, 12) };
  }, []);
  const swirls = useMemo(() => [0.5, 1.0, 1.5].map((x, i) => ({ x, i })), []);
  return (
    <group {...props}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <mesh geometry={slice.geo}>
          <meshStandardMaterial map={slice.tex} roughness={0.8} />
        </mesh>
        {/* ganache top */}
        <mesh position={[0, 0, 1.2]} scale={[1, 1, 0.06]} geometry={slice.geo}>
          <meshPhysicalMaterial color="#24100a" roughness={0.2} clearcoat={1} />
        </mesh>
      </group>
      {swirls.map(({ x, i }) => (
        <group key={i} position={[x * 1.05, 1.36, 0]}>
          <mesh geometry={frost} scale={[1.2, 1, 1.2]}>
            <meshStandardMaterial color="#f6efe2" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.2, 0]}>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshPhysicalMaterial color={i === 1 ? "#2fd69c" : "#a3122a"} roughness={0.15} clearcoat={1} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ---------------------------------------------------------------- cupcake */
export function Cupcake({ frosting = "#f3b3c6", ...props }: G & { frosting?: string }) {
  const { liner, swirl } = useMemo(() => {
    const l = new THREE.CylinderGeometry(0.8, 0.6, 0.9, 120, 1, true);
    const pos = l.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const a = Math.atan2(z, x);
      const k = 1 + Math.abs(Math.sin(a * 14)) * 0.035;
      pos.setX(i, x * k);
      pos.setZ(i, z * k);
    }
    l.computeVertexNormals();
    // frosting swirl = a tapering tube along a conical helix
    const pts: THREE.Vector3[] = [];
    for (let t = 0; t <= 1; t += 0.005) {
      const turns = 3.2;
      const r = 0.72 * (1 - t) + 0.02;
      pts.push(new THREE.Vector3(Math.cos(t * turns * Math.PI * 2) * r, t * 0.95, Math.sin(t * turns * Math.PI * 2) * r));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    const tube = new THREE.TubeGeometry(curve, 400, 0.2, 20, false);
    // taper toward the tip
    const tp = tube.attributes.position as THREE.BufferAttribute;
    const c = new THREE.Vector3();
    const v = new THREE.Vector3();
    for (let i = 0; i < tp.count; i++) {
      const seg = Math.floor(i / 21) / 400;
      curve.getPointAt(Math.min(1, seg), c);
      v.fromBufferAttribute(tp, i).sub(c).multiplyScalar(1 - seg * 0.55).add(c);
      tp.setXYZ(i, v.x, v.y, v.z);
    }
    tube.computeVertexNormals();
    return { liner: l, swirl: tube };
  }, []);
  return (
    <group {...props}>
      <mesh geometry={liner} position={[0, -0.45, 0]}>
        <meshStandardMaterial color="#2fd69c" roughness={0.6} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.02, 0]} scale={[1, 0.45, 1]}>
        <sphereGeometry args={[0.82, 48, 24]} />
        <meshStandardMaterial color="#6b3a22" roughness={0.85} />
      </mesh>
      <mesh geometry={swirl} position={[0, 0.2, 0]}>
        <meshPhysicalMaterial color={frosting} roughness={0.45} clearcoat={0.3} />
      </mesh>
      <mesh position={[0, 1.25, 0]}>
        <sphereGeometry args={[0.13, 24, 24]} />
        <meshPhysicalMaterial color="#b0102c" roughness={0.1} clearcoat={1} />
      </mesh>
    </group>
  );
}

/* ----------------------------------------------------------------- cookie */
export function Cookies(props: G) {
  const { dough, chip } = useMemo(() => {
    const g = new THREE.CylinderGeometry(1, 1, 0.24, 64, 3);
    const pos = g.attributes.position as THREE.BufferAttribute;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const a = Math.atan2(v.z, v.x);
      const k = 1 + Math.sin(a * 5) * 0.03 + Math.sin(a * 13) * 0.02;
      // position-based noise so the cap and side seams stay welded (no cracks)
      const bump = v.y > 0 ? (Math.sin(v.x * 9.1) * Math.cos(v.z * 7.3) + Math.sin((v.x + v.z) * 15)) * 0.018 : 0;
      pos.setXYZ(i, v.x * k, v.y + bump + (v.y > 0 ? 0.04 * (1 - Math.hypot(v.x, v.z)) : 0), v.z * k);
    }
    g.computeVertexNormals();
    return { dough: g, chip: new THREE.ConeGeometry(0.11, 0.12, 8) };
  }, []);
  const chips = useMemo(() => {
    const r = rng(19);
    return Array.from({ length: 12 }, () => {
      const a = r() * Math.PI * 2;
      const d = Math.sqrt(r()) * 0.8;
      return [Math.cos(a) * d, 0.16, Math.sin(a) * d] as [number, number, number];
    });
  }, []);
  const one = (pos: [number, number, number], rot: [number, number, number]) => (
    <group position={pos} rotation={rot}>
      <mesh geometry={dough}>
        <meshStandardMaterial color="#c98a4e" roughness={0.9} />
      </mesh>
      {chips.map((p, i) => (
        <mesh key={i} geometry={chip} position={p}>
          <meshStandardMaterial color="#2a140b" roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
  return (
    <group {...props}>
      {one([0, -0.4, 0], [0, 0, 0])}
      {one([0.3, -0.1, -0.2], [0.1, 0.7, 0.08])}
      {one([-0.2, 0.25, 0.1], [0.65, 0.3, -0.2])}
    </group>
  );
}

/* ----------------------------------------------------- hot coffee + saucer */
function latteArt(kind: "heart" | "rosetta" | "espresso") {
  const c = document.createElement("canvas");
  c.width = c.height = 512;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(256, 256, 40, 256, 256, 256);
  if (kind === "espresso") {
    g.addColorStop(0, "#b8743c");
    g.addColorStop(0.7, "#8a4a22");
    g.addColorStop(1, "#4a220e");
  } else {
    g.addColorStop(0, "#c58a4f");
    g.addColorStop(0.75, "#9b5a2a");
    g.addColorStop(1, "#5a2c12");
  }
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 512, 512);
  ctx.fillStyle = "#fbf3e4";
  ctx.filter = "blur(3px)";
  if (kind === "heart") {
    ctx.beginPath();
    ctx.moveTo(256, 380);
    ctx.bezierCurveTo(90, 270, 140, 120, 256, 200);
    ctx.bezierCurveTo(372, 120, 422, 270, 256, 380);
    ctx.fill();
  } else if (kind === "rosetta") {
    for (let i = 0; i < 8; i++) {
      const y = 130 + i * 30;
      const w = 130 - i * 12;
      ctx.beginPath();
      ctx.ellipse(256, y, w, 16, 0, 0, Math.PI);
      ctx.fill();
    }
    ctx.fillRect(250, 110, 12, 300);
  } else {
    // crema speckles
    const r = rng(5);
    ctx.globalAlpha = 0.25;
    for (let i = 0; i < 300; i++) {
      ctx.beginPath();
      ctx.arc(256 + (r() - 0.5) * 380, 256 + (r() - 0.5) * 380, r() * 6, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function CoffeeCup({ art = "heart", color = "#f6efe2", ...props }: G & { art?: "heart" | "rosetta" | "espresso"; color?: string }) {
  const small = art === "espresso";
  const { cup, saucer, handle, top } = useMemo(() => {
    const s = small ? 0.72 : 1;
    const cup = lathe(
      [[0, 0], [0.45 * s, 0], [0.5 * s, 0.03], [0.62 * s, 0.25 * s], [0.78 * s, 0.6 * s], [0.84 * s, 0.82 * s], [0.86 * s, 0.86 * s], [0.82 * s, 0.86 * s], [0.78 * s, 0.82 * s], [0.6 * s, 0.3 * s], [0.4 * s, 0.1], [0, 0.1]],
      96,
    );
    const saucer = lathe([[0, 0], [0.9, 0], [1.3, 0.08], [1.45, 0.16], [1.42, 0.19], [1.25, 0.12], [0.6, 0.06], [0, 0.06]], 96);
    const handle = new THREE.TorusGeometry(0.22 * s, 0.055 * s, 16, 32, Math.PI * 1.3);
    return { cup, saucer, handle, top: latteArt(art), s };
  }, [art, small]);
  const s = small ? 0.72 : 1;
  return (
    <group {...props}>
      <mesh geometry={saucer} position={[0, -0.02, 0]} scale={small ? 0.68 : 1}>
        <meshPhysicalMaterial color={color} roughness={0.25} clearcoat={0.7} />
      </mesh>
      <group position={[0, 0.06, 0]}>
        <mesh geometry={cup}>
          <meshPhysicalMaterial color={color} roughness={0.22} clearcoat={0.8} side={THREE.DoubleSide} />
        </mesh>
        <mesh geometry={handle} position={[0.8 * s, 0.52 * s, 0]} rotation={[0, 0, -Math.PI * 0.65]}>
          <meshPhysicalMaterial color={color} roughness={0.22} clearcoat={0.8} />
        </mesh>
        <mesh position={[0, 0.78 * s, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.775 * s, 64]} />
          <meshStandardMaterial map={top} roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
}

/* --------------------------------------------------------------- affogato */
export function Affogato(props: G) {
  const glass = useMemo(() => lathe([[0, 0], [0.5, 0], [0.55, 0.06], [0.2, 0.16], [0.12, 0.5], [0.3, 0.62], [0.8, 0.9], [0.95, 1.25], [0.96, 1.3]], 96), []);
  const scoop = useMemo(() => {
    const g = new THREE.SphereGeometry(0.55, 64, 48);
    const pos = g.attributes.position as THREE.BufferAttribute;
    const r = rng(8);
    for (let i = 0; i < pos.count; i++) {
      const k = 1 + (r() - 0.5) * 0.04;
      pos.setXYZ(i, pos.getX(i) * k, pos.getY(i) * k * 0.92, pos.getZ(i) * k);
    }
    g.computeVertexNormals();
    return g;
  }, []);
  return (
    <group {...props}>
      <mesh position={[0, 1.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.86, 64]} />
        <meshPhysicalMaterial color="#4a220e" roughness={0.15} clearcoat={1} />
      </mesh>
      <mesh geometry={scoop} position={[0, 1.3, 0]}>
        <meshStandardMaterial color="#f8efdc" roughness={0.75} />
      </mesh>
      {/* espresso pour running down the scoop */}
      <mesh position={[0.18, 1.55, 0.36]} rotation={[0.5, 0, -0.3]} scale={[1, 1, 0.5]}>
        <capsuleGeometry args={[0.09, 0.35, 8, 16]} />
        <meshPhysicalMaterial color="#5a2a10" roughness={0.1} clearcoat={1} />
      </mesh>
      <mesh geometry={glass}>
        <meshPhysicalMaterial color="#ffffff" roughness={0.03} transparent opacity={0.22} clearcoat={1} envMapIntensity={2.5} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  );
}
