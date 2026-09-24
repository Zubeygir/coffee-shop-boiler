// The page's single animation frame: SmoothScroll advances the scroll first, then every subscriber (the 3D canvas)
// renders in the same frame, so the cup and the text it is glued to never drift apart.
// Kept free of three.js so SmoothScroll does not pull it into the main bundle.

type FrameCallback = (timeSeconds: number) => void;

const subscribers = new Set<FrameCallback>();

/** Subscribes to the frame loop; returns the unsubscribe function. */
export function onFrame(callback: FrameCallback): () => void {
  subscribers.add(callback);
  return () => {
    subscribers.delete(callback);
  };
}

export function runFrame(timeSeconds: number) {
  for (const callback of subscribers) callback(timeSeconds);
}
