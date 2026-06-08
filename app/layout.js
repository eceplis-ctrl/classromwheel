import "./globals.css";

export const metadata = {
  title: {
    default: "SpinRoster — Free Classroom Spin Wheel for Teachers",
    template: "%s | SpinRoster",
  },
  description:
    "Free classroom spin wheel for teachers. Pick random students with no repeats, save multiple class rosters, and use projector mode for your smartboard. No signup needed.",
  keywords: [
    "classroom spin wheel",
    "random student picker",
    "random name picker teacher",
    "no repeat student picker",
    "spin wheel for classroom",
    "teacher spin wheel free",
  ],
  metadataBase: new URL("https://classromwheel.vercel.app"),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "https://classromwheel.vercel.app",
    title: "SpinRoster — Free Classroom Spin Wheel for Teachers",
    description: "Pick random students fairly, save class rosters, spin on your projector. Free, no signup.",
    siteName: "SpinRoster",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "SpinRoster — Free Classroom Spin Wheel for Teachers",
    description: "Pick random students fairly, save class rosters, spin on your projector. Free, no signup.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
