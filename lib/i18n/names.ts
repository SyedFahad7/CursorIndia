import type { Locale } from "./dictionaries";

/**
 * Resolve a locale-aware name for any entity that follows the
 * `{ name: string; i18n?: { hi?: { name?: string } } }` shape. Used for both
 * cities and ambassadors so callers don't need two parallel helpers.
 *
 * Multi-locale names paused — English only until we support several languages.
 */
export function localizedName(
  entity: { name: string; i18n?: { hi?: { name?: string } } },
  _locale: Locale,
): string {
  // if (locale === "hi") {
  //   const override = entity.i18n?.hi?.name;
  //   if (override) return override;
  // }
  return entity.name;
}
