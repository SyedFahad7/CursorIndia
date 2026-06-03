// Photo helpers — server-only.
// Auto-discovers images dropped under /public/images/events/<slug>/.
// Falls back to an explicit list when provided in the event frontmatter.

import "server-only";

import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

import type { CursorIndiaEvent, EventPhoto } from "@/lib/types";

const IMG_EXT = /\.(jpe?g|png|webp|avif|gif)$/i;

/**
 * Returns the gallery photos for an event.
 *
 * Resolution order:
 *   1. If `event.photos` is non-empty → use that (explicit list wins).
 *   2. Otherwise auto-discover files under /public/images/events/<slug>/.
 *      Files named "hero.*" are excluded so the hero doesn't show twice.
 *   3. Returns [] if nothing is found.
 */
export function getEventGallery(event: CursorIndiaEvent): EventPhoto[] {
  if (event.photos && event.photos.length > 0) {
    return event.photos;
  }
  const dirRel = `/images/events/${event.slug}`;
  const dirAbs = join(process.cwd(), "public", dirRel);
  try {
    const stat = statSync(dirAbs);
    if (!stat.isDirectory()) return [];
  } catch {
    return [];
  }
  let files: string[];
  try {
    files = readdirSync(dirAbs);
  } catch {
    return [];
  }
  return files
    .filter((f) => IMG_EXT.test(f))
    .filter((f) => !/^hero\.[a-z0-9]+$/i.test(f))
    .sort()
    .map((f) => ({
      src: `${dirRel}/${f}`,
      alt: `${event.title} — photo`,
    }));
}

/**
 * Walks every event folder under /public/images/events/ and returns every
 * non-hero photo. Used by the home-page marquee. Returns [] if the folder
 * is missing or empty.
 */
export function getAllEventPhotos(): EventPhoto[] {
  const eventsDirAbs = join(process.cwd(), "public", "images", "events");
  let eventDirs: string[];
  try {
    eventDirs = readdirSync(eventsDirAbs);
  } catch {
    return [];
  }
  const out: EventPhoto[] = [];
  for (const slug of eventDirs) {
    const dirAbs = join(eventsDirAbs, slug);
    try {
      if (!statSync(dirAbs).isDirectory()) continue;
    } catch {
      continue;
    }
    let files: string[];
    try {
      files = readdirSync(dirAbs);
    } catch {
      continue;
    }
    for (const f of files) {
      if (!IMG_EXT.test(f)) continue;
      if (/^hero\.[a-z0-9]+$/i.test(f)) continue;
      out.push({
        src: `/images/events/${slug}/${f}`,
        alt: `Photo from ${slug.replace(/-/g, " ")}`,
      });
    }
  }
  return out.sort((a, b) => a.src.localeCompare(b.src));
}

/** Returns the hero image path for an event, falling back to /public/images/events/<slug>/hero.*. */
export function getEventHero(event: CursorIndiaEvent): string | undefined {
  if (event.heroImage) return event.heroImage;
  const dirRel = `/images/events/${event.slug}`;
  const dirAbs = join(process.cwd(), "public", dirRel);
  try {
    const files = readdirSync(dirAbs);
    const hero = files.find((f) => /^hero\.(jpe?g|png|webp|avif)$/i.test(f));
    if (hero) return `${dirRel}/${hero}`;
  } catch {
    // fall through
  }
  return undefined;
}
