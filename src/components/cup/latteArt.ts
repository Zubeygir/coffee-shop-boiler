import { CanvasTexture, SRGBColorSpace } from "three";

// Procedural latte art: a rosetta of stacked foam leaves over mottled crema, drawn once at runtime.
// Returns a color map plus bump and roughness maps (foam sits slightly proud and is matte; crema is glossier).
// The coffee disc's UVs map this square's inscribed circle to the cup wall.

const SIZE = 1024;
const C = SIZE / 2;

// Deterministic: the same rosetta on every load.
function createRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Smooth value noise on a wrapping grid, summed over a few octaves.
function createNoise(random: () => number): (x: number, y: number) => number {
  const GRID = 64;
  const values = Float32Array.from({ length: GRID * GRID }, random);
  const at = (x: number, y: number) => values[((y % GRID) + GRID) % GRID * GRID + (((x % GRID) + GRID) % GRID)];
  const smooth = (t: number) => t * t * (3 - 2 * t);

  const octave = (x: number, y: number) => {
    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const sx = smooth(x - x0);
    const sy = smooth(y - y0);
    const top = at(x0, y0) + (at(x0 + 1, y0) - at(x0, y0)) * sx;
    const bottom = at(x0, y0 + 1) + (at(x0 + 1, y0 + 1) - at(x0, y0 + 1)) * sx;
    return top + (bottom - top) * sy;
  };

  return (x, y) => octave(x, y) * 0.55 + octave(x * 2.1, y * 2.1) * 0.3 + octave(x * 4.3, y * 4.3) * 0.15;
}

type Leaf = {
  cy: number;
  halfWidth: number;
  thickness: number;
  sag: number;
  lift: number;
  dx: number;
  phase: number;
};

const LEAVES = 11;
const BASE_Y = 720;
const LEAF_SPACING = 42;

function createLeaves(random: () => number): Leaf[] {
  const jitter = (amount: number) => (random() - 0.5) * amount;
  let drift = 0;

  return Array.from({ length: LEAVES }, (_, i) => {
    const t = i / (LEAVES - 1);
    drift += jitter(5);
    const base = i === 0;
    return {
      cy: BASE_Y - i * LEAF_SPACING + jitter(4),
      halfWidth: (60 + 250 * Math.pow(1 - t, 0.85)) * (1 + jitter(0.06)),
      // The first leaf is the poured base: thicker and deeper, it rounds off the bottom.
      thickness: LEAF_SPACING * (base ? 1.5 : 0.76),
      sag: (26 + 20 * (1 - t)) * (base ? 1.5 : 1) + jitter(6),
      lift: 10 + 18 * (1 - t),
      dx: drift,
      phase: random() * Math.PI * 2,
    };
  });
}

const LEAF_STEPS = 64;

// Leaf centerline dips to a V at the middle (the pull-through) and its wings curl up at the tips.
function leafEdge(leaf: Leaf, u: number, side: -1 | 1): [number, number] {
  const a = Math.abs(u);
  const center = leaf.cy + leaf.sag * (1 - Math.pow(a, 1.4)) - leaf.lift * Math.pow(a, 4);
  const half = (leaf.thickness / 2) * Math.pow(1 - a * a, 0.6);
  const wave = Math.sin(u * 9 + leaf.phase) * 1.5;
  return [C + leaf.dx + u * leaf.halfWidth, center + side * half + wave];
}

