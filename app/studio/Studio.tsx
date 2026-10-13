"use client";

/**
 * Dev-only render studio. scripts/render.mjs opens /studio?scene=… in headless
 * Chromium and snapshots the canvas to produce the static WebP imagery used
 * across the site (hero posters, product shots, beans, ice). One 3D toolkit,
 * one consistent look — and zero WebGL cost on the sections that don't need it live.
 */
import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { Cup, CUP_POSE } from "@/components/three/Cup";
import { Lights } from "@/components/three/Lights";
import { IcedGlass, type IcedVariant } from "@/components/three/IcedGlass";
import { BeanBowl, Bean, IceCube } from "@/components/three/Beans";

function Ready() {
  const gl = useThree((s) => s.gl);
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    // frameloop="demand": render a handful of frames (env map, textures settle) then stop
    let n = 0;
    const id = setInterval(() => {
      invalidate();
      if (++n > 5) {
        clearInterval(id);
        setTimeout(() => {
          (window as unknown as { __ready: boolean }).__ready = true;
          gl.domElement.dataset.ready = "1";
        }, 400);
      }
    }, 300);
    return () => clearInterval(id);
  }, [gl, invalidate]);
  return null;
}

function Scene({ scene }: { scene: string }) {
  if (scene === "cup-tilt") return <Cup variant="classic" rotation={[0.25, -0.5, -0.32]} position={[0, -0.1, 0]} />;
  if (scene.startsWith("cup-")) {
    const v = scene.slice(4) as "classic" | "ripple" | "double";
    return <Cup variant={v} position={CUP_POSE.position} rotation={CUP_POSE.rotation} />;
  }
  if (scene.startsWith("iced-")) {
    return <IcedGlass variant={scene.slice(5) as IcedVariant} rotation={[0.14, 0.3, 0]} position={[0, -0.3, 0]} />;
  }
  if (scene === "beans") return <BeanBowl rotation={[0.55, 0, 0]} position={[0, -0.2, 0]} />;
  if (scene === "bean") return <Bean scale={1.15} rotation={[0.9, 0.3, 0.7]} />;
  if (scene === "ice") return <IceCube scale={2.2} rotation={[0.5, 0.6, 0.2]} />;
  return null;
}

const CAMS: Record<string, { z: number; fov: number }> = {
  cup: { z: 10.6, fov: 18 },
  iced: { z: 12.2, fov: 18 },
  beans: { z: 9.5, fov: 22 },
  bean: { z: 6, fov: 18 },
  ice: { z: 6, fov: 18 },
};

export default function Studio() {
  const [scene, setScene] = useState<string | null>(null);
  const [size, setSize] = useState({ w: 800, h: 1000 });
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const s = q.get("scene") ?? "cup-classic";
    setSize({ w: Number(q.get("w") ?? 800), h: Number(q.get("h") ?? 1000) });
    // wait for the display font so cup print text renders correctly
    document.fonts.load(`80px ${getComputedStyle(document.documentElement).getPropertyValue("--font-display")}`).then(() => setScene(s));
  }, []);
  if (!scene) return null;
  const key = scene.startsWith("cup") ? "cup" : scene.startsWith("iced") ? "iced" : scene;
  const cam = CAMS[key] ?? CAMS.cup;
  return (
    <div style={{ width: size.w, height: size.h, background: "transparent" }}>
      <Canvas
        id="studio"
        dpr={2}
        frameloop="demand"
        gl={{ preserveDrawingBuffer: true, alpha: true, antialias: true }}
        camera={{ position: [0, 0, cam.z], fov: cam.fov }}
        style={{ width: size.w, height: size.h }}
      >
        <Suspense fallback={null}>
          <Lights />
          <Scene scene={scene} />
          <Ready />
        </Suspense>
      </Canvas>
    </div>
  );
}
