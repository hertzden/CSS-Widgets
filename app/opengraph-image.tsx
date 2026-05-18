import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const alt = "CSS Widgets";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #150956 0%, #2c0b8e 100%)",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <p style={{ fontSize: 32, opacity: 0.8, margin: 0 }}>css-widgets.com</p>
        <h1 style={{ fontSize: 96, fontWeight: 700, margin: "16px 0 0 0", lineHeight: 1.1 }}>
          CSS Widgets
        </h1>
        <p style={{ fontSize: 36, opacity: 0.85, margin: "32px 0 0 0" }}>
          Front-end Technologies — CSS, HTML, Accessibility
        </p>
      </div>
    ),
    size,
  );
}
