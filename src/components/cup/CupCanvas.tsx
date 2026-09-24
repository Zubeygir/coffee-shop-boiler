"use client";

import { useEffect, useRef } from "react";
import { advance, Canvas } from "@react-three/fiber";
import { NeutralToneMapping } from "three";
import { onFrame } from "@/lib/frameLoop";
import { CupRig } from "./CupRig";
import { useIntro } from "./IntroProvider";
import { Studio } from "./Studio";

export default function CupCanvas() {
  const { phase } = useIntro();
  const cupSectionsInView = useRef(true);

  // The cup only lives in the hero and the reveal section. While both are off-screen (Menu, Contact) the canvas
  // stops rendering: no GPU work while reading. The margin restarts it just before a section comes back, and the
  // last frame drawn before the pause already has the cup off-screen.
  useEffect(() => {
    const sections = [document.getElementById("top"), document.getElementById("hikaye")].filter(
      (section): section is HTMLElement => section !== null,
    );
    const inView = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) inView.add(entry.target);
          else inView.delete(entry.target);
        }
        cupSectionsInView.current = inView.size > 0;
      },
      { rootMargin: "25% 0px" },
    );
    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Rendered by the page's frame loop (SmoothScroll), right after the scroll moves, instead of R3F's own loop.
  useEffect(
    () =>
      onFrame((time) => {
        if (cupSectionsInView.current) advance(time);
      }),
    [],
  );

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
      // Fades in once the phase leaves `loading`: the cup's entrance wherever there is no drop (reduced motion,
      // reloads mid-page), so it never pops in. During a drop it starts off-screen, so the fade goes unnoticed.
      style={{
        position: "fixed",
        inset: 0,
        zIndex: "var(--z-cup)",
        pointerEvents: "none",
        opacity: phase === "loading" ? 0 : 1,
        transition: "opacity var(--duration-entrance) var(--ease-out-quart)",
      }}
    >
      <Studio />
      <CupRig />
    </Canvas>
  );
}
