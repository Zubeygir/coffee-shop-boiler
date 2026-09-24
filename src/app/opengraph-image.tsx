import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/content/site";
import { brandHex } from "@/lib/colors";

export const alt = site.metadata.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const upper = (text: string) => text.toLocaleUpperCase("tr-TR");

export default async function OpengraphImage() {
  // Static ExtraCondensed Black instance: Satori cannot read variable font axes.
  const font = await readFile(join(process.cwd(), "src/app/fonts/ArchivoExtraCondensed-Black.ttf"));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: brandHex.flame,
          color: brandHex.ink,
          fontFamily: "Archivo",
        }}
      >
        <div style={{ fontSize: 56, lineHeight: 1 }}>{upper(site.wordmark)}</div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 120, lineHeight: 0.92 }}>
          {site.hero.rows.map((row) => (
            <div key={row.left}>{upper(`${row.left} ${row.right}`)}</div>
          ))}
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Archivo", data: font, style: "normal", weight: 900 }] },
  );
}
