"use client";

import { useLocale } from "@/lib/i18n/LocaleProvider";
import { cn } from "@/lib/utils";

/**
 * Text-only language toggle that mirrors the EN / TH style used by many
 * regional Cursor sites. Clicking it flips between English and Hindi, writes
 * the choice to a cookie, and triggers a server re-render so SSR-translated
 * content updates without a full page reload.
 */
export function LocaleToggle() {
  const { locale, setLocale, dict } = useLocale();
  const next = locale === "en" ? "hi" : "en";
  const label = dict.locale.switchTo(next);

  return (
    <button
      type="button"
      onClick={() => setLocale(next)}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex h-9 items-center gap-1.5 px-2 text-sm font-medium tracking-wide",
        "text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] rounded-[var(--radius-md)]",
      )}
    >
      <span
        className={
          locale === "en"
            ? "text-[var(--color-coral)]"
            : "text-[var(--color-subtle)]"
        }
      >
        EN
      </span>
      <span aria-hidden className="text-[var(--color-subtle)]">
        /
      </span>
      <span
        className={
          locale === "hi"
            ? "text-[var(--color-coral)]"
            : "text-[var(--color-subtle)]"
        }
      >
        HI
      </span>
    </button>
  );
}
