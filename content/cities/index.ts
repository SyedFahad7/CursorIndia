// Cities barrel. Add a new city: copy any existing file, edit, then add to
// the list below.

import type { City } from "@/lib/types";
import type { Locale } from "@/lib/i18n/dictionaries";
import { localizedName } from "@/lib/i18n/names";

import { hyderabad } from "./hyderabad";
import { bengaluru } from "./bengaluru";
import { chennai } from "./chennai";
import { delhi } from "./delhi";
import { mumbai } from "./mumbai";
import { pune } from "./pune";
import { vadodara } from "./vadodara";
import { ahmedabad } from "./ahmedabad";
import { kashmir } from "./kashmir";

export const cities: City[] = [
  hyderabad,
  bengaluru,
  chennai,
  delhi,
  mumbai,
  pune,
  vadodara,
  ahmedabad,
  kashmir,
];

export function getCityBySlug(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug);
}

/**
 * Resolve a city name. When `locale` is omitted (or "en"), returns the canonical
 * English name. When "hi", returns the Hindi override if defined on the city
 * entry, otherwise falls back to English. Passing the slug for an unknown city
 * returns the slug itself, matching the prior behavior.
 */
export function getCityName(slug: string, locale: Locale = "en"): string {
  const city = getCityBySlug(slug);
  if (!city) return slug;
  return localizedName(city, locale);
}
