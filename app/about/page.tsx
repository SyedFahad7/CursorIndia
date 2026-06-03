import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Card } from "@/components/ui/Card";
import { getDict } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDict();
  return {
    title: dict.pages.about.title,
    description: dict.pages.about.metaDesc,
  };
}

export default async function AboutPage() {
  const dict = await getDict();
  const t = dict.pages.about;

  const eventTypes = [
    { title: t.whatBody.cafe, description: t.whatBody.cafeDesc },
    { title: t.whatBody.workshops, description: t.whatBody.workshopsDesc },
    { title: t.whatBody.meetups, description: t.whatBody.meetupsDesc },
    { title: t.whatBody.hackathons, description: t.whatBody.hackathonsDesc },
  ];

  return (
    <>
      <section className="py-12 md:py-20">
        <Container width="narrow" className="flex flex-col gap-4">
          <Heading level={1} size="xl">
            {t.title}
          </Heading>
          <Text variant="lead">{t.lead}</Text>
        </Container>
      </section>

      <section className="pb-16 md:pb-20">
        <Container width="narrow" className="flex flex-col gap-10">
          <div className="flex flex-col gap-3">
            <Heading level={2} size="md">
              {t.globalHeading}
            </Heading>
            <Text variant="muted">{t.globalBody}</Text>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Heading level={2} size="md">
                {t.whatHeading}
              </Heading>
              <Text variant="muted">{t.whatBody.intro}</Text>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {eventTypes.map((event) => (
                <Card key={event.title} className="p-5 md:p-6">
                  <Heading level={3} size="sm" className="!text-lg">
                    {event.title}
                  </Heading>
                  <Text variant="muted" className="mt-2 text-sm leading-relaxed">
                    {event.description}
                  </Text>
                </Card>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Heading level={2} size="md">
              {t.howHeading}
            </Heading>
            <ul className="flex flex-col gap-3 text-[var(--color-muted)]">
              {t.principles.map((p, i) => {
                const isLast = i === t.principles.length - 1;
                return (
                  <li key={p.title} className="flex gap-3">
                    <span
                      aria-hidden
                      className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-[var(--color-accent)]"
                    />
                    <span>
                      <strong className="text-[var(--color-text)]">
                        {p.title}
                      </strong>{" "}
                      {p.body}
                      {isLast ? (
                        <>
                          {" "}
                          <Link
                            href="/code-of-conduct"
                            className="underline underline-offset-2 decoration-[var(--color-border-strong)] text-[var(--color-text)] hover:decoration-[var(--color-text)] transition-colors"
                          >
                            {dict.footer.nav.codeOfConduct.toLowerCase()}
                          </Link>{" "}
                          {t.principlesTail}
                        </>
                      ) : null}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <Heading level={2} size="md">
              {t.hostHeading}
            </Heading>
            <Text variant="muted">
              {t.hostBody.intro}{" "}
              <Link
                href="/submit"
                className="underline underline-offset-2 decoration-[var(--color-border-strong)] text-[var(--color-text)] hover:decoration-[var(--color-text)] transition-colors"
              >
                {t.hostBody.cta}
              </Link>
              {t.hostBody.tail}
            </Text>
          </div>
        </Container>
      </section>
    </>
  );
}
