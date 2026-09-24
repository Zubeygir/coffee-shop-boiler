"use client";

import dynamic from "next/dynamic";
import { useEffect, useSyncExternalStore } from "react";
import { useIntro } from "./IntroProvider";

// three.js loads in its own chunk after first paint; text and layout never wait for it.
const CupCanvas = dynamic(() => import("./CupCanvas"), { ssr: false });

let webglSupported: boolean | undefined;

// Cached: every probe creates a WebGL context, and browsers cap how many can exist.
function hasWebGL(): boolean {
  if (webglSupported === undefined) {
    try {
      const canvas = document.createElement("canvas");
      webglSupported = Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
    } catch {
      webglSupported = false;
    }
  }
  return webglSupported;
}

const subscribeOnce = () => () => {};

export function CupLayer() {
  const { setPhase } = useIntro();
  // null on the server and during hydration: support is unknown until the client renders.
  const supported = useSyncExternalStore(subscribeOnce, hasWebGL, () => null);

  useEffect(() => {
    // No WebGL: no cup, and the intro must not wait for one.
    if (supported === false) setPhase("ready");
  }, [supported, setPhase]);

  return supported ? <CupCanvas /> : null;
}
