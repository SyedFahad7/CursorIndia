// Adapter that pulls events from a city's public Luma calendar (iCal feed)
// and converts each VEVENT into our CursorIndiaEvent shape.
//
// The feed is unauthenticated and lives at:
//   https://api.lu.ma/ics/get?entity=calendar&id=<cal-XXXX>
//
// We don't expose this URL anywhere on the site, we just call it server-side
// during render. Result is cached via Next's fetch revalidation (~1 min).

import type { City, CursorIndiaEvent, EventArchetype } from "@/lib/types";
import { ambassadors } from "@/content/ambassadors";
import { parseIcs, type IcsEvent } from "@/lib/ics";
import { devRelaxedFetch } from "@/lib/dev-fetch";
import { getLumaCalendarId } from "@/lib/admin-settings";
import { LUMA_REVALIDATE_SECONDS } from "@/lib/revalidate";

const LUMA_ICS_BASE = "https://api.lu.ma/ics/get?entity=calendar&id=";

/**
 * Derive an event archetype from the title alone (Luma doesn't have a
 * structured field for this). Defaults to "meetup".
 */
function inferArchetype(title: string): EventArchetype {
  const t = title.toLowerCase();
  if (t.includes("cafe cursor") || t.includes("café cursor")) return "cafe";
  if (t.includes("hackathon") || t.includes("hack night")) return "hackathon";
  if (t.includes("workshop") || t.includes("bootcamp")) return "workshop";
  return "meetup";
}

function kebab(s: string, maxLen = 48): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, maxLen);
}

/**
 * Build a readable, URL-safe slug from a Luma event. Format is
 * `<kebab-title>-<YYYY-MM-DD>` so it stays stable across renames on Luma
 * (Luma's own URL tail is sometimes an opaque `evt-XXXX` token, sometimes
 * a human slug; we don't want to depend on which).
 */
function deriveSlug(ics: IcsEvent): string {
  const title = kebab(ics.summary ?? "event");
  const date = ics.start?.slice(0, 10); // "2026-07-19"
  if (title && date) return `${title}-${date}`;
  if (title) return title;
  if (ics.url) {
    const tail = ics.url.replace(/\/+$/, "").split("/").pop();
    if (tail && /^[a-z0-9-]+$/i.test(tail)) return tail.toLowerCase();
  }
  if (ics.uid) {
    const safe = kebab(ics.uid.split("@")[0]!);
    if (safe) return safe;
  }
  return "event";
}

/**
 * Split a Luma LOCATION (often "Venue Name, Full Street Address...") into
 * a short venue label and a longer address. If only one segment is present,
 * the address is left undefined.
 */
function splitLocation(location: string | undefined): { venue: string; venueAddress?: string } {
  if (!location) return { venue: "Online" };
  const parts = location.split(/,\s+/);
  if (parts.length <= 1) return { venue: parts[0]!.trim() };
  return {
    venue: parts[0]!.trim(),
    venueAddress: parts.slice(1).join(", ").trim(),
  };
}

/** Hosts for an auto-imported event default to every ambassador in that city. */
function inferHosts(citySlug: string): CursorIndiaEvent["hosts"] {
  return ambassadors
    .filter((a) => a.city === citySlug)
    .map((a) => ({ handle: a.handle }));
}

function toCursorEvent(ics: IcsEvent, city: City): CursorIndiaEvent | null {
  if (!ics.summary || !ics.start) return null;

  const slug = deriveSlug(ics);
  const { venue, venueAddress } = splitLocation(ics.location);
  const isPast = new Date(ics.start).getTime() < Date.now();

  return {
    slug,
    title: ics.summary.trim(),
    archetype: inferArchetype(ics.summary),
    city: city.slug,
    date: ics.start,
    endDate: ics.end,
    venue,
    venueAddress,
    lumaUrl: ics.url,
    description: (ics.description ?? "").trim(),
    hosts: inferHosts(city.slug),
    status: isPast ? "past" : "upcoming",
  };
}

/**
 * Fetch and parse one city's Luma calendar. Always resolves: on any failure
 * we return [] and log a single warning so the rest of the build keeps going.
 */
export async function fetchCityLumaEvents(city: City): Promise<CursorIndiaEvent[]> {
  const calendarId = await getLumaCalendarId(city.slug);
  if (!calendarId) return [];

  const url = `${LUMA_ICS_BASE}${encodeURIComponent(calendarId)}`;

  try {
    const http = devRelaxedFetch() ?? fetch;
    const res = await http(url, {
      next: { revalidate: LUMA_REVALIDATE_SECONDS },
      headers: { Accept: "text/calendar" },
    });
    if (!res.ok) {
      console.warn(`[luma] ${city.slug}: HTTP ${res.status} from ${url}`);
      return [];
    }
    const text = await res.text();
    const parsed = parseIcs(text);
    return parsed
      .map((e) => toCursorEvent(e, city))
      .filter((e): e is CursorIndiaEvent => Boolean(e));
  } catch (err) {
    console.warn(`[luma] ${city.slug}: fetch failed`, err);
    return [];
  }
}

export async function fetchAllLumaEvents(cities: City[]): Promise<CursorIndiaEvent[]> {
  const perCity = await Promise.all(cities.map(fetchCityLumaEvents));
  return perCity.flat();
}
