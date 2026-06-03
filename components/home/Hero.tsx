import { ArrowRight } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { Eyebrow, Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { getDict } from "@/lib/i18n/server";
import { BentoGrid } from "./BentoGrid";

export async function Hero() {
  const dict = await getDict();
  const t = dict.hero;

  return (
    <section className="relative overflow-hidden py-12 md:py-20 lg:py-24">
      {/* Soft accent glow — purely decorative */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_-10%,var(--color-accent-soft)_0%,transparent_60%)]"
      />
      <Container
        width="wide"
        className="relative 2xl:max-w-[min(100rem,calc(100%-4rem))] 2xl:px-6"
      >
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12 2xl:gap-16">
          <div className="flex flex-col gap-6 lg:col-span-6 xl:col-span-5 2xl:col-span-5">
            <Eyebrow>{t.eyebrow}</Eyebrow>
            <Heading level={1} size="display" className="!leading-[1.05]">
              {t.title}
            </Heading>
            <Text variant="lead" className="max-w-xl 2xl:max-w-2xl">
              {t.lead}
            </Text>
            <div className="flex flex-wrap items-center gap-3">
              <Button href="/events" size="lg">
                {t.primaryCta}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
              <Button href="/cities" variant="secondary" size="lg">
                {t.secondaryCta}
              </Button>
            </div>
          </div>
          <div className="lg:col-span-6 xl:col-span-7 2xl:col-span-7">
            <BentoGrid className="2xl:auto-rows-[10rem]" />
          </div>
        </div>
      </Container>
    </section>
  );
}
