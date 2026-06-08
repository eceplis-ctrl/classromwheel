import "./globals.css";

export const metadata = {
  title: "SpinRoster - Free Classroom Spin Wheel for Teachers",
  description: "Free classroom spin wheel for teachers. Pick random students with no repeats, save multiple class rosters, and use projector mode for your smartboard. No signup needed.",
  metadataBase: new URL("https://classromwheel.vercel.app"),
  openGraph: {
    type: "website",
    url: "https://classromwheel.vercel.app",
    title: "SpinRoster - Free Classroom Spin Wheel for Teachers",
    description: "Pick random students fairly, save class rosters, spin on your projector. Free, no signup.",
    siteName: "SpinRoster",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}