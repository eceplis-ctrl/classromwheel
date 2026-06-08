"use client";
import { useState, useEffect } from "react";

// ─── Drop this component into your root layout just before </body> ───
// <CookieBanner />
//
// It blocks AdSense cookies until the user consents.
// After consent, uncomment the AdSense <script> in layout.js.
// ─────────────────────────────────────────────────────────────────────

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem("cookie_consent");
      if (!consent) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    try { localStorage.setItem("cookie_consent", "accepted"); } catch {}
    setVisible(false);
    // Load AdSense now that user has consented
    loadAdSense();
  };

  const decline = () => {
    try { localStorage.setItem("cookie_consent", "declined"); } catch {}
    setVisible(false);
  };

  const loadAdSense = () => {
    if (typeof window === "undefined") return;
    if (document.querySelector('script[src*="adsbygoogle"]')) return;
    const script = document.createElement("script");
    // Replace ca-pub-XXXXXXXXXXXXXXXX with your real AdSense Publisher ID
    script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX";
    script.async = true;
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);
  };

  // Auto-load AdSense if already consented on previous visit
  useEffect(() => {
    try {
      if (localStorage.getItem("cookie_consent") === "accepted") loadAdSense();
    } catch {}
  }, []);

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 99999,
      background: "#1a1a2e",
      borderTop: "1px solid rgba(255,255,255,0.1)",
      padding: "16px 24px",
      fontFamily: "'DM Sans','Segoe UI',sans-serif",
    }}>
      <div style={{
        maxWidth: 1100, margin: "0 auto",
        display: "flex", alignItems: "flex-start",
        gap: 20, flexWrap: "wrap",
      }}>
        {/* Text */}
        <div style={{ flex: 1, minWidth: 260 }}>
          <p style={{ margin: "0 0 6px", fontSize: 14, color: "#f0f0ff", lineHeight: 1.5 }}>
            We use cookies to display advertisements that help keep SpinRoster free.
            {" "}
            <button
              onClick={() => setShowDetails(v => !v)}
              style={{ background: "none", border: "none", color: "#a29bfe", fontSize: 14, cursor: "pointer", padding: 0, textDecoration: "underline" }}
            >
              {showDetails ? "Hide details" : "Learn more"}
            </button>
          </p>

          {showDetails && (
            <p style={{ margin: "8px 0 0", fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
              We use Google AdSense for advertising. If you accept, Google may use cookies to show you personalised ads based on your browsing history. If you decline, you will still see ads but they will not be personalised. Your class data is always stored only in your browser — never on our servers.{" "}
              <a href="/privacy-policy" style={{ color: "#a29bfe" }}>Privacy Policy</a>
            </p>
          )}
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexShrink: 0 }}>
          <button
            onClick={decline}
            style={{
              padding: "10px 20px", borderRadius: 8,
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "rgba(255,255,255,0.5)",
              fontSize: 14, fontWeight: 600, cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Decline
          </button>
          <button
            onClick={accept}
            style={{
              padding: "10px 24px", borderRadius: 8,
              background: "linear-gradient(135deg, #6a64ff, #fd79a8)",
              border: "none",
              color: "#fff",
              fontSize: 14, fontWeight: 700, cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Accept cookies
          </button>
        </div>
      </div>
    </div>
  );
}
