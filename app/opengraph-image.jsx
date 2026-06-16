import { ImageResponse } from "next/og";

export const alt = "ClassroomWheel — Free Spin Wheel for Teachers";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0d0d1a",
          padding: "60px 80px",
        }}
      >
        {/* Wheel graphic */}
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #6a64ff, #fd79a8)",
            marginBottom: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 64,
            boxShadow: "0 0 60px rgba(106,100,255,0.5)",
          }}
        >
          🎡
        </div>

        <div
          style={{
            fontSize: 88,
            fontWeight: 800,
            color: "#ffffff",
            letterSpacing: "-3px",
            marginBottom: 24,
            lineHeight: 1,
          }}
        >
          ClassroomWheel
        </div>

        <div
          style={{
            fontSize: 34,
            color: "rgba(255,255,255,0.55)",
            textAlign: "center",
            maxWidth: 860,
            lineHeight: 1.5,
            marginBottom: 48,
          }}
        >
          Free spin wheel for teachers — pick students fairly, save rosters, display on your projector
        </div>

        <div
          style={{
            padding: "14px 44px",
            borderRadius: 999,
            background: "linear-gradient(135deg, #6a64ff, #fd79a8)",
            color: "#ffffff",
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: "-0.5px",
          }}
        >
          classroomwheel.com
        </div>
      </div>
    ),
    { ...size }
  );
}
