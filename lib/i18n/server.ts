import "server-only";

import { cookies } from "next/headers";

import {
  COOKIE_NAME,
  DEFAULT_LOCALE,
  dictionaries,
  isLocale,
  type Dict,
  type Locale,
} from "./dictionaries";

/**
 * Read the active locale from the request cookie. Falls back to the default
 * locale when the cookie is missing or invalid. Safe to call from any server
 * component, layout, route handler, or generateMetadata function.
 *
 * Cookies + server reading is what unlocks SSR Hindi rendering. The client
 * `LocaleProvider` writes the same cookie when the user toggles language, and
 * triggers `router.refresh()` so server components re-render with the new
 * cookie value. No `[locale]` URL segment required.
 */
export async function getServerLocale(): Promise<Locale> {
  try {
    const store = await cookies();
    const value = store.get(COOKIE_NAME)?.value;
    if (isLocale(value)) return value;
  } catch {
    // cookies() throws outside of a request context (e.g. during static
    // generation of a fully-static page). Fall through to the default.
  }
  return DEFAULT_LOCALE;
}

/** Resolve the active dictionary for the current request. */
export async function getDict(): Promise<Dict> {
  const locale = await getServerLocale();
  return dictionaries[locale];
}
