// Cursor India content types.
// One TS file per event / city / ambassador in /content/*. Files import these
// types and export typed objects. Adding a new entity means creating one file
// and registering it in the matching barrel.

/**
 * Locale-specific overrides for a content entity. Today only `name` is
 * localized; widen this shape if other fields ever need translation. Brand
 * names that should stay English in every locale just omit the entry.
 */
export interface LocaleOverrides {
  hi?: {
    name?: string;
  };
}

export type CitySlug =
  | "hyderabad"
  | "bengaluru"
  | "chennai"
  | "delhi"
  | "mumbai"
  | "pune"
  | "vadodara"
  | "ahmedabad"
  | "kashmir"
  | (string & {});

export type EventArchetype = "cafe" | "workshop" | "meetup" | "hackathon";

export type EventStatus = "upcoming" | "past";

export interface SocialLinks {
  x?: string;
  linkedin?: string;
  /** Plain email address, no `mailto:` prefix. Renders as a mail icon. */
  email?: string;
}

export interface Ambassador {
  /** Kebab-case handle. URL at /ambassadors/<handle>. */
  handle: string;
  name: string;
  city: CitySlug;
  /** Path under /public/images/ambassadors/. */
  photo: string;
  links: SocialLinks;
  /** Optional per-locale overrides. Currently only `name`. */
  i18n?: LocaleOverrides;
}

export interface City {
  slug: CitySlug;
  name: string;
  heroImage?: string;
  links?: {
    /** Public Luma calendar URL (e.g. https://lu.ma/cursor-hyderabad). */
    luma?: string;
  };
  /**
   * Luma calendar ID (the `cal-XXXXXX` part from the calendar's iCal URL).
   * When set, upcoming + past events are auto-fetched from Luma and merged
   * with any matching TS files in /content/events. Find this in the Luma
   * calendar dashboard under Settings -> Calendar API / Sync.
   */
  lumaCalendarId?: string;
  /** Optional per-locale overrides. Currently only `name`. */
  i18n?: LocaleOverrides;
}

export interface EventHost {
  /** Ambassador handle, OR free-form name for guest hosts. */
  handle?: string;
  name?: string;
}

export interface EventPhoto {
  src: string;
  alt: string;
  credit?: string;
}

export interface CursorIndiaEvent {
  slug: string;
  title: string;
  archetype: EventArchetype;
  city: CitySlug;
  /** ISO datetime with IST offset, e.g. "2026-07-12T16:00:00+05:30". */
  date: string;
  endDate?: string;
  venue: string;
  venueAddress?: string;
  capacity?: number;
  attendees?: number;
  cost?: number;
  lumaUrl?: string;
  description: string;
  agenda?: { time: string; item: string }[];
  hosts: EventHost[];
  partners?: string[];
  heroImage?: string;
  /**
   * Photos for the event gallery.
   * Omit to auto-discover images in /public/images/events/<slug>/.
   * Provide an array to override discovery (gives caption / order / credit control).
   */
  photos?: EventPhoto[];
  status: EventStatus;
  recap?: {
    summary: string;
    highlights?: string[];
    featured?: { name: string; by: string; url?: string }[];
  };
}

export interface SiteConfig {
  name: string;
  shortName: string;
  description: string;
  url: string;
  email: string;
  social: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
  community: {
    whatsapp?: string;
    discord?: string;
    telegram?: string;
    forum?: string;
    luma?: string;
    /** Global Cursor community calendar on Luma (all regions). */
    lumaGlobal?: string;
  };
  cursorOfficial: {
    site: string;
    community: string;
    forum: string;
    x?: string;
    linkedin?: string;
    discord?: string;
  };
}
