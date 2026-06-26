import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Card } from "@/components/ui/Card";
import { AmbassadorCard } from "@/components/ambassadors/AmbassadorCard";
import { getAllAmbassadorsMerged } from "@/lib/admin-settings";
import { getDict } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDict();
  return {
    title: dict.pages.ambassadors.title,
    description: dict.pages.ambassadors.metaDesc,
  };
}

export default async function AmbassadorsIndexPage() {
  const dict = await getDict();
  const t = dict.pages.ambassadors;
  const sorted = [...(await getAllAmbassadorsMerged())].sort((a, b) =>
    a.name.localeCompare(b.name),
  );

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

      <section className="pb-16 md:pb-20">
        <Container width="wide" className="flex flex-col gap-10 md:gap-12">
          {sorted.length === 0 ? (
            <Card className="p-8 text-center">
              <Text variant="muted">{t.empty}</Text>
            </Card>
          ) : (
            <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 [&>*]:min-h-0">
              {sorted.map((a) => (
                <AmbassadorCard key={a.handle} ambassador={a} />
              ))}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Heading level={2} size="md" className="leading-tight">
              {t.cta.heading}
            </Heading>
            <Text variant="muted" className="max-w-2xl">
              {t.cta.body}
            </Text>
            <a
              href="https://cursor.com/ambassadors"
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-1 inline-flex w-fit items-center gap-1 font-medium text-[var(--color-text)] hover:underline underline-offset-4"
            >
              {t.cta.link}
              <ArrowUpRight
                aria-hidden
                className="h-4 w-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}
