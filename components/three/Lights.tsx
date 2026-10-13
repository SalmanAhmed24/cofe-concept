"use client";

import { Environment, Lightformer } from "@react-three/drei";

/**
 * Procedural studio lighting — no HDR download, so it works offline and costs
 * zero network requests. Lightformers give the glossy lids a soft-box reflection.
 */
export function Lights({ warm = "#fff4e2" }: { warm?: string }) {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 6]} intensity={2.1} color={warm} />
      <directionalLight position={[-6, 2, 3]} intensity={0.6} color="#c9fff0" />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3} position={[0, 3, 6]} scale={[10, 3, 1]} />
        <Lightformer form="rect" intensity={1.6} position={[-6, 1, 2]} rotation-y={Math.PI / 2} scale={[8, 4, 1]} color="#bfffe9" />
        <Lightformer form="rect" intensity={2} position={[6, 1, 1]} rotation-y={-Math.PI / 2} scale={[8, 4, 1]} />
        <Lightformer form="ring" intensity={1.2} position={[0, 6, -4]} scale={4} />
        <color attach="background" args={["#24443a"]} />
      </Environment>
    </>
  );
}
