import { ArrowUpRight } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { siteConfig } from "@/content/site.config";
import { getDict } from "@/lib/i18n/server";

export async function GlobalEventsCard() {
  const dict = await getDict();
  const t = dict.globalEvents;
  const lumaUrl =
    siteConfig.community.lumaGlobal ?? "https://lu.ma/cursorcommunity";

  return (
    <section className="pt-10 md:pt-10 pb-12 md:pb-2">
      <Container width="wide">
        <article className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 md:p-10 lg:p-12">
          <Heading level={2} size="md" className="!text-xl md:!text-2xl">
            {t.title}
          </Heading>
          <Text variant="muted" className="max-w-3xl">
            {t.body}
          </Text>
          <a
            href={lumaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-1 inline-flex w-fit items-center gap-1 text-sm font-medium text-[#F47F47] transition-[opacity,text-decoration] hover:underline hover:opacity-90 underline-offset-4"
          >
            {t.cta}
            <ArrowUpRight
              aria-hidden
              className="h-4 w-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </article>
      </Container>
    </section>
  );
}
