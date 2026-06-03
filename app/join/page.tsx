import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/content/site.config";
import { getDict } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDict();
  return {
    title: dict.pages.join.title,
    description: dict.pages.join.metaDesc,
  };
}

export default async function JoinPage() {
  const dict = await getDict();
  const t = dict.pages.join;

  const hrefs = [
    { href: "/events", external: false },
    { href: siteConfig.community.whatsapp ?? "#", external: true },
    { href: "/submit", external: false },
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

      <section className="pb-16">
        <Container width="narrow" className="flex flex-col gap-4">
          {t.steps.map((s, i) => {
            const link = hrefs[i] ?? { href: "#", external: false };
            return (
              <Card key={s.n} className="p-6 md:p-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
                  <span className="w-8 shrink-0 text-xs font-mono font-semibold tracking-widest text-[var(--color-muted)]">
                    {s.n}
                  </span>
                  <div className="min-w-0 flex-1 flex flex-col gap-2">
                    <Heading level={2} size="sm">
                      {s.title}
                    </Heading>
                    <Text variant="muted">{s.body}</Text>
                  </div>
                  <div className="shrink-0 md:self-center">
                    <Button
                      href={link.href}
                      external={link.external}
                      variant="secondary"
                      size="md"
                    >
                      {s.ctaLabel}
                      <ArrowUpRight className="h-4 w-4" aria-hidden />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </Container>
      </section>
    </>
  );
}
