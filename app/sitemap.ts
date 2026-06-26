import type { MetadataRoute } from "next";

import { siteConfig } from "@/content/site.config";
import { cities } from "@/content/cities";
import { getAllRecaps } from "@/lib/recaps";

/** Keep in sync with LUMA_REVALIDATE_SECONDS in lib/revalidate.ts */
export const revalidate = 60;

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

  const recapRoutes: MetadataRoute.Sitemap = (await getAllRecaps()).map((r) => ({
    url: `${base}/recaps/${r.eventSlug}`,
    lastModified: new Date(r.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  // Events link out to Luma; recaps live at /recaps/[slug].
  return [...staticRoutes, ...cityRoutes, ...recapRoutes];
}
