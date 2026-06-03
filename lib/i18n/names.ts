import type { Locale } from "./dictionaries";

/**
 * Resolve a locale-aware name for any entity that follows the
 * `{ name: string; i18n?: { hi?: { name?: string } } }` shape. Used for both
 * cities and ambassadors so callers don't need two parallel helpers.
 *
 * Falls back to the canonical English `name` whenever the active locale lacks
 * an override. Brand identifiers (e.g. "Cursor") that should stay English in
 * every locale simply omit their i18n entry.
 */
export function localizedName(
  entity: { name: string; i18n?: { hi?: { name?: string } } },
  locale: Locale,
): string {
  if (locale === "hi") {
    const override = entity.i18n?.hi?.name;
    if (override) return override;
  }
  return entity.name;
}
