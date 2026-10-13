"use client";

import { forwardRef, useMemo } from "react";
import * as THREE from "three";
import type { ThreeElements } from "@react-three/fiber";
import { CUP_COLORS, getCupTexture, type CupVariant } from "./cupTextures";

/** Cup dimensions in world units; total height (incl. lid) ≈ 2.8 */
export const CUP = { h: 2.45, rb: 0.6, rt: 0.86 };

/** Pose shared by the studio poster render and the live hero so they line up 1:1. */
export const CUP_POSE = {
  position: [0, -0.16, 0] as [number, number, number],
  rotation: [0.08, 0, 0] as [number, number, number],
  /** studio camera: fov 18 at z 10.6 -> visible world height */
  fov: 18,
  z: 10.6,
};

function bodyGeometry(variant: CupVariant) {
  const ripple = variant === "ripple";
  const radial = ripple ? 360 : 128;
  const geo = new THREE.CylinderGeometry(CUP.rt, CUP.rb, CUP.h, radial, 12, true);
  if (ripple) {
    // corrugated "ripple wall": rounded vertical ridges that fade out near the rim & base
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const v = new THREE.Vector3();
    const ridges = 44;
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const a = Math.atan2(v.z, v.x);
      const yN = (v.y + CUP.h / 2) / CUP.h;
      const fade = THREE.MathUtils.smoothstep(yN, 0.03, 0.1) * (1 - THREE.MathUtils.smoothstep(yN, 0.9, 0.97));
      const ridge = Math.pow(Math.abs(Math.cos((a * ridges) / 2)), 0.6);
      const k = 1 + ridge * 0.028 * fade;
      pos.setXYZ(i, v.x * k, v.y, v.z * k);
    }
    geo.computeVertexNormals();
  }
  return geo;
}

function lidGeometry() {
  // profile (radius, y) from the centre outwards; y=0 sits at the rim
  const p: [number, number][] = [
    [0, 0.13], [0.5, 0.13], [0.6, 0.14], [0.66, 0.2], [0.7, 0.245], [0.77, 0.25],
    [0.82, 0.23], [0.85, 0.18], [0.86, 0.12], [0.885, 0.1], [0.905, 0.07], [0.91, 0.0],
    [0.905, -0.07], [0.88, -0.085],
  ];
  return new THREE.LatheGeometry(p.map(([x, y]) => new THREE.Vector2(x, y)), 128);
}

type CupProps = ThreeElements["group"] & { variant: CupVariant };

export const Cup = forwardRef<THREE.Group, CupProps>(function Cup({ variant, ...props }, ref) {
  const { body, lid, inner, map, colors } = useMemo(() => {
    return {
      body: bodyGeometry(variant),
      lid: lidGeometry(),
      inner: new THREE.CylinderGeometry(CUP.rt * 0.985, CUP.rb * 0.985, CUP.h * 0.99, 64, 1, true),
      map: getCupTexture(variant),
      colors: CUP_COLORS[variant],
    };
  }, [variant]);

  return (
    <group ref={ref} {...props} dispose={null}>
      {/* paper body */}
      <mesh geometry={body} castShadow receiveShadow>
        <meshStandardMaterial map={map} roughness={variant === "classic" ? 0.48 : 0.62} metalness={0} />
      </mesh>
      <mesh geometry={inner}>
        <meshStandardMaterial color="#e9dfcc" side={THREE.BackSide} roughness={0.8} />
      </mesh>
      {/* base */}
      <mesh position={[0, -CUP.h / 2 + 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[CUP.rb * 0.99, 48]} />
        <meshStandardMaterial color={colors.base} roughness={0.7} />
      </mesh>
      {/* rolled rim */}
      <mesh position={[0, CUP.h / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[CUP.rt + 0.005, 0.03, 12, 96]} />
        <meshStandardMaterial color="#f5efe3" roughness={0.6} />
      </mesh>
      {/* plastic lid */}
      <group position={[0, CUP.h / 2 + 0.02, 0]}>
        <mesh geometry={lid} castShadow>
          <meshPhysicalMaterial
            color={colors.lid}
            roughness={0.28}
            metalness={0.05}
            clearcoat={1}
            clearcoatRoughness={0.18}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* sip hole */}
        <mesh position={[0, 0.252, 0.735]} rotation={[-Math.PI / 2, 0, 0]} scale={[1, 0.45, 1]}>
          <circleGeometry args={[0.09, 24]} />
          <meshBasicMaterial color="#000" />
        </mesh>
      </group>
    </group>
  );
});
