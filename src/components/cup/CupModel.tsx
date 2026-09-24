"use client";

import { useEffect, useMemo, useState, type Ref, type RefObject } from "react";
import { CanvasTexture, DoubleSide, LatheGeometry, RingGeometry, SRGBColorSpace, Vector2, type Group } from "three";
import { site } from "@/content/site";
import { brandHex } from "@/lib/colors";
import { createLatteArtTextures } from "./latteArt";
import { Steam } from "./Steam";

// Normalized cup: height 1, centered on y = 0. Every other part is defined relative to these numbers,
// so fitting the cup into a slot stays a single scale value.
const CUP = {
  topRadius: 0.36,
  bottomRadius: 0.26,
  wall: 0.006,
  baseRecess: 0.03,
  rimTube: 0.012,
  sleeveBottom: -0.32,
  sleeveTop: 0.08,
  sleeveGap: 0.006,
  coffeeLevel: 0.44,
  meniscus: 0.012,
} as const;

const TOP = 0.5;
const BOTTOM = -0.5;

// Relative to the lid's pivot, which sits on the cup's top edge.
const SIP_HOLE = [0, 0.049, 0.27] as const;

const radiusAt = (y: number) => CUP.bottomRadius + (CUP.topRadius - CUP.bottomRadius) * (y - BOTTOM);

// Outer wall with a recessed base, then the inner wall (visible once the lid is off).
function createBodyGeometry(): LatheGeometry {
  const { wall, baseRecess } = CUP;
  const floor = BOTTOM + baseRecess;
  const profile = [
    new Vector2(0, floor),
    new Vector2(CUP.bottomRadius - wall, floor),
    new Vector2(CUP.bottomRadius - wall, BOTTOM),
    new Vector2(CUP.bottomRadius, BOTTOM),
    new Vector2(CUP.topRadius, TOP),
    new Vector2(CUP.topRadius - wall, TOP),
    new Vector2(radiusAt(floor + wall) - wall, floor + wall),
    new Vector2(0, floor + wall),
  ];
  return new LatheGeometry(profile, 96);
}

// Skirt over the rolled rim, a raised ring, then a slightly domed top plate.
function createLidGeometry(): LatheGeometry {
  const profile = [
    new Vector2(0.382, -0.035),
    new Vector2(0.384, 0.015),
    new Vector2(0.37, 0.03),
    new Vector2(0.355, 0.06),
    new Vector2(0.335, 0.062),
    new Vector2(0.32, 0.045),
    new Vector2(0.2, 0.048),
    new Vector2(0, 0.052),
  ];
  return new LatheGeometry(profile, 96);
}

// Flat foam that curls up against the wall (meniscus). A ring keeps planar UVs for the latte-art texture.
function createCoffeeGeometry(radius: number): RingGeometry {
  const geometry = new RingGeometry(0, radius, 96, 16);
  const position = geometry.attributes.position;
  for (let i = 0; i < position.count; i++) {
    const r = Math.hypot(position.getX(i), position.getY(i)) / radius;
    const t = Math.max(0, (r - 0.82) / 0.18);
    position.setZ(i, CUP.meniscus * t * t);
  }
  geometry.computeVertexNormals();
  return geometry;
}

function useLatteArt() {
  const textures = useMemo(() => createLatteArtTextures(), []);

  useEffect(
    () => () => {
      textures.map.dispose();
      textures.bumpMap.dispose();
      textures.roughnessMap.dispose();
    },
    [textures],
  );

  return textures;
}

const SLEEVE_TEXT_PX = 150;

// "ZUBO" in the display face on an ink band. Centered at u = 0.5, which is the cup's back (−z):
// it turns to face the camera with the 180° spin at S2.
function drawSleeveTexture(font: string): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 214;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = brandHex.ink;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = font;
    ctx.fillStyle = brandHex.flame;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(site.wordmark.toLocaleUpperCase("tr-TR"), canvas.width / 2, canvas.height / 2 + 6);
  }
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

