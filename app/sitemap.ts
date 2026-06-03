import type { MetadataRoute } from "next";

import { siteConfig } from "@/content/site.config";
import { cities } from "@/content/cities";

export const revalidate = 21600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url.replace(/\/$/, "");
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    "/",
    "/events",
    "/cities",
    "/ambassadors",
    "/gallery",
    "/about",
    "/join",
    "/submit",
    "/code-of-conduct",
  ].map((p) => ({
    url: `${base}${p}`,
    lastModified: now,
    changeFrequency: p === "/" ? "weekly" : "monthly",
    priority: p === "/" ? 1 : 0.6,
  }));

  const cityRoutes: MetadataRoute.Sitemap = cities.map((c) => ({
    url: `${base}/cities/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  // Events have no per-slug detail page (they link out to Luma), and
  // ambassadors all live on /ambassadors — both covered by `staticRoutes`.
  return [...staticRoutes, ...cityRoutes];
}
