import { Container } from "@/components/ui/Container";
import { ProgressText } from "@/components/ui/ProgressText";
import { getDict } from "@/lib/i18n/server";
import { cn } from "@/lib/utils";

// Each card gets a slightly different rotation so the row reads as
// hand-arranged, not stamped. Order matches the dict.intro.audiences order:
// developers, designers, students, founders.
const tilts = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2"];

export async function IntroCard() {
  const dict = await getDict();
  const t = dict.intro;
  const audiences = [
    t.audiences.developers,
    t.audiences.designers,
    t.audiences.students,
    t.audiences.founders,
  ];

  return (
    <section aria-labelledby="intro-heading" className="py-16 md:py-24">
      <Container width="wide">
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 md:p-12 lg:p-16">
          <ProgressText
            as="h2"
            id="intro-heading"
            className="text-3xl font-semibold tracking-tight md:text-5xl"
          >
            {t.h1}
          </ProgressText>

          <ProgressText
            as="h3"
            className="mt-3 text-2xl font-semibold tracking-tight md:mt-4 md:text-4xl"
          >
            {t.h2}
          </ProgressText>

          <ProgressText className="mt-6 max-w-2xl text-base md:text-lg">
            {t.line1}
          </ProgressText>

          <ProgressText className="max-w-2xl text-base md:text-lg">
            {t.line2}
          </ProgressText>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:mt-14">
            {audiences.map((a, i) => (
              <article
                key={a.title}
                className={cn(
                  "h-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-elevated)] p-5 md:p-6",
                  tilts[i],
                )}
              >
                <h4 className="text-base font-semibold text-[var(--color-text)]">
                  <span
                    aria-hidden
                    className="mb-2 block h-0.5 w-5 rounded-full bg-[var(--color-coral)]/55"
                  />
                  {a.title}
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
                  {a.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
