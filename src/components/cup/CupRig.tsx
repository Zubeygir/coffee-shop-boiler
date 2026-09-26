"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { easing } from "maath";
import type { Group } from "three";
import {
  applyDrop,
  computeCupPose,
  createCupPose,
  createSlotPose,
  DAMPING,
  DROP,
  dropRemaining,
  slotToWorld,
  transitionProgress,
} from "./choreography";
import { CupModel } from "./CupModel";
import { useIntro } from "./IntroProvider";
import { PageShadow } from "./PageShadow";

type Anchors = { hero: Element; reveal: Element; section: Element };

function findAnchors(): Anchors | null {
  const hero = document.querySelector('[data-cup-slot="hero"]');
  const reveal = document.querySelector('[data-cup-slot="reveal"]');
  const section = document.getElementById("hikaye");
  return hero && reveal && section ? { hero, reveal, section } : null;
}

/**
 * Drives the cup every frame: slot rects → choreography pose → the scene graph.
 * Only the transition progress is damped; the position is recomputed from the live slots each frame,
 * so the cup never trails behind its text on fast scrolls.
 *
 * Intro: `intro-pending` on <html> (set by the head script in layout.tsx on a cold load at the top of the page)
 * means the cup waits hidden for the web font, then drops into the hero slot; on landing the phase turns `ready`
 * and HeroIntro slides the headline in. Without the class the cup appears in its current pose right away.
 */
export function CupRig() {
  const { phase, setPhase, reducedMotion } = useIntro();
  const rig = useRef<Group>(null);
  const tilt = useRef<Group>(null);
  const lid = useRef<Group>(null);
  const anchors = useRef<Anchors | null>(null);
  const progress = useRef<{ cup: number; lid: number } | null>(null);
  const pose = useRef(createCupPose());
  const heroSlot = useRef(createSlotPose());
  const revealSlot = useRef(createSlotPose());
  const steamAmount = useRef(0);
  const fontsReady = useRef(false);
  const dropStart = useRef<number | null>(null);

  useEffect(() => {
    document.fonts.ready.then(() => {
      fontsReady.current = true;
    });
  }, []);

  useFrame(({ size, viewport, clock }, delta) => {
    anchors.current ??= findAnchors();
    if (!anchors.current || !rig.current || !tilt.current || !lid.current) return;

    if (phase === "loading" && dropStart.current === null) {
      const pending = document.documentElement.classList.contains("intro-pending") && window.scrollY === 0;
      if (!pending) {
        setPhase("ready");
      } else if (fontsReady.current) {
        // From here the intro owns the reveal: cancel the head script's failsafe.
        window.clearTimeout(window.__introFailsafe);
        dropStart.current = clock.elapsedTime;
        setPhase("dropping");
      } else {
        // Plain orange page until the font is in (no loader).
        rig.current.visible = false;
        return;
      }
    }
    rig.current.visible = true;

    const heroRect = anchors.current.hero.getBoundingClientRect();
    const revealRect = anchors.current.reveal.getBoundingClientRect();
    const sectionTop = anchors.current.section.getBoundingClientRect().top;

    const target = transitionProgress(
      sectionTop,
      revealRect.top + revealRect.height / 2,
      revealRect.bottom,
      size.height,
    );
    // First frame (e.g. a reload mid-page): start at the current scroll position instead of animating from 0.
    progress.current ??= { cup: target, lid: target };
    easing.damp(progress.current, "cup", target, DAMPING.cup, delta);
    easing.damp(progress.current, "lid", target, DAMPING.lid, delta);

    const p = computeCupPose(
      pose.current,
      slotToWorld(heroRect, size, viewport, heroSlot.current),
      slotToWorld(revealRect, size, viewport, revealSlot.current),
      progress.current.cup,
      progress.current.lid,
      clock.elapsedTime,
      reducedMotion,
    );

    if (dropStart.current !== null && phase !== "ready") {
      // Starts one viewport height above its slot: fully off-screen.
      const remaining = dropRemaining(clock.elapsedTime - dropStart.current);
      applyDrop(p, remaining, viewport.height);
      if (remaining < DROP.settled) setPhase("ready");
    }

    rig.current.position.set(p.x, p.y, 0);
    rig.current.scale.setScalar(p.scale);
    tilt.current.rotation.set(p.rotX, p.rotY, p.rotZ);
    tilt.current.position.y = p.bob;
    // The lid lives in cup space: the Y spin would mirror its offset, so project it back to stay on screen-right.
    const facing = Math.cos(p.rotY);
    lid.current.position.set(p.lidX * facing, p.lidY, 0);
    lid.current.rotation.set(0, 0, p.lidRotZ * facing);
    steamAmount.current = p.steam;
  });

  return (
    <group ref={rig}>
      <group ref={tilt}>
        <CupModel lidRef={lid} steamAmount={steamAmount} />
      </group>
      {/* Scaled with the cup, not rotated: the page stays flat behind it. */}
      <PageShadow />
    </group>
  );
}
