import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight, Calendar } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Card } from "@/components/ui/Card";
import { EventCard } from "@/components/events/EventCard";
import { PastEventRecapCard } from "@/components/recaps/PastEventRecapCard";
import { AmbassadorCard } from "@/components/ambassadors/AmbassadorCard";
import { cities, getCityBySlug } from "@/content/cities";
import { getCityForDisplay, getAmbassadorsForCity } from "@/lib/admin-settings";
import { getEventsByCity } from "@/lib/events";
import { getRecapMap } from "@/lib/recaps";
import { getDict, getServerLocale } from "@/lib/i18n/server";
import { localizedName } from "@/lib/i18n/names";

/** Keep in sync with LUMA_REVALIDATE_SECONDS in lib/revalidate.ts */
export const revalidate = 60;

export function generateStaticParams() {
  return cities.map((c) => ({ slug: c.slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const city = getCityBySlug(slug);
  const [dict, locale] = await Promise.all([getDict(), getServerLocale()]);
  if (!city) return { title: dict.pages.cityDetail.notFound };
  const cityName = localizedName(city, locale);
  return {
    title: `${dict.pages.cityDetail.cursorPrefix} ${cityName}`,
    description: dict.pages.cityDetail.metaDesc(cityName),
  };
}

export default async function CityDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const city = await getCityForDisplay(slug);
  if (!city) notFound();

  const [dict, locale] = await Promise.all([getDict(), getServerLocale()]);
  const t = dict.pages.cityDetail;
  const cityName = localizedName(city, locale);

  const [cityAmbassadors, cityEvents, recapMap] = await Promise.all([
    getAmbassadorsForCity(city.slug),
    getEventsByCity(city.slug),
    getRecapMap(),
  ]);
  const sortedEvents = cityEvents.sort((a, b) => a.date.localeCompare(b.date));
  const upcoming = sortedEvents.filter((e) => e.status === "upcoming");
  const past = sortedEvents.filter((e) => e.status === "past");

  return (
    <>
      <section className="py-12 md:py-16">
        <Container width="wide" className="flex flex-col gap-5">
          <Link
            href="/cities"
            className="text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] w-fit"
          >
            {t.back}
          </Link>
          <Heading level={1} size="xl">
            {t.cursorPrefix} {cityName}
          </Heading>
        </Container>
      </section>

      {cityAmbassadors.length > 0 ? (
        <section className="py-6 md:py-10">
          <Container width="wide" className="flex flex-col gap-6">
            <Heading level={2} size="md">
              {t.ambassadorsHeading}
            </Heading>
            <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 [&>*]:min-h-0">
              {cityAmbassadors.map((a) => (
                <AmbassadorCard key={a.handle} ambassador={a} />
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <section className="py-12 md:py-16">
        <Container width="wide" className="flex flex-col gap-6">
          <Heading level={2} size="md">
            {t.upcomingHeading(cityName)}
          </Heading>
          {upcoming.length === 0 ? (
            <Card className="p-8 text-center">
              <Text variant="muted">{t.emptyUpcoming}</Text>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((e) => (
                <EventCard key={e.slug} event={e} />
              ))}
            </div>
          )}
          {city.links?.luma ? (
            <div className="flex justify-end">
              <a
                href={city.links.luma}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-text)] hover:underline underline-offset-4"
              >
                <Calendar className="h-4 w-4 shrink-0" aria-hidden />
                {t.subscribeUpdates}
                <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden />
              </a>
            </div>
          ) : null}
        </Container>
      </section>

      {past.length > 0 ? (
        <section className="pb-16 md:pb-20">
          <Container width="wide" className="flex flex-col gap-6">
            <Heading level={2} size="md">
              {t.pastHeading(cityName)}
            </Heading>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {past.map((e) => {
                const recap = recapMap.get(e.slug);
                if (recap && (recap.photos.length > 0 || recap.summary)) {
                  return (
                    <PastEventRecapCard
                      key={e.slug}
                      event={e}
                      recap={recap}
                      viewRecapLabel={dict.pages.eventDetail.recap}
                    />
                  );
                }
                return <EventCard key={e.slug} event={e} />;
              })}
            </div>
          </Container>
        </section>
      ) : null}
    </>
  );
}
