"use client";

import { useEffect } from "react";
import { useIntro } from "@/components/cup/IntroProvider";

// design-language.md → Motion: the hero headline is the page's one slow entrance (the standard 600 ms / 100 ms
// reads as a blink with ease-out-expo, which spends most of its travel in the first few hundred ms).
const DURATION = 1100;
// Right words travel their full width out from behind the cup, so they get a little longer.
const EMERGE_DURATION = 1300;
const STAGGER = 180;
const EASE_OUT_EXPO = "cubic-bezier(0.16, 1, 0.3, 1)";

/**
 * Plays the headline entrance once the cup has landed (phase `ready`), only if the intro is still pending.
 * Renders nothing: the hero stays server-rendered and is animated in place with the Web Animations API.
 * Left words slide in from the left; on desktop the right words slide out from behind the cup (each sits in a
 * clipped cell whose left edge is under the cup), on mobile they enter like the left words.
 */
export function HeroIntro() {
  const { phase } = useIntro();

  useEffect(() => {
    const root = document.documentElement;
    if (phase !== "ready" || !root.classList.contains("intro-pending")) return;

    const emergeFromCup = window.matchMedia("(min-width: 48rem)").matches;
    const words = document.querySelectorAll<HTMLElement>("[data-intro-word]");
    let lastRow = 0;

    for (const word of words) {
      const row = Number(word.dataset.introRow);
      lastRow = Math.max(lastRow, row);
      const emerge = emergeFromCup && word.dataset.introWord === "right";
      const keyframes = emerge
        ? [{ transform: "translateX(-100%)" }, { transform: "none" }]
        : [
            { opacity: 0, transform: "translateX(-1.5rem)" },
            { opacity: 1, transform: "none" },
          ];
      word.animate(keyframes, {
        duration: emerge ? EMERGE_DURATION : DURATION,
        delay: row * STAGGER,
        easing: EASE_OUT_EXPO,
        fill: "backwards",
      });
    }

    for (const element of document.querySelectorAll<HTMLElement>("[data-intro-meta]")) {
      element.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: DURATION,
        delay: (lastRow + 2) * STAGGER,
        easing: EASE_OUT_EXPO,
        fill: "backwards",
      });
    }

    // The animations' first keyframes now hold the hidden state (fill: backwards), so the CSS hide can go
    // without a flash.
    root.classList.remove("intro-pending");
  }, [phase]);

  return null;
}
