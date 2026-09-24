"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { runFrame } from "@/lib/frameLoop";

/**
 * Owns the page's only requestAnimationFrame loop. Lenis moves the scroll on the main thread, then the 3D canvas
 * renders against that same scroll position. With native scrolling the page moves on the compositor thread and the
 * canvas lands a frame late, so the cup shakes against its text.
 * Lenis honors prefers-reduced-motion itself (`respectReducedMotion`, on by default). Touch keeps native scrolling.
 */
// Long glide for in-page links (header nav), in-out so it neither jumps off nor snaps into place.
const easeInOutQuart = (t: number) => (t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2);

export function SmoothScroll() {
  useEffect(() => {
    // lerp 0.085 (default 0.1): a slightly longer, softer glide after each wheel input.
    // Reduced motion: lerp 1 = no inertia, each wheel step lands at once. Lenis's own `respectReducedMotion` only
    // makes programmatic scrolls (anchors) instant, not the wheel. Lenis still drives the scroll in our frame loop,
    // so the cup stays glued to its text (switching the wheel back to native would bring the canvas lag back).
    // anchors: in-page links scroll smoothly; Lenis does not cancel the native navigation, so focus still moves
    // (the skip link keeps working).
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = new Lenis({
      lerp: reducedMotion ? 1 : 0.085,
      anchors: { duration: 1.1, easing: easeInOutQuart },
    });
    let frame = 0;

    const tick = (time: number) => {
      lenis.raf(time);
      runFrame(time / 1000);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}
