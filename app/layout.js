import "./globals.css";
import CookieBanner from "../components/CookieBanner";

export const metadata = {
  title: "ClassroomWheel - Free Classroom Spin Wheel for Teachers",
  description: "Free classroom spin wheel for teachers. Pick random students with no repeats, save multiple class rosters, and use projector mode for your smartboard. No signup needed.",
  keywords: [
    "classroom spin wheel",
    "random student picker",
    "teacher spin wheel",
    "wheel of names classroom",
    "random name picker for teachers",
    "pick random student",
    "no repeat spin wheel",
    "projector wheel classroom",
    "free classroom tool",
  ],
  metadataBase: new URL("https://classroomwheel.com"),
  alternates: { canonical: "https://classroomwheel.com" },
  openGraph: {
    type: "website",
    url: "https://classroomwheel.com",
    title: "ClassroomWheel - Free Classroom Spin Wheel for Teachers",
    description: "Pick random students fairly, save class rosters, spin on your projector. Free, no signup.",
    siteName: "ClassroomWheel",
  },
  twitter: {
    card: "summary_large_image",
    title: "ClassroomWheel - Free Classroom Spin Wheel for Teachers",
    description: "Pick random students fairly, save class rosters, spin on your projector. Free, no signup.",
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "ClassroomWheel",
  url: "https://classroomwheel.com",
  description:
    "Free classroom spin wheel for teachers. Pick random students fairly with no repeats, save multiple class rosters, and use projector mode for your smartboard.",
  applicationCategory: "EducationalApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  audience: { "@type": "EducationalAudience", educationalRole: "teacher" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <CookieBanner />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
