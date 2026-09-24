"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { NeutralToneMapping, type Group } from "three";
import { S1, S2 } from "@/components/cup/choreography";
import { CupModel } from "@/components/cup/CupModel";
import { PageShadow } from "@/components/cup/PageShadow";
import { Studio } from "@/components/cup/Studio";

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
    // Same poses and projection as CupRig: the lid lives in cup space, so the S2 spin (cos 180° = −1) is undone.
    const pose = lidOpen ? S2.lid : S1.lid;
    const facing = s2 ? -1 : 1;
    lidRef.current?.position.set(pose.x * facing, pose.y, 0);
    lidRef.current?.rotation.set(0, 0, pose.rotZ * facing);
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
        <group rotation={s2 ? S2.rotation : [0, 0, 0]}>
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
