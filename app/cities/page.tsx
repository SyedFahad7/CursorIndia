import type { Metadata } from "next";

import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { CityCard } from "@/components/cities/CityCard";
import { cities } from "@/content/cities";
import { getDict } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDict();
  return {
    title: dict.pages.cities.title,
    description: dict.pages.cities.metaDesc,
  };
}

export default async function CitiesIndexPage() {
  const dict = await getDict();
  const t = dict.pages.cities;

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
        <Container width="wide">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {cities.map((c) => (
              <CityCard key={c.slug} city={c} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
