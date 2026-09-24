"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard } from "@react-three/drei";
import { CanvasTexture, MathUtils, type Group, type MeshBasicMaterial } from "three";

type Point = readonly [number, number, number];

type SteamProps = {
  /** 0 = thin wisp from the sip hole, 1 = full steam from the open cup. Read every frame. */
  amount: RefObject<number>;
  wispOrigin: Point;
  fullOrigin: Point;
};

const PUFFS = 6;
const RISE_SPEED = 0.35;

// Soft round alpha blob, generated at runtime so there is no texture file to load.
function createPuffTexture(): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.45, "rgba(255, 255, 255, 0.45)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
  }
  return new CanvasTexture(canvas);
}

export function Steam({ amount, wispOrigin, fullOrigin }: SteamProps) {
  const puffs = useRef<(Group | null)[]>([]);
  const materials = useRef<(MeshBasicMaterial | null)[]>([]);
  const texture = useMemo(() => createPuffTexture(), []);

  useEffect(() => () => texture.dispose(), [texture]);

  // Mutates existing objects only: no allocations per frame.
  useFrame(({ clock }) => {
    const a = amount.current;
    const x = MathUtils.lerp(wispOrigin[0], fullOrigin[0], a);
    const y = MathUtils.lerp(wispOrigin[1], fullOrigin[1], a);
    const z = MathUtils.lerp(wispOrigin[2], fullOrigin[2], a);
    const spread = MathUtils.lerp(0.02, 0.12, a);
    const rise = MathUtils.lerp(0.45, 0.8, a);
    const baseSize = MathUtils.lerp(0.06, 0.18, a);
    const growth = MathUtils.lerp(0.12, 0.4, a);
    const peakOpacity = MathUtils.lerp(0.18, 0.35, a);

    for (let i = 0; i < PUFFS; i++) {
      const puff = puffs.current[i];
      const material = materials.current[i];
      if (!puff || !material) continue;

      // Each puff runs the same 0 → 1 life cycle, offset so they rise one after another.
      const life = (clock.elapsedTime * RISE_SPEED + i / PUFFS) % 1;
      puff.position.set(x + Math.sin(life * 6 + i * 1.7) * spread, y + life * rise, z);
      puff.scale.setScalar(baseSize + life * growth);
      material.opacity = Math.sin(life * Math.PI) * peakOpacity;
    }
  });

  return (
    <>
      {Array.from({ length: PUFFS }, (_, i) => (
        <Billboard
          key={i}
          ref={(group) => {
            puffs.current[i] = group;
          }}
        >
          <mesh>
            <planeGeometry />
            <meshBasicMaterial
              ref={(material) => {
                materials.current[i] = material;
              }}
              map={texture}
              transparent
              opacity={0}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        </Billboard>
      ))}
    </>
  );
}