function traceLeaf(ctx: CanvasRenderingContext2D, leaf: Leaf) {
  for (let s = 0; s <= LEAF_STEPS; s++) {
    const [x, y] = leafEdge(leaf, -1 + (2 * s) / LEAF_STEPS, -1);
    if (s === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  for (let s = LEAF_STEPS; s >= 0; s--) {
    const [x, y] = leafEdge(leaf, -1 + (2 * s) / LEAF_STEPS, 1);
    ctx.lineTo(x, y);
  }
  ctx.closePath();
}

// Base toward the canvas top: the S2 spin (rotY 180°) turns it to the viewer, so the tip points away.
const ART_ROTATION = Math.PI - 0.08;

function traceRosetta(ctx: CanvasRenderingContext2D, leaves: Leaf[]) {
  const tip = leaves[leaves.length - 1];
  ctx.beginPath();
  for (const leaf of leaves) traceLeaf(ctx, leaf);
  // Small heart at the tip, then the thin pulled-through stem down past the base.
  ctx.moveTo(C + tip.dx + 20, tip.cy - 26);
  ctx.arc(C + tip.dx, tip.cy - 26, 20, 0, Math.PI * 2);
  ctx.moveTo(C + tip.dx - 2, tip.cy - 26);
  ctx.lineTo(C + tip.dx + 2, tip.cy - 26);
  ctx.lineTo(C + leaves[0].dx + 4, BASE_Y + 70);
  ctx.lineTo(C + leaves[0].dx - 4, BASE_Y + 70);
  ctx.closePath();
}

function withArtTransform(ctx: CanvasRenderingContext2D, scale: number, draw: () => void) {
  ctx.save();
  ctx.scale(scale, scale);
  ctx.translate(C, C);
  ctx.rotate(ART_ROTATION);
  ctx.translate(-C, -C);
  draw();
  ctx.restore();
}

function createCanvas(size: number): [HTMLCanvasElement, CanvasRenderingContext2D | null] {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  return [canvas, canvas.getContext("2d")];
}

function drawCrema(ctx: CanvasRenderingContext2D, noise: (x: number, y: number) => number) {
  const base = ctx.createRadialGradient(C, C, 0, C, C, C);
  base.addColorStop(0, "#8f5a2e");
  base.addColorStop(0.55, "#7a4722");
  base.addColorStop(0.84, "#5a3014");
  base.addColorStop(0.95, "#3f200b");
  base.addColorStop(1, "#2e1707");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Mottling: low-frequency noise computed small and upscaled with smoothing (cheap, and soft by nature).
  const MOTTLE = 128;
  const [mottle, mctx] = createCanvas(MOTTLE);
  if (!mctx) return;
  const image = mctx.createImageData(MOTTLE, MOTTLE);
  for (let y = 0; y < MOTTLE; y++) {
    for (let x = 0; x < MOTTLE; x++) {
      const n = noise((x / MOTTLE) * 7, (y / MOTTLE) * 7);
      const light = n > 0.5;
      const i = (y * MOTTLE + x) * 4;
      image.data[i] = light ? 190 : 45;
      image.data[i + 1] = light ? 128 : 20;
      image.data[i + 2] = light ? 70 : 6;
      image.data[i + 3] = Math.abs(n - 0.5) * 2 * 110;
    }
  }
  mctx.putImageData(image, 0, 0);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(mottle, 0, 0, SIZE, SIZE);
}

function drawFoam(ctx: CanvasRenderingContext2D, leaves: Leaf[]) {
  withArtTransform(ctx, 1, () => {
    // Caramel halo where the foam drags crema around it.
    ctx.shadowColor = "rgba(214, 165, 110, 0.9)";
    ctx.shadowBlur = 28;
    ctx.fillStyle = "rgba(214, 165, 110, 0.5)";
    traceRosetta(ctx, leaves);
    ctx.fill();

    // Foam body with a soft edge.
    ctx.shadowColor = "rgba(228, 200, 165, 1)";
    ctx.shadowBlur = 4;
    ctx.fillStyle = "#f4ebdf";
    traceRosetta(ctx, leaves);
    ctx.fill();

    // Foam soaks up a little crema along its edges.
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "rgba(205, 160, 110, 0.45)";
    ctx.lineWidth = 3;
    ctx.stroke();
  });
}

const DETAIL_SIZE = 512;

// Grayscale map of the foam shape: white foam on a `background` gray, with softened edges.
function drawFoamMask(leaves: Leaf[], background: string): HTMLCanvasElement {
  const [canvas, ctx] = createCanvas(DETAIL_SIZE);
  if (!ctx) return canvas;
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, DETAIL_SIZE, DETAIL_SIZE);
  withArtTransform(ctx, DETAIL_SIZE / SIZE, () => {
    ctx.shadowColor = "#ffffff";
    ctx.shadowBlur = 5;
    ctx.fillStyle = "#ffffff";
    traceRosetta(ctx, leaves);
    ctx.fill();
  });
  return canvas;
}

export type LatteArtTextures = {
  map: CanvasTexture;
  bumpMap: CanvasTexture;
  roughnessMap: CanvasTexture;
};

export function createLatteArtTextures(): LatteArtTextures {
  const random = createRandom(7);
  const noise = createNoise(random);
  const leaves = createLeaves(random);

  const [colorCanvas, ctx] = createCanvas(SIZE);
  if (ctx) {
    drawCrema(ctx, noise);
    drawFoam(ctx, leaves);
  }

  const map = new CanvasTexture(colorCanvas);
  map.colorSpace = SRGBColorSpace;
  map.anisotropy = 8;

  return {
    map,
    // Crema is the low ground (black); foam stands proud.
    bumpMap: new CanvasTexture(drawFoamMask(leaves, "#000000")),
    // roughness = material.roughness × green channel: crema ~0.55 of the material value, foam the full value.
    roughnessMap: new CanvasTexture(drawFoamMask(leaves, "#8c8c8c")),
  };
}
