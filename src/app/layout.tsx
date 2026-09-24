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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: the inline script below may add a class to <html> before hydration.
    <html lang="tr" className={archivo.variable} suppressHydrationWarning>
      <head>
        {/* Temporary (removed in 11.4): `?debug=slots` outlines the cup slots. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `if(/[?&]debug=slots\\b/.test(location.search))document.documentElement.classList.add("debug-slots")`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
