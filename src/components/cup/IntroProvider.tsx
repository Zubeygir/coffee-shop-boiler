"use client";

import { createContext, useContext, useState, useSyncExternalStore, type ReactNode } from "react";

export type IntroPhase = "loading" | "dropping" | "ready";

type IntroState = {
  phase: IntroPhase;
  setPhase: (phase: IntroPhase) => void;
  reducedMotion: boolean;
};

const IntroContext = createContext<IntroState | null>(null);

// No-op subscription: the preference is read once at load; the choreography does not switch mid-visit.
const subscribeOnce = () => () => {};
const readReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function IntroProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<IntroPhase>("loading");
  const reducedMotion = useSyncExternalStore(subscribeOnce, readReducedMotion, () => false);

  return <IntroContext value={{ phase, setPhase, reducedMotion }}>{children}</IntroContext>;
}

export function useIntro(): IntroState {
  const intro = useContext(IntroContext);
  if (!intro) throw new Error("useIntro must be used inside <IntroProvider>");
  return intro;
}
