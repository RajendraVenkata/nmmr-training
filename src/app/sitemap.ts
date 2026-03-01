import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE.url}/courses`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE.url}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE.url}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE.url}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE.url}/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Fetch published courses from API for dynamic routes
  let courseRoutes: MetadataRoute.Sitemap = [];
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || SITE.url;
    const res = await fetch(`${baseUrl}/api/courses`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const courses: { slug: string }[] = await res.json();
      courseRoutes = courses.map((course) => ({
        url: `${SITE.url}/courses/${course.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
    }
  } catch {
    // If API is unavailable, return static routes only
  }

  return [...staticRoutes, ...courseRoutes];
}
