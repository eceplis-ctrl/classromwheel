// app/sitemap.js — Next.js generates /sitemap.xml automatically from this file
// Submit the URL https://classroomwheel.com/sitemap.xml to Google Search Console

export default function sitemap() {
  const baseUrl = "https://classroomwheel.com";
  const lastModified = new Date();

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
