"use client";

import { useEffect } from "react";
import { advance, Canvas } from "@react-three/fiber";
import { NeutralToneMapping } from "three";
import { onFrame } from "@/lib/frameLoop";
import { CupRig } from "./CupRig";
import { Studio } from "./Studio";

export default function CupCanvas() {
  // Rendered by the page's frame loop (SmoothScroll), right after the scroll moves, instead of R3F's own loop.
  useEffect(() => onFrame((time) => advance(time)), []);

  return (
    <Canvas
      aria-hidden="true"
      frameloop="never"
      // Variance shadow maps: soft-edged page shadow (PageShadow).
      shadows="variance"
      // Capped below 2: ~25% fewer pixels per frame on retina screens, no visible difference on the cup.
      dpr={[1, 1.75]}
      // Neutral tone mapping keeps the white cup white against the orange page.
      gl={{ alpha: true, antialias: true, toneMapping: NeutralToneMapping }}
      // Low FOV keeps off-center distortion small, so the cup matches its slot anywhere on screen.
      camera={{ fov: 25, position: [0, 0, 10], near: 0.1, far: 100 }}
      // Above the HTML so the headline can emerge from behind the cup; never moved behind to fix clicks.
      style={{ position: "fixed", inset: 0, zIndex: "var(--z-cup)", pointerEvents: "none" }}
    >
      <Studio />
      <CupRig />
    </Canvas>
  );
}
