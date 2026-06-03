import type { Metadata } from "next";

import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { EventCard } from "@/components/events/EventCard";
import { Card } from "@/components/ui/Card";
import { getPastEvents, getUpcomingEvents } from "@/lib/events";
import { getDict } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDict();
  return {
    title: dict.pages.events.title,
    description: dict.pages.events.metaDesc,
  };
}

export const revalidate = 21600;

export default async function EventsIndexPage() {
  const [upcoming, past, dict] = await Promise.all([
    getUpcomingEvents(),
    getPastEvents(),
    getDict(),
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
              {past.map((event) => (
                <EventCard key={event.slug} event={event} />
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
