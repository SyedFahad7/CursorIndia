// Curated events barrel.
// Events normally come from each city's Luma calendar (see lib/luma.ts).
// Drop a TS file here only when an event needs extra editorial data that
// Luma doesn't carry: full agenda, partners list, recap photos, etc.
// The TS file is matched to its Luma event by `lumaUrl` (or by `slug`).

import type { CursorIndiaEvent } from "@/lib/types";

export const events: CursorIndiaEvent[] = [];

export function sortByDateAsc(a: CursorIndiaEvent, b: CursorIndiaEvent): number {
  return a.date.localeCompare(b.date);
}

export function sortByDateDesc(a: CursorIndiaEvent, b: CursorIndiaEvent): number {
  return b.date.localeCompare(a.date);
}
