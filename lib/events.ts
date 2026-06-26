// Unified events source. Merges hand-written TS files in /content/events with
// live data fetched from each city's Luma calendar.
//
// Resolution rules:
//   - Match TS file <-> Luma event by `lumaUrl` first, then by `slug`.
//   - Luma provides the base shape (title, date, venue, description, URL).
//   - TS fields are layered on top, so any field present in the TS file wins.
//     This lets ambassadors add agenda, hosts, partners, photos, or correct
//     anything Luma got wrong without giving up auto-import.
//   - Events that exist only in TS (recaps from before we had the integration,
//     special posts) are kept as-is.
//
// All consumers should import from here, not from `@/content/events`. The
// content barrel is now just the raw input.

import { cache } from "react";

import type { CursorIndiaEvent } from "@/lib/types";
import {
  events as curatedEvents,
  sortByDateAsc,
  sortByDateDesc,
} from "@/content/events";
import { cities } from "@/content/cities";
import { fetchAllLumaEvents } from "@/lib/luma";

function indexCurated(curated: CursorIndiaEvent[]) {
  const byLumaUrl = new Map<string, CursorIndiaEvent>();
  const bySlug = new Map<string, CursorIndiaEvent>();
  for (const e of curated) {
    bySlug.set(e.slug, e);
    if (e.lumaUrl && !e.lumaUrl.includes("REPLACE_ME")) {
      byLumaUrl.set(e.lumaUrl, e);
    }
  }
  return { byLumaUrl, bySlug };
}

/** Derive a freshly-computed status so past Luma events show up as past. */
function withDerivedStatus(e: CursorIndiaEvent): CursorIndiaEvent {
  const isPast = new Date(e.date).getTime() < Date.now();
  return { ...e, status: isPast ? "past" : (e.status ?? "upcoming") };
}

/**
 * The merged set, memoized per React render via `cache()`. Network fetches
 * are additionally cached for ~1 min by Next's fetch revalidation, so this
 * only actually hits Luma about every minute per server process.
 */
export const getAllEvents = cache(async (): Promise<CursorIndiaEvent[]> => {
  const luma = await fetchAllLumaEvents(cities);
  const { byLumaUrl, bySlug } = indexCurated(curatedEvents);
  const merged: CursorIndiaEvent[] = [];
  const consumedCuratedSlugs = new Set<string>();

  for (const lumaEvt of luma) {
    let override: CursorIndiaEvent | undefined;
    if (lumaEvt.lumaUrl && byLumaUrl.has(lumaEvt.lumaUrl)) {
      override = byLumaUrl.get(lumaEvt.lumaUrl);
    } else if (bySlug.has(lumaEvt.slug)) {
      override = bySlug.get(lumaEvt.slug);
    }
    if (override) {
      consumedCuratedSlugs.add(override.slug);
      merged.push(withDerivedStatus({ ...lumaEvt, ...override }));
    } else {
      merged.push(withDerivedStatus(lumaEvt));
    }
  }

  for (const e of curatedEvents) {
    if (!consumedCuratedSlugs.has(e.slug)) {
      merged.push(withDerivedStatus(e));
    }
  }

  return merged;
});

export async function getEventBySlug(slug: string): Promise<CursorIndiaEvent | undefined> {
  const all = await getAllEvents();
  return all.find((e) => e.slug === slug);
}

export async function getEventsByCity(citySlug: string): Promise<CursorIndiaEvent[]> {
  const all = await getAllEvents();
  return all.filter((e) => e.city === citySlug);
}

export async function getUpcomingEvents(): Promise<CursorIndiaEvent[]> {
  const all = await getAllEvents();
  return all.filter((e) => e.status === "upcoming").sort(sortByDateAsc);
}

export async function getPastEvents(): Promise<CursorIndiaEvent[]> {
  const all = await getAllEvents();
  return all.filter((e) => e.status === "past").sort(sortByDateDesc);
}

export async function getNextEvent(): Promise<CursorIndiaEvent | undefined> {
  return (await getUpcomingEvents())[0];
}
