import type { Metadata } from "next";
import "./globals.css";

// Placeholder until Step 3.4 builds the real metadata from src/content/site.ts.
export const metadata: Metadata = {
  title: "Zubo Cafe",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
