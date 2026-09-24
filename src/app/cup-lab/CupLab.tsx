"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { NeutralToneMapping, type Group } from "three";
import { CupModel } from "@/components/cup/CupModel";
import { PageShadow } from "@/components/cup/PageShadow";
import { Studio } from "@/components/cup/Studio";

const DEG = Math.PI / 180;

// Spec: floating lid at +0.5 × cup height, offset away from the text (right), rotZ ~18°.
// S2 pose: rotY 180° (logo side front), then rotX 20° toward the camera.
const LID_CLOSED = { x: 0, y: 0.5, rotZ: 0 };
const LID_FLOATING = { x: 0.3, y: 1, rotZ: 18 * DEG };
const S2_ROTATION = [20 * DEG, 180 * DEG, 0] as const;

export function CupLab() {
  const [lidOpen, setLidOpen] = useState(false);
  const [s2, setS2] = useState(false);
  const [steam, setSteam] = useState(0);
  const lidRef = useRef<Group>(null);
  const steamAmount = useRef(0);

  useEffect(() => {
    steamAmount.current = steam;
  }, [steam]);

  useEffect(() => {
    const pose = lidOpen ? LID_FLOATING : LID_CLOSED;
    // The lid lives in cup space; the S2 spin mirrors x, so flip it to keep the lid on the right on screen.
    const mirror = s2 ? -1 : 1;
    lidRef.current?.position.set(pose.x * mirror, pose.y, 0);
    lidRef.current?.rotation.set(0, 0, pose.rotZ * mirror);
  }, [lidOpen, s2]);

  return (
    <div className="fixed inset-0">
      <Canvas
        dpr={[1, 2]}
        shadows="variance"
        gl={{ alpha: true, antialias: true, toneMapping: NeutralToneMapping }}
        camera={{ fov: 25, position: [0, 0.4, 6] }}
      >
        <Studio />
        <group rotation={s2 ? S2_ROTATION : [0, 0, 0]}>
          <CupModel lidRef={lidRef} steamAmount={steamAmount} />
        </group>
        <PageShadow />
        <OrbitControls makeDefault target={[0, 0.2, 0]} />
      </Canvas>

      <div className="type-label absolute top-4 left-4 flex flex-col gap-3 bg-white p-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={lidOpen} onChange={(e) => setLidOpen(e.target.checked)} />
          Kapak havada
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={s2} onChange={(e) => setS2(e.target.checked)} />
          S2 duruşu (rotY 180°, rotX 20°)
        </label>
        <label className="flex flex-col gap-1">
          Buhar: {steam.toFixed(2)}
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={steam}
            onChange={(e) => setSteam(Number(e.target.value))}
          />
        </label>
      </div>
    </div>
  );
}
