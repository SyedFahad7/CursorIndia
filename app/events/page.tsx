import type { Metadata } from "next";

import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { EventCard } from "@/components/events/EventCard";
import { PastEventRecapCard } from "@/components/recaps/PastEventRecapCard";
import { Card } from "@/components/ui/Card";
import { getPastEvents, getUpcomingEvents } from "@/lib/events";
import { getRecapMap } from "@/lib/recaps";
import { getDict } from "@/lib/i18n/server";
import { LUMA_REVALIDATE_SECONDS } from "@/lib/revalidate";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDict();
  return {
    title: dict.pages.events.title,
    description: dict.pages.events.metaDesc,
  };
}

export const revalidate = LUMA_REVALIDATE_SECONDS;

export default async function EventsIndexPage() {
  const [upcoming, past, dict, recapMap] = await Promise.all([
    getUpcomingEvents(),
    getPastEvents(),
    getDict(),
    getRecapMap(),
  ]);
  const t = dict.pages.events;

  return (
    <>
      <section className="py-12 md:py-16">
        <Container width="wide" className="flex flex-col gap-3">
          <Heading level={1} size="xl">
            {t.title}
          </Heading>
          <Text variant="lead" className="max-w-2xl">
            {t.lead}
          </Text>
        </Container>
      </section>

      <section className="py-6 md:py-10">
        <Container width="wide" className="flex flex-col gap-6">
          <Heading level={2} size="md">
            {t.upcomingHeading}
          </Heading>
          {upcoming.length === 0 ? (
            <Card className="p-8 text-center">
              <Text variant="muted">{t.emptyUpcoming}</Text>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((event) => (
                <EventCard key={event.slug} event={event} />
              ))}
            </div>
          )}
        </Container>
      </section>

      <section className="py-12 md:py-16">
        <Container width="wide" className="flex flex-col gap-6">
          <Heading level={2} size="md">
            {t.pastHeading}
          </Heading>
          {past.length === 0 ? (
            <Card className="p-8 text-center">
              <Text variant="muted">{t.emptyPast}</Text>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {past.map((event) => {
                const recap = recapMap.get(event.slug);
                if (recap && (recap.photos.length > 0 || recap.summary)) {
                  return (
                    <PastEventRecapCard
                      key={event.slug}
                      event={event}
                      recap={recap}
                      viewRecapLabel="View recap"
                    />
                  );
                }
                return <EventCard key={event.slug} event={event} />;
              })}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
