import type { Metadata } from "next";

import { Container } from "@/components/ui/Container";
import { Heading, Eyebrow } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Card } from "@/components/ui/Card";
import { PhotoGallery } from "@/components/gallery/PhotoGallery";
import { getAllEvents } from "@/lib/events";
import { getCityName } from "@/content/cities";
import { getEventGallery } from "@/lib/photos";
import { getDict } from "@/lib/i18n/server";
import { formatIST } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDict();
  return {
    title: dict.pages.gallery.title,
    description: dict.pages.gallery.metaDesc,
  };
}

export const revalidate = 21600;

export default async function GalleryPage() {
  const [all, dict] = await Promise.all([getAllEvents(), getDict()]);
  const t = dict.pages.gallery;
  const groups = all
    .map((e) => ({ event: e, photos: getEventGallery(e) }))
    .filter((g) => g.photos.length > 0)
    .sort((a, b) => b.event.date.localeCompare(a.event.date));

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

      {groups.length === 0 ? (
        <section className="pb-16">
          <Container width="wide">
            <Card className="p-10 text-center">
              <Text variant="muted">
                {t.emptyPrefix}{" "}
                <code className="font-mono text-[var(--color-text)]">
                  /public/images/events/&lt;slug&gt;/
                </code>{" "}
                {t.emptySuffix}
              </Text>
            </Card>
          </Container>
        </section>
      ) : (
        groups.map(({ event, photos }) => (
          <section key={event.slug} className="pb-16 md:pb-20">
            <Container width="wide" className="flex flex-col gap-6">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <Eyebrow>
                    {formatIST(event.date)} · {getCityName(event.city)}
                  </Eyebrow>
                  <Heading level={2} size="md">
                    {event.title}
                  </Heading>
                </div>
                {event.lumaUrl ? (
                  <a
                    href={event.lumaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
                  >
                    {t.eventDetails}
                  </a>
                ) : null}
              </div>
              <PhotoGallery photos={photos} title={event.title} />
            </Container>
          </section>
        ))
      )}
    </>
  );
}
