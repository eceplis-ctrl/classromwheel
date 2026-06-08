"use client";
import { useEffect } from "react";

// ─── HOW TO USE ──────────────────────────────────────────────────────
//
// 1. Replace ca-pub-XXXXXXXXXXXXXXXX with your Publisher ID everywhere
// 2. Replace data-ad-slot values with your real Ad Slot IDs from AdSense
//    (AdSense dashboard → Ads → By ad unit → create new ad units)
// 3. Import and drop <AdUnit slot="horizontal" /> into your page
//
// PLACEMENT STRATEGY (non-intrusive for teachers):
//   - <AdUnit slot="horizontal" /> — below the controls row, above pick history
//   - <AdUnit slot="sidebar" />    — bottom of the roster panel
//   - Do NOT place ads inside the wheel area or projector mode
//
// ─────────────────────────────────────────────────────────────────────

const AD_CLIENT = "ca-pub-XXXXXXXXXXXXXXXX"; // ← replace with your Publisher ID

const AD_SLOTS = {
  horizontal: "1234567890",  // ← replace with real slot IDs from AdSense dashboard
  sidebar: "0987654321",
};

const AD_SIZES = {
  horizontal: { width: "100%", height: 90, format: "horizontal" },
  sidebar:    { width: "100%", height: 250, format: "rectangle" },
};

export default function AdUnit({ slot = "horizontal" }) {
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {}
  }, []);

  const size = AD_SIZES[slot] || AD_SIZES.horizontal;

  return (
    <div style={{
      width: "100%",
      minHeight: size.height,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "8px 0",
    }}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: size.width, height: size.height }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={AD_SLOTS[slot]}
        data-ad-format={size.format}
        data-full-width-responsive="true"
      />
    </div>
  );
}

// ─── PASTE THIS INTO classroom-wheel.jsx WHERE YOU WANT ADS ──────────
//
// Position 1 — below controls row, above pick history:
//   import AdUnit from "@/components/AdUnit";
//   ...
//   {showHistory && history.length > 0 && ( ... history panel ... )}
//   <AdUnit slot="horizontal" />        ← ADD HERE
//
// Position 2 — bottom of the roster panel:
//   ... student list ...
//   <AdUnit slot="sidebar" />           ← ADD HERE (inside roster div)
//
// ─────────────────────────────────────────────────────────────────────
