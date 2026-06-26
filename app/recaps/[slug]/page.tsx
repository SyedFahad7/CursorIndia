import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { RecapPhotoGrid } from "@/components/recaps/RecapPhotoGrid";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { getCityName } from "@/content/cities";
import { getEventBySlug } from "@/lib/events";
import { getRecapBySlug } from "@/lib/recaps";
import { getServerLocale } from "@/lib/i18n/server";
import { formatLongDate } from "@/lib/utils";

/** Keep in sync with LUMA_REVALIDATE_SECONDS in lib/revalidate.ts */
export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const [recap, event] = await Promise.all([getRecapBySlug(slug), getEventBySlug(slug)]);
  if (!recap || !event) return { title: "Recap" };
  return {
    title: `${event.title} — Recap`,
    description: recap.summary || `Photos and recap from ${event.title}.`,
  };
}

export default async function RecapPage({ params }: PageProps) {
  const { slug } = await params;
  const [recap, event, locale] = await Promise.all([
    getRecapBySlug(slug),
    getEventBySlug(slug),
    getServerLocale(),
  ]);

  if (!recap || !event) notFound();

  const cityName = getCityName(event.city, locale);

  return (
    <article className="py-12 md:py-16">
      <Container width="narrow" className="flex flex-col gap-8">
        <Link
          href={`/cities/${event.city}`}
          className="text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] w-fit"
        >
          ← Back to Cursor {cityName}
        </Link>

        <header className="flex flex-col gap-3">
          <Heading level={1} size="lg">
            {event.title} — Recap
          </Heading>
          <Text variant="muted">{formatLongDate(event.date)}</Text>
          {recap.summary ? (
            <Text variant="lead" className="max-w-2xl text-base md:text-lg">
              {recap.summary}
            </Text>
          ) : null}
        </header>

        <RecapPhotoGrid photos={recap.photos} photoCredit={recap.photoCredit} />
      </Container>
    </article>
  );
}
