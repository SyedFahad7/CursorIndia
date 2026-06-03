// Ambassadors barrel.

import type { Ambassador } from "@/lib/types";
import type { Locale } from "@/lib/i18n/dictionaries";
import { localizedName } from "@/lib/i18n/names";

import { syedFahad } from "./syed-fahad";
import { mohammedSanjeed } from "./mohammed-sanjeed";
import { rahulPattamatta } from "./rahul-pattamatta";
import { hadiKhan } from "./hadi-khan";
import { yashKalwani } from "./yash-kalwani";
import { rachittShah } from "./rachitt-shah";
import { shreyShah } from "./shrey-shah";
import { krushnasinhJadeja } from "./krushnasinh-jadeja";
import { mohtashamMurshidMadani } from "./mohtasham-murshid-madani";

export const ambassadors: Ambassador[] = [
  syedFahad,
  mohammedSanjeed,
  rahulPattamatta,
  hadiKhan,
  yashKalwani,
  rachittShah,
  shreyShah,
  krushnasinhJadeja,
  mohtashamMurshidMadani,
];

export function getAmbassadorByHandle(handle: string): Ambassador | undefined {
  return ambassadors.find((a) => a.handle === handle);
}

export function getAmbassadorsByCity(citySlug: string): Ambassador[] {
  return ambassadors.filter((a) => a.city === citySlug);
}

/** Resolve an ambassador's display name for the given locale, falling back to
 *  the canonical English name when no override is defined. Mirrors getCityName. */
export function getAmbassadorName(a: Ambassador, locale: Locale = "en"): string {
  return localizedName(a, locale);
}
