import Link from "next/link";
import { ArrowUpRight, Calendar, MapPin, Users } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { Eyebrow, Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getNextEvent } from "@/lib/events";
import { getCityName } from "@/content/cities";
import { getDict, getServerLocale } from "@/lib/i18n/server";
import { archetypeLabel, formatIST, formatTimeIST } from "@/lib/utils";

export async function NextEvent() {
  const [next, dict, locale] = await Promise.all([
    getNextEvent(),
    getDict(),
    getServerLocale(),
  ]);
  if (!next) return null;
  const t = dict.nextEvent;
  const cityName = getCityName(next.city, locale);

  return (
    <section className="py-16 md:py-20">
      <Container width="wide">
        <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-2">
            <Eyebrow>{t.eyebrow}</Eyebrow>
            <Heading level={2} size="lg">
              {t.titlePrefix} {cityName}
            </Heading>
          </div>
        </div>

        <Card variant="elevated" className="overflow-hidden">
          <div className="grid gap-0 md:grid-cols-5">
            <div
              aria-hidden
              className="hidden md:block md:col-span-2 bg-[radial-gradient(60%_60%_at_40%_40%,var(--color-accent-soft)_0%,transparent_70%)]"
            >
              <div className="flex h-full flex-col justify-between p-6 md:p-8">
                <Badge variant="accent">{archetypeLabel(next.archetype)}</Badge>
                <div className="flex flex-col gap-3">
                  <Eyebrow>{t.saveTheDate}</Eyebrow>
                  <span className="text-3xl font-semibold tabular-nums tracking-tight text-[var(--color-text)] md:text-4xl">
                    {formatIST(next.date)}
                  </span>
                  <span className="text-sm text-[var(--color-muted)]">
                    {formatTimeIST(next.date)} {t.ist}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 p-6 md:col-span-3 md:p-8">
              {/* Mobile-only inline badge */}
              <div className="md:hidden">
                <Badge variant="accent">{archetypeLabel(next.archetype)}</Badge>
              </div>

              <Heading level={3} size="md" className="leading-tight">
                {next.title}
              </Heading>

              <div className="flex flex-col gap-1.5 text-sm text-[var(--color-muted)]">
                <span className="inline-flex items-center gap-2 md:hidden">
                  <Calendar className="h-4 w-4" aria-hidden />
                  {formatIST(next.date)} · {formatTimeIST(next.date)} {t.ist}
                </span>
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4" aria-hidden />
                  {next.venue}, {cityName}
                </span>
                {typeof next.capacity === "number" ? (
                  <span className="inline-flex items-center gap-2">
                    <Users className="h-4 w-4" aria-hidden />
                    {t.capacity} {next.capacity}
                  </span>
                ) : null}
              </div>

              <Text variant="muted" className="line-clamp-3 text-sm">
                {next.description}
              </Text>

              {next.lumaUrl ? (
                <div className="mt-2 flex flex-wrap gap-3">
                  <Button href={next.lumaUrl} external size="md">
                    {t.register}
                    <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        </Card>

        <div className="mt-6">
          <Link
            href="/events"
            className="text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
          >
            {t.seeAll}
          </Link>
        </div>
      </Container>
    </section>
  );
}
