import { Environment, Lightformer } from "@react-three/drei";
import { brandHex } from "@/lib/colors";

/**
 * Procedural studio instead of an HDRI file: nothing to download before the intro, and the key light matches the
 * menu photos' art direction (hard light from the top left). Rendered once into the environment map.
 * The flame panels are the orange page bouncing light back: the white cup's shadow side and the glossy lid pick
 * up the page's color, so the cup sits in the page instead of on top of it.
 */
export function Studio() {
  return (
    <Environment frames={1} resolution={256}>
      <Lightformer form="rect" intensity={5} position={[-4, 4, 4]} scale={[4, 3, 1]} target={[0, 0, 0]} />
      <Lightformer form="rect" intensity={1.2} position={[5, 0, 3]} scale={[3, 5, 1]} target={[0, 0, 0]} />
      <Lightformer form="rect" intensity={2} position={[0, 5, -4]} scale={[6, 2, 1]} target={[0, 0, 0]} />
      {/* The page behind the cup, and its bounce from below and the shadow side. */}
      <Lightformer form="rect" color={brandHex.flame} intensity={0.8} position={[0, 0, -6]} scale={[20, 20, 1]} target={[0, 0, 0]} />
      <Lightformer form="rect" color={brandHex.flame} intensity={1.4} position={[3, -4, 2]} scale={[8, 3, 1]} target={[0, 0, 0]} />
    </Environment>
  );
}
