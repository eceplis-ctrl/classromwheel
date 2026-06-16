// app/robots.js — Next.js generates /robots.txt automatically from this file

export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://classroomwheel.com/sitemap.xml",
  };
}
