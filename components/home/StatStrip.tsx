import { getDict } from "@/lib/i18n/server";

// Soft community stats. Hand-set rather than auto-derived: members and event
// totals are aspirational round numbers, not live counts. Update when a
// milestone moves. Numbers stay the same across locales; only labels translate.

export async function StatStrip() {
  const dict = await getDict();
  const t = dict.stats;

  const stats = [
    { value: "9", label: t.cities },
    { value: "3000+", label: t.members },
    { value: "12+", label: t.events },
  ];

  return (
    <section
      aria-label={t.sectionAria}
      className="py-6 md:py-8"
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-3 gap-6 px-4 md:px-6 lg:px-8">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col items-center gap-1 text-center">
            <span className="text-2xl font-semibold tabular-nums tracking-tight md:text-3xl text-[var(--color-text)]">
              {s.value}
            </span>
            <span className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--color-subtle)]">
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
