// Pure choreography math: no React or three.js imports. All spec numbers live here.
// Spec: docs/3d-cup-scroll-spec.md (stations, transition window, reveal halves, lid floating, idle).

export type ScreenRect = { left: number; top: number; width: number; height: number };
export type Size = { width: number; height: number };

/** A slot mapped to world space: its center, and its width in world units. */
export type SlotPose = { x: number; y: number; width: number };

const DEG = Math.PI / 180;

type LidPose = { x: number; y: number; rotZ: number };

type Station = {
  /** Cup rotation [x, y, z]. */
  rotation: readonly [number, number, number];
  /**
   * How many cup heights the slot's width represents. Both slots are sized from the CSS `--cup-size`
   * (hero: 0.9 ×, reveal: 1.12 ×), so the cup has the same size at both stations.
   */
  slotWidthUnits: number;
  /** Cup center relative to the slot center, in cup units. */
  offset: readonly [number, number];
  /** Lid group pose in cup space; its pivot sits on the cup's top edge (y = 0.5) when closed. */
  lid: LidPose;
  steam: number;
};

// S1: centered in the hero slot, leaning, lid closed, a wisp from the sip hole.
export const S1: Station = {
  rotation: [0, 0, -8 * DEG],
  slotWidthUnits: 0.9,
  offset: [0, -0.03],
  lid: { x: 0, y: 0.5, rotZ: 0 },
  steam: 0,
};

// S2: logo side front, tilted toward the camera. The cup stands left of the story text, so the top-left key light
// throws its page shadow onto the paragraph (as it falls on the headline in the hero). The lid floats +0.5 cup
// heights up and to the left, away from the text. The 16:25 reveal slot (1.12 × 1.75 cup heights) holds cup + lid,
// measured by projecting this pose (RevealSection's shape-outside polygon comes from the same projection).
export const S2: Station = {
  rotation: [20 * DEG, 180 * DEG, 0],
  slotWidthUnits: 1.12,
  offset: [0.13, -0.3],
  lid: { x: -0.3, y: 1, rotZ: -18 * DEG },
  steam: 1,
};

/** How far the path dips at the midpoint of the move, in cup heights. */
const ARC_DIP = 0.12;

const IDLE = {
  bob: 0.015,
  bobPeriod: 3.2,
  sway: 6 * DEG,
  swayPeriod: 5.5,
  lidBob: 0.02,
  lidBobPeriod: 2.7,
  lidBobPhase: 1.9,
};

/**
 * Intro drop (spec → Intro): from above the viewport at rotZ −25° / rotY −40° into the S1 pose.
 * Critically damped spring: remaining = (1 + ωt)·e^(−ωt), which never overshoots (no bounce). ω = 5.5 settles in
 * ~1.2 s; `settled` is the remaining fraction at which the cup counts as landed and the headline starts.
 */
export const DROP = {
  omega: 5.5,
  settled: 0.01,
  rotZ: -25 * DEG,
  rotY: -40 * DEG,
} as const;

/** Fraction of the drop still to go, 1 → 0, `elapsed` seconds after it started. */
export function dropRemaining(elapsed: number): number {
  const wt = DROP.omega * Math.max(0, elapsed);
  return (1 + wt) * Math.exp(-wt);
}

/**
 * Offsets a pose by the remaining drop: `height` is how far above its slot the cup starts, in world units
 * (one viewport height puts it fully off-screen). Rotations blend from the drop's start angles to the pose's own.
 */
export function applyDrop(pose: CupPose, remaining: number, height: number): CupPose {
  pose.y += remaining * height;
  pose.rotZ += remaining * (DROP.rotZ - S1.rotation[2]);
  pose.rotY += remaining * (DROP.rotY - S1.rotation[1]);
  return pose;
}

/**
 * Transition smoothing, in seconds: the choreography glides after the scroll, and the lid lags behind the cup.
 * Only the progress is damped, so at rest the cup still sits exactly on its slot.
 */
export const DAMPING = { cup: 0.35, lid: 0.55 } as const;

export function createSlotPose(): SlotPose {
  return { x: 0, y: 0, width: 0 };
}

/**
 * Maps a slot's screen rect to world space on the z = 0 plane, written into `out` (no allocation per frame).
 * `viewport` is the visible world size at z = 0, `size` the canvas size in pixels (the canvas covers the viewport).
 */
