// Build-time search index assembled from all content barrels.
// Plain TS — imported by the server component that wraps the CmdK client,
// passed in as JSON. Keeps the bundle tiny and the index always in sync.

import { getAllEvents } from "@/lib/events";
import { cities, getCityName } from "@/content/cities";
import { ambassadors, getAmbassadorName } from "@/content/ambassadors";
import { archetypeLabel, formatIST } from "@/lib/utils";
import { localizedName } from "@/lib/i18n/names";
import type { Dict, Locale } from "@/lib/i18n/dictionaries";

export type SearchKind = "event" | "city" | "ambassador" | "page";

export interface SearchItem {
  kind: SearchKind;
  id: string;
  title: string;
  subtitle?: string;
  href: string;
  /** Free-form text appended to the search field for matching purposes. */
  keywords: string;
}

export async function buildSearchIndex(
  locale: Locale,
  dict: Dict,
): Promise<SearchItem[]> {
  const items: SearchItem[] = [];
  const events = await getAllEvents();
  const cityLabel = dict.pages.cityDetail.cursorPrefix; // "Cursor"
  const ambassadorLabel = dict.common.cursorAmbassador;

  for (const e of events) {
    // No internal event detail page: jump to Luma when available, else fall
    // back to the events index. External (http) hrefs are opened in a new tab
    // by the Cmd+K dialog.
    items.push({
      kind: "event",
      id: `event:${e.slug}`,
      title: e.title,
      subtitle: `${archetypeLabel(e.archetype)} · ${getCityName(e.city, locale)} · ${formatIST(e.date)}`,
      href: e.lumaUrl ?? "/events",
      keywords: [
        e.title,
        archetypeLabel(e.archetype),
        // Index both English and localized so users can search in either.
        getCityName(e.city, "en"),
        getCityName(e.city, locale),
        e.venue,
        e.description,
      ].join(" "),
    });
  }

  for (const c of cities) {
    const display = localizedName(c, locale);
    items.push({
      kind: "city",
      id: `city:${c.slug}`,
      title: display,
      subtitle: `${cityLabel} ${display}`,
      href: `/cities/${c.slug}`,
      keywords: [c.name, display].join(" "),
    });
  }

  // Ambassadors have no detail page; surface them in search by linking to the
  // shared /ambassadors index, with a deep-link hash so users land near the
  // right card (CSS :target won't render anything special, but the URL is
  // still useful for sharing).
  for (const a of ambassadors) {
    const display = getAmbassadorName(a, locale);
    items.push({
      kind: "ambassador",
      id: `ambassador:${a.handle}`,
      title: display,
      subtitle: `${ambassadorLabel} · ${getCityName(a.city, locale)}`,
      href: `/ambassadors#${a.handle}`,
      keywords: [
        a.name,
        display,
        a.handle,
        ambassadorLabel,
        getCityName(a.city, "en"),
        getCityName(a.city, locale),
      ].join(" "),
    });
  }

  const pages = dict.pages.searchPages;
  for (const p of pages) {
    items.push({
      kind: "page",
      id: `page:${p.href}`,
      title: p.title,
      subtitle: p.subtitle,
      href: p.href,
      keywords: `${p.title} ${p.subtitle}`,
    });
  }

  return items;
}
