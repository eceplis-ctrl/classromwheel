import "./globals.css";
import CookieBanner from "../components/CookieBanner";

export const metadata = {
  title: "ClassroomWheel - Free Classroom Spin Wheel for Teachers",
  description: "Free classroom spin wheel for teachers. Pick random students with no repeats, save multiple class rosters, and use projector mode for your smartboard. No signup needed.",
  metadataBase: new URL("https://classroomwheel.com"),
  openGraph: {
    type: "website",
    url: "https://classroomwheel.com",
    title: "ClassroomWheel - Free Classroom Spin Wheel for Teachers",
    description: "Pick random students fairly, save class rosters, spin on your projector. Free, no signup.",
    siteName: "ClassroomWheel",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
