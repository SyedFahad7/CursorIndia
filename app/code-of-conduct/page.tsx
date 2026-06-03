import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Card } from "@/components/ui/Card";
import { siteConfig } from "@/content/site.config";
import { getDict } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDict();
  return {
    title: dict.pages.codeOfConduct.title,
    description: dict.pages.codeOfConduct.metaDesc,
  };
}

export default async function CodeOfConductPage() {
  const dict = await getDict();
  const t = dict.pages.codeOfConduct;

  return (
    <section className="py-12 md:py-20">
      <Container width="narrow" className="flex flex-col gap-6">
        <Heading level={1} size="xl">
          {t.title}
        </Heading>

        <Card className="border-[var(--color-border-strong)] bg-[var(--color-elevated)]/40 p-5 md:p-6">
          <Heading level={2} size="sm" className="!text-base">
            {t.tldrHeading}
          </Heading>
          <Text variant="muted" className="mt-2 text-sm leading-relaxed">
            {t.tldrBody}{" "}
            <a
              href={`mailto:${siteConfig.email}`}
              className="underline underline-offset-2 decoration-[var(--color-border-strong)] text-[var(--color-text)] hover:decoration-[var(--color-text)] transition-colors"
            >
              {siteConfig.email}
            </a>
            .
          </Text>
        </Card>

        <div className="flex flex-col gap-8">
          <section className="flex flex-col gap-2">
            <Heading level={2} size="sm">
              {t.introHeading}
            </Heading>
            <Text variant="muted">{t.introBody}</Text>
          </section>

          <section className="flex flex-col gap-3">
            <Heading level={2} size="sm">
              {t.expectedHeading}
            </Heading>
            <ul className="flex flex-col gap-3 text-[var(--color-muted)]">
              {t.expectedItems.map((item) => (
                <li key={item.title} className="flex gap-3">
                  <span
                    aria-hidden
                    className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-[var(--color-accent)]"
                  />
                  <span>
                    <strong className="text-[var(--color-text)]">
                      {item.title}
                    </strong>{" "}
                    {item.body}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="flex flex-col gap-2">
            <Heading level={2} size="sm">
              {t.notHeading}
            </Heading>
            <ul className="list-disc space-y-1.5 pl-5 text-[var(--color-muted)]">
              {t.notItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="flex flex-col gap-2">
            <Heading level={2} size="sm">
              {t.reportingHeading}
            </Heading>
            <Text variant="muted">{t.reportingIntro}</Text>
            <ul className="list-disc space-y-1.5 pl-5 text-[var(--color-muted)]">
              {t.reportingItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <Text variant="muted">{t.reportingNote}</Text>
          </section>

          <section className="flex flex-col gap-2">
            <Heading level={2} size="sm">
              {t.consequencesHeading}
            </Heading>
            <Text variant="muted">{t.consequencesBody}</Text>
          </section>

          <section className="flex flex-col gap-2">
            <Heading level={2} size="sm">
              {t.ackHeading}
            </Heading>
            <Text variant="muted">{t.ackBody}</Text>
          </section>

          <section className="flex flex-col gap-2">
            <Heading level={2} size="sm">
              {t.contactHeading}
            </Heading>
            <Text variant="muted">
              {t.contactBody.prefix}{" "}
              <a
                href={`mailto:${siteConfig.email}`}
                className="underline underline-offset-2 decoration-[var(--color-border-strong)] text-[var(--color-text)] hover:decoration-[var(--color-text)] transition-colors"
              >
                {siteConfig.email}
              </a>
              {t.contactBody.suffix}
            </Text>
          </section>
        </div>

        <div className="mt-2 text-sm text-[var(--color-subtle)]">
          <Link href="/about" className="hover:text-[var(--color-text)]">
            {t.backToAbout}
          </Link>
        </div>
      </Container>
    </section>
  );
}
