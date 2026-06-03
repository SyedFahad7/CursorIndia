import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EventCard } from "@/components/events/EventCard";
import { Card } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";
import { getUpcomingEvents, getNextEvent } from "@/lib/events";
import { getDict } from "@/lib/i18n/server";

export async function UpcomingEvents() {
  const [next, all, dict] = await Promise.all([
    getNextEvent(),
    getUpcomingEvents(),
    getDict(),
  ]);
  const t = dict.upcoming;
  const rest = all.filter((e) => e.slug !== next?.slug);

  return (
    <section className="py-12 md:py-16">
      <Container width="wide">
        <SectionHeader
          eyebrow={t.eyebrow}
          title={t.title}
          cta={{ label: t.cta, href: "/events" }}
        />

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rest.length === 0 ? (
            <Card className="md:col-span-2 lg:col-span-3 p-8 text-center">
              <Text variant="muted">{t.empty}</Text>
            </Card>
          ) : (
            rest.map((e) => <EventCard key={e.slug} event={e} />)
          )}
        </div>
      </Container>
    </section>
  );
}