// Drawn only after the web font is loaded (an SVG <text> or an early draw would fall back to Arial).
// `extra-condensed` maps to Archivo's wdth axis through the @font-face font-stretch range.
function useSleeveTexture(): CanvasTexture | null {
  const [texture, setTexture] = useState<CanvasTexture | null>(null);

  useEffect(() => {
    let cancelled = false;
    let created: CanvasTexture | null = null;
    const family = getComputedStyle(document.documentElement).getPropertyValue("--font-archivo");
    const font = `900 extra-condensed ${SLEEVE_TEXT_PX}px ${family}`;

    document.fonts.load(font).then(() => {
      if (cancelled) return;
      created = drawSleeveTexture(font);
      setTexture(created);
    });

    return () => {
      cancelled = true;
      created?.dispose();
    };
  }, []);

  return texture;
}

type CupModelProps = {
  /** The lid group, pivoting on the cup's top edge; the choreography moves it. */
  lidRef?: Ref<Group>;
  /** Steam amount (0 = wisp, 1 = full), read every frame. */
  steamAmount: RefObject<number>;
};

export function CupModel({ lidRef, steamAmount }: CupModelProps) {
  const body = useMemo(() => createBodyGeometry(), []);
  const lid = useMemo(() => createLidGeometry(), []);
  const coffee = useMemo(() => createCoffeeGeometry(radiusAt(CUP.coffeeLevel) - CUP.wall), []);
  const sleeve = useSleeveTexture();
  const latteArt = useLatteArt();

  const sleeveRadiusTop = radiusAt(CUP.sleeveTop) + CUP.sleeveGap;
  const sleeveRadiusBottom = radiusAt(CUP.sleeveBottom) + CUP.sleeveGap;

  return (
    <group>
      <mesh geometry={body} castShadow>
        <meshStandardMaterial color={brandHex.white} roughness={0.9} metalness={0} side={DoubleSide} />
      </mesh>

      <mesh position-y={TOP} rotation-x={Math.PI / 2} castShadow>
        <torusGeometry args={[CUP.topRadius, CUP.rimTube, 12, 96]} />
        <meshStandardMaterial color={brandHex.white} roughness={0.9} metalness={0} />
      </mesh>

      <mesh position-y={(CUP.sleeveTop + CUP.sleeveBottom) / 2} castShadow>
        <cylinderGeometry
          args={[sleeveRadiusTop, sleeveRadiusBottom, CUP.sleeveTop - CUP.sleeveBottom, 96, 1, true]}
        />
        {/* Plain ink until the font-dependent texture is drawn. */}
        <meshStandardMaterial
          key={sleeve ? "textured" : "plain"}
          map={sleeve}
          color={sleeve ? brandHex.white : brandHex.ink}
          roughness={0.85}
          metalness={0}
        />
      </mesh>

      <mesh geometry={coffee} position-y={CUP.coffeeLevel} rotation-x={-Math.PI / 2}>
        <meshStandardMaterial
          map={latteArt.map}
          bumpMap={latteArt.bumpMap}
          bumpScale={1.5}
          roughnessMap={latteArt.roughnessMap}
          roughness={0.8}
          metalness={0}
        />
      </mesh>

      <group ref={lidRef} position-y={TOP}>
        <mesh geometry={lid} castShadow>
          <meshStandardMaterial color={brandHex.ink} roughness={0.5} metalness={0} side={DoubleSide} />
        </mesh>
        <mesh position={SIP_HOLE} rotation-x={-Math.PI / 2} scale={[1.7, 1, 1]}>
          <circleGeometry args={[0.03, 32]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
      </group>

      <Steam
        amount={steamAmount}
        wispOrigin={[SIP_HOLE[0], TOP + SIP_HOLE[1], SIP_HOLE[2]]}
        fullOrigin={[0, CUP.coffeeLevel + 0.02, 0]}
      />
    </group>
  );
}
