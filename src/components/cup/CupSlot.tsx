import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

type CupSlotProps = {
  name: "hero" | "reveal";
  className?: string;
  style?: CSSProperties;
};

/**
 * Invisible box the 3D cup is placed into. Layout owns its size and position; the canvas only reads its rect.
 * A span so it can sit inside the hero `<h1>`.
 */
export function CupSlot({ name, className, style }: CupSlotProps) {
  return <span data-cup-slot={name} aria-hidden="true" className={cn("block", className)} style={style} />;
}
