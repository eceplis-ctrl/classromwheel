export const metadata = {
  title: "About ClassroomWheel",
  description: "ClassroomWheel is a free spin wheel for teachers — built to make student picking fair, fast, and fun. No signup, no data collection, no cost.",
  alternates: { canonical: "https://classroomwheel.com/about" },
  robots: { index: true, follow: true },
};

export default function About() {
  return (
    <main style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0d0d1a 0%, #1a1a2e 40%, #16213e 100%)",
      fontFamily: "'DM Sans','Segoe UI',sans-serif",
      color: "#f0f0ff",
    }}>
      {/* Header */}
      <div style={{
        background: "rgba(255,255,255,0.04)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        padding: "14px 24px",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}>
        <span style={{ fontSize: 24 }}>🎡</span>
        <a href="/" style={{ fontSize: 18, fontWeight: 700, color: "#f0f0ff", textDecoration: "none", letterSpacing: "-0.5px" }}>
          ClassroomWheel
        </a>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "56px 24px 96px" }}>

        <a href="/" style={{ fontSize: 14, color: "#6a64ff", textDecoration: "none", display: "inline-block", marginBottom: 40 }}>
          ← Back to the wheel
        </a>

        <h1 style={{ fontSize: 40, fontWeight: 800, marginBottom: 8, letterSpacing: "-1.5px", lineHeight: 1.1 }}>
          About ClassroomWheel
        </h1>
        <div style={{ height: 4, width: 60, borderRadius: 99, background: "linear-gradient(90deg, #6a64ff, #fd79a8)", marginBottom: 40 }} />

        <p style={{ fontSize: 17, lineHeight: 1.8, color: "rgba(255,255,255,0.7)", marginBottom: 40 }}>
          ClassroomWheel is a free, no-fuss spin wheel for teachers. Spin to pick a random student,
          save your class rosters, and put the wheel up on your projector — all without creating an account
          or installing anything.
        </p>

        <Section title="Why we built it">
          Most random-picker tools online are cluttered with ads, require sign-ups, or reset your class list every time
          you close the tab. ClassroomWheel was built to fix all three: it's clean, free, and your data lives in your
          browser so it's always there when you open it.
        </Section>

        <Section title="How it works">
          Add your students' names, hit Spin, and the wheel picks one at random. Turn on No-Repeat mode and
          each student is removed from the pool after being picked — so everyone gets a turn before anyone
          repeats. When the round is done, one click resets it. Your class lists are saved automatically in
          your browser's local storage. Nothing is ever sent to a server.
        </Section>

        <Section title="Features">
          <ul style={{ paddingLeft: 20, margin: 0, lineHeight: 2 }}>
            <li>Multiple class rosters — one for each period or subject</li>
            <li>No-repeat mode so every student gets picked fairly</li>
            <li>Projector / smartboard mode — full-screen, Space bar to spin</li>
            <li>Mark students absent so they're skipped</li>
            <li>Answer timer to keep things moving</li>
            <li>Random team generator</li>
            <li>Undo last pick</li>
            <li>Export roster and pick history as CSV</li>
            <li>Works on any device — no app, no install</li>
          </ul>
        </Section>

        <Section title="Privacy">
          Your class data never leaves your device. We don't have a database of student names — they're stored
          only in your browser's local storage and disappear if you clear it. The only third-party service we
          use is Google AdSense for advertising, which is loaded only after you give consent via the cookie banner.
          We're based in Latvia, EU, and comply with GDPR. Full details in our{" "}
          <a href="/privacy-policy" style={{ color: "#6a64ff" }}>Privacy Policy</a>.
        </Section>

        <Section title="Contact">
          Questions, feedback, or feature requests? Email us at{" "}
          <a href="mailto:hello@classroomwheel.com" style={{ color: "#6a64ff" }}>hello@classroomwheel.com</a>.
          We'd love to hear from teachers using the tool.
        </Section>

        <div style={{
          marginTop: 56,
          padding: "28px 32px",
          background: "rgba(106,100,255,0.08)",
          border: "1px solid rgba(106,100,255,0.2)",
          borderRadius: 16,
          textAlign: "center",
        }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🎡</div>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Ready to spin?</div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginBottom: 20 }}>
            Free, no signup, works right now.
          </div>
          <a href="/" style={{
            display: "inline-block",
            padding: "12px 32px",
            borderRadius: 999,
            background: "linear-gradient(135deg, #6a64ff, #fd79a8)",
            color: "#fff",
            fontWeight: 700,
            fontSize: 15,
            textDecoration: "none",
          }}>
            Open ClassroomWheel
          </a>
        </div>

      </div>
    </main>
  );
}

function Section({ title, children }) {
  return (
    <section style={{ marginBottom: 40 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, marginTop: 0, color: "#fff" }}>{title}</h2>
      <div style={{ fontSize: 15, lineHeight: 1.8, color: "rgba(255,255,255,0.55)" }}>{children}</div>
    </section>
  );
}
