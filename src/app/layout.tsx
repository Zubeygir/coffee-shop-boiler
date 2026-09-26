import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import { site } from "@/content/site";
import { getSiteUrl } from "@/lib/utils";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: site.metadata.title,
  description: site.metadata.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "/",
    siteName: site.metadata.siteName,
    title: site.metadata.title,
    description: site.metadata.description,
  },
  twitter: { card: "summary_large_image" },
};

// Runs before first paint. Marks a cold load at the top of the page for the intro (cup drop + headline entrance),
// which hides the headline until the cup lands. Skipped for reloads and back/forward (the browser restores the
// scroll after this runs, so scrollY alone can't tell), #anchors, reduced motion and browsers without WebGL.
// Failsafe: the headline shows after 3 s no matter what (CupRig cancels it once the drop starts).
const introScript = `(function () {
  var html = document.documentElement;
  var nav = performance.getEntriesByType("navigation")[0];
  if (!window.WebGLRenderingContext || location.hash || window.scrollY > 0 || (nav && nav.type !== "navigate") ||
      matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  html.classList.add("intro-pending");
  window.__introFailsafe = setTimeout(function () { html.classList.remove("intro-pending"); }, 3000);
})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: the inline scripts below may add classes to <html> before hydration.
    <html lang="tr" className={archivo.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
