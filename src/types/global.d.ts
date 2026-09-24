export {};

declare global {
  interface Window {
    /** Set by the head script in layout.tsx: reveals the headline after 3 s if the intro never starts. */
    __introFailsafe?: number;
  }
}
