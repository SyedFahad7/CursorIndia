// Minimal RFC 5545 iCalendar parser, scoped to what Luma actually emits.
// We deliberately avoid pulling in `ical.js` / `node-ical` because we only need
// a handful of fields per VEVENT and the format is line-based and well-behaved.
//
// Handles:
//   - line unfolding (continuation lines start with a space or tab)
//   - basic VEVENT extraction
//   - DTSTART / DTEND in UTC ("Z" suffix), with TZID parameter, or floating
//   - DESCRIPTION / LOCATION / SUMMARY un-escaping (\n, \,, \;, \\)
//
// What we ignore on purpose: RRULE / recurrence, VALARM, VTIMEZONE blocks,
// non-Gregorian calendars. Luma events are one-shots so this is fine.

export interface IcsEvent {
  uid?: string;
  summary?: string;
  description?: string;
  location?: string;
  url?: string;
  /** ISO-8601 string with offset, e.g. "2026-07-19T16:00:00+05:30". */
  start?: string;
  /** ISO-8601 string with offset. */
  end?: string;
}

/** Asia/Kolkata is the only TZID we care about; map anything else to UTC. */
const ZONE_OFFSETS: Record<string, string> = {
  "Asia/Kolkata": "+05:30",
};

const DEFAULT_OFFSET = "+05:30";

/** Unfold continuation lines per RFC 5545 §3.1. */
function unfold(raw: string): string[] {
  const lines = raw.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  for (const line of lines) {
    if ((line.startsWith(" ") || line.startsWith("\t")) && out.length > 0) {
      out[out.length - 1] += line.slice(1);
    } else {
      out.push(line);
    }
  }
  return out;
}

function unescapeText(s: string): string {
  return s
    .replace(/\\n/gi, "\n")
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .replace(/\\\\/g, "\\");
}

/**
 * Pull the public event link out of free text. Luma no longer emits a `URL:`
 * property on every VEVENT; instead the link lives in the DESCRIPTION, e.g.
 * "Get up-to-date information at: https://luma.com/ku63fb9z". Matches both the
 * legacy `lu.ma` and current `luma.com` hosts. Returns the first match.
 */
export function extractLumaUrl(text: string | undefined): string | undefined {
  if (!text) return undefined;
  // URL-safe chars only: stops at whitespace, backslashes, or escaped "\n"
  // sequences regardless of whether the text has been un-escaped yet.
  const m = text.match(/https?:\/\/(?:[\w-]+\.)?(?:lu\.ma|luma\.com)\/[\w\-/?=&%.#]+/i);
  return m ? m[0].replace(/[.#]+$/, "") : undefined;
}

/**
 * Parse a value like `20260719T160000`, `20260719T160000Z`, or `20260719`
 * into an ISO-8601 string with an explicit offset.
 */
function icsDateTimeToIso(raw: string, tzid?: string): string | undefined {
  const m = raw.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})(Z)?)?$/);
  if (!m) return undefined;
  const [, y, mo, d, hh = "00", mm = "00", ss = "00", z] = m;
  const datePart = `${y}-${mo}-${d}`;
  const timePart = `${hh}:${mm}:${ss}`;
  const offset = z ? "+00:00" : tzid ? ZONE_OFFSETS[tzid] ?? DEFAULT_OFFSET : DEFAULT_OFFSET;
  return `${datePart}T${timePart}${offset}`;
}

/** Split `DTSTART;TZID=Asia/Kolkata` into name + { TZID: "Asia/Kolkata" }. */
function parseKey(key: string): { name: string; params: Record<string, string> } {
  const parts = key.split(";");
  const name = parts[0]!.toUpperCase();
  const params: Record<string, string> = {};
  for (let i = 1; i < parts.length; i++) {
    const [k, v] = parts[i]!.split("=");
    if (k && v) params[k.toUpperCase()] = v;
  }
  return { name, params };
}

export function parseIcs(raw: string): IcsEvent[] {
  const lines = unfold(raw);
  const events: IcsEvent[] = [];
  let cur: IcsEvent | null = null;

  for (const line of lines) {
    if (line === "BEGIN:VEVENT") {
      cur = {};
      continue;
    }
    if (line === "END:VEVENT") {
      if (cur) {
        // Luma usually omits the URL property; recover it from the description.
        if (!cur.url) cur.url = extractLumaUrl(cur.description);
        events.push(cur);
      }
      cur = null;
      continue;
    }
    if (!cur) continue;

    const colon = line.indexOf(":");
    if (colon < 0) continue;
    const rawKey = line.slice(0, colon);
    const rawVal = line.slice(colon + 1);
    const { name, params } = parseKey(rawKey);

    switch (name) {
      case "UID":
        cur.uid = rawVal;
        break;
      case "SUMMARY":
        cur.summary = unescapeText(rawVal);
        break;
      case "DESCRIPTION":
        cur.description = unescapeText(rawVal);
        break;
      case "LOCATION":
        cur.location = unescapeText(rawVal);
        break;
      case "URL":
        cur.url = rawVal;
        break;
      case "DTSTART":
        cur.start = icsDateTimeToIso(rawVal, params.TZID);
        break;
      case "DTEND":
        cur.end = icsDateTimeToIso(rawVal, params.TZID);
        break;
    }
  }

  return events;
}