export function slotToWorld(rect: ScreenRect, size: Size, viewport: Size, out: SlotPose): SlotPose {
  const unitsPerPixel = viewport.width / size.width;
  out.x = (rect.left + rect.width / 2 - size.width / 2) * unitsPerPixel;
  out.y = (size.height / 2 - (rect.top + rect.height / 2)) * unitsPerPixel;
  out.width = rect.width * unitsPerPixel;
  return out;
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const lerp = (from: number, to: number, t: number) => from + (to - from) * t;
const segment = (t: number, from: number, to: number) => clamp01((t - from) / (to - from));
const sineInOut = (t: number) => (1 - Math.cos(Math.PI * t)) / 2;
const smoothstep = (t: number) => t * t * (3 - 2 * t);

/**
 * S1 → S2 progress from the page's scroll position.
 * 0 until the reveal section's top reaches the viewport bottom; 1 once the reveal slot's center reaches the
 * viewport center. Both edges move with the scroll, so the same formula runs backwards when scrolling up.
 */
export function transitionProgress(revealSectionTop: number, revealSlotCenterY: number, viewportHeight: number): number {
  const travelled = viewportHeight - revealSectionTop;
  const remaining = revealSlotCenterY - viewportHeight / 2;
  const span = travelled + remaining;
  if (span <= 0) return travelled > 0 ? 1 : 0;
  return clamp01(travelled / span);
}

export type CupPose = {
  x: number;
  y: number;
  scale: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  /** Idle bob, in cup units. */
  bob: number;
  lidX: number;
  lidY: number;
  lidRotZ: number;
  steam: number;
};

export function createCupPose(): CupPose {
  return { x: 0, y: 0, scale: 1, rotX: 0, rotY: 0, rotZ: 0, bob: 0, lidX: 0, lidY: 0, lidRotZ: 0, steam: 0 };
}

/**
 * Writes the cup's pose into `out` (no allocation per frame).
 * `cupT` and `lidT` are the damped transition progress for the cup and the (lagging) lid; `time` drives idle motion.
 *
 * The vertical travel spans the whole window: the two slots scroll past at the same speed, so the cup stays near
 * the viewport center while the page moves under it (finishing the travel at t = 0.5 would chase the reveal slot
 * while it is still at the viewport bottom). 1st half: move sideways along a dipping arc, straighten; the 180° spin
 * runs a little longer (to t = 0.6) so it reads clearly. 2nd half: lid lifts, cup tilts, steam grows.
 * Reduced motion (spec): no Y spin and no idle motion; the scroll-driven travel, lid lift and tilt stay.
 */
export function computeCupPose(
  out: CupPose,
  hero: SlotPose,
  reveal: SlotPose,
  cupT: number,
  lidT: number,
  time: number,
  reducedMotion: boolean,
): CupPose {
  // Sine in-out everywhere: soft starts and stops, no sudden acceleration mid-scroll.
  const travel = smoothstep(cupT);
  const shift = sineInOut(segment(cupT, 0, 0.5));
  const spin = reducedMotion ? 0 : sineInOut(segment(cupT, 0, 0.6));
  const idle = reducedMotion ? 0 : 1;
  const settle = sineInOut(segment(cupT, 0.5, 1));
  const lift = sineInOut(segment(lidT, 0.5, 1));

  const heroScale = hero.width / S1.slotWidthUnits;
  const revealScale = reveal.width / S2.slotWidthUnits;
  out.scale = lerp(heroScale, revealScale, travel);

  const heroX = hero.x + S1.offset[0] * heroScale;
  const heroY = hero.y + S1.offset[1] * heroScale;
  const revealX = reveal.x + S2.offset[0] * revealScale;
  const revealY = reveal.y + S2.offset[1] * revealScale;
  out.x = lerp(heroX, revealX, shift);
  out.y = lerp(heroY, revealY, travel) - ARC_DIP * out.scale * Math.sin(Math.PI * shift);

  const sway = Math.sin((time / IDLE.swayPeriod) * Math.PI * 2) * IDLE.sway * idle;
  out.rotX = lerp(S1.rotation[0], S2.rotation[0], settle);
  out.rotY = lerp(S1.rotation[1], S2.rotation[1], spin) + sway;
  out.rotZ = lerp(S1.rotation[2], S2.rotation[2], shift);
  out.bob = Math.sin((time / IDLE.bobPeriod) * Math.PI * 2) * IDLE.bob * idle;

  const lidBob = Math.sin((time / IDLE.lidBobPeriod) * Math.PI * 2 + IDLE.lidBobPhase) * IDLE.lidBob * lift * idle;
  out.lidX = lerp(S1.lid.x, S2.lid.x, lift);
  out.lidY = lerp(S1.lid.y, S2.lid.y, lift) + lidBob;
  out.lidRotZ = lerp(S1.lid.rotZ, S2.lid.rotZ, lift);
  out.steam = lerp(S1.steam, S2.steam, settle);

  return out;
}
