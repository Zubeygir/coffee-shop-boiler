"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3, type DirectionalLight, type Group, type Object3D } from "three";
import { brandHex } from "@/lib/colors";

// In cup units (the parent group carries the cup's scale).
const PAGE_DEPTH = 0.35; // how far behind the cup the page sits: sets how far the shadow falls
const LIGHT_POSITION = [-2, 3, 4] as const; // top left, in front: the shadow falls down and to the right
const SHADOW_EXTENT = 1.6; // half-size of the shadow camera around the cup

/**
 * The cup's shadow on the page itself: a shadow-only plane just behind the cup, lit from the top left.
 * Drawn on the canvas above the HTML, it darkens the orange page and the text under it, so the cup reads as an
 * object standing in front of the page. Must sit inside the cup's scaled group but outside its rotation.
 */
export function PageShadow() {
  const root = useRef<Group>(null);
  const light = useRef<DirectionalLight>(null);
  const target = useRef<Object3D>(null);
  const worldScale = useRef(new Vector3());

  useEffect(() => {
    if (light.current && target.current) light.current.target = target.current;
  }, []);

  // The shadow camera ignores the parent's scale, so its bounds follow the cup's current world size.
  useFrame(() => {
    if (!root.current || !light.current) return;
    const extent = SHADOW_EXTENT * root.current.getWorldScale(worldScale.current).x;
    const camera = light.current.shadow.camera;
    if (camera.right !== extent) {
      camera.left = -extent;
      camera.right = extent;
      camera.top = extent;
      camera.bottom = -extent;
      camera.updateProjectionMatrix();
    }
  });

  return (
    <group ref={root}>
      {/* Low intensity: the environment lights the cup; this light exists for the shadow, whose darkness comes
          from the shadow material, not from the light. */}
      <directionalLight
        ref={light}
        position={LIGHT_POSITION}
        intensity={0.4}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-radius={14}
        shadow-blurSamples={16}
        shadow-bias={-0.0005}
      />
      <object3D ref={target} />
      <mesh position-z={-PAGE_DEPTH} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <shadowMaterial color={brandHex.char} opacity={0.35} transparent />
      </mesh>
    </group>
  );
}
