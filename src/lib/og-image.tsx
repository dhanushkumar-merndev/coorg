/* eslint-disable @next/next/no-img-element -- ImageResponse renders native image elements, not next/image. */
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Local assets keep build-time share cards independent of external image hosts.
const [logo, landscape] = await Promise.all([
  readFile(join(process.cwd(), "public/logo-on-light.png"), "base64"),
  readFile(
    join(process.cwd(), "public/images/coorg/hero/share-mist-valley.jpg"),
    "base64",
  ),
]);

export function createShareImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          position: "relative",
          backgroundColor: "#142e24",
          color: "#193c30",
          fontFamily: "sans-serif",
        }}
      >
        <img
          src={`data:image/jpeg;base64,${landscape}`}
          width={1200}
          height={630}
          alt="Conceptual misty mountain landscape"
          style={{ position: "absolute", objectFit: "cover" }}
        />
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            backgroundImage:
              "linear-gradient(90deg, #f4f0e7 0%, #f4f0e7 43%, rgba(244,240,231,0.96) 49%, rgba(244,240,231,0.65) 61%, rgba(244,240,231,0) 81%)",
          }}
        />
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 45,
            left: 62,
            alignItems: "center",
            gap: 22,
          }}
        >
          <img
            src={`data:image/png;base64,${logo}`}
            width={70}
            height={70}
            alt="Company logo"
            style={{ objectFit: "contain" }}
          />
          <div style={{ display: "flex", fontSize: 15, letterSpacing: 4 }}>
            LAND · ESTATES · COORG
          </div>
        </div>
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 170,
            left: 66,
            width: 55,
            height: 3,
            backgroundColor: "#ac9060",
          }}
        />
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 209,
            left: 62,
            flexDirection: "column",
          }}
        >
          <div style={{ display: "flex", fontSize: 56, lineHeight: 1.1, letterSpacing: 5 }}>
            LAND IN
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 116,
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: -5,
              marginTop: 6,
            }}
          >
            COORG
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 27,
              lineHeight: 1.5,
              color: "#53685b",
              marginTop: 31,
              width: 395,
            }}
          >
            Where the mist settles, your land begins.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            position: "absolute",
            right: 38,
            bottom: 30,
            color: "#f4f0e7",
            fontSize: 12,
            letterSpacing: 2,
          }}
        >
          CONCEPTUAL LANDSCAPE
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
