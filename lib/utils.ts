import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Tailwind-safe className combiner. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Format an ISO datetime into the Cursor India house style:
 *   "Sat, 12 Jul 2026 · 4 pm IST"
 *
 * All values are computed in IST (+05:30) so the output is identical
 * regardless of the viewer's locale.
 */
export function formatIST(iso: string, opts: { includeTime?: boolean } = {}) {
  const date = new Date(iso);
  // Convert to IST manually so server/client agree.
  const istMs = date.getTime() + 5.5 * 60 * 60 * 1000;
  const ist = new Date(istMs);

  const day = DAYS_SHORT[ist.getUTCDay()];
  const dd = ist.getUTCDate();
  const mmm = MONTHS_SHORT[ist.getUTCMonth()];
  const yyyy = ist.getUTCFullYear();

  if (!opts.includeTime) {
    return `${day}, ${dd} ${mmm} ${yyyy}`;
  }

  let hours = ist.getUTCHours();
  const mins = ist.getUTCMinutes();
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  if (hours === 0) hours = 12;
  const minStr = mins === 0 ? "" : `:${mins.toString().padStart(2, "0")}`;

  return `${day}, ${dd} ${mmm} ${yyyy} · ${hours}${minStr} ${ampm} IST`;
}

/** Format just the time portion in IST, e.g. "4 pm". */
export function formatTimeIST(iso: string) {
  const date = new Date(iso);
  const istMs = date.getTime() + 5.5 * 60 * 60 * 1000;
  const ist = new Date(istMs);
  let hours = ist.getUTCHours();
  const mins = ist.getUTCMinutes();
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  if (hours === 0) hours = 12;
  const minStr = mins === 0 ? "" : `:${mins.toString().padStart(2, "0")}`;
  return `${hours}${minStr} ${ampm}`;
}

/** Quick relative-time helper used on event cards. */
export function relativeFromNow(iso: string): string {
  const target = new Date(iso).getTime();
  const now = Date.now();
  const diff = target - now;
  const future = diff > 0;
  const ms = Math.abs(diff);
  const days = Math.floor(ms / 86_400_000);
  const hours = Math.floor((ms / 3_600_000) % 24);
  if (days >= 1) return future ? `in ${days}d` : `${days}d ago`;
  if (hours >= 1) return future ? `in ${hours}h` : `${hours}h ago`;
  return future ? "soon" : "just now";
}

/** Maps an archetype to a short, human label. */
export function archetypeLabel(a: "cafe" | "workshop" | "meetup" | "hackathon"): string {
  switch (a) {
    case "cafe":
      return "Cafe Cursor";
    case "workshop":
      return "Workshop";
    case "meetup":
      return "Meetup";
    case "hackathon":
      return "Hackathon";
  }
}
