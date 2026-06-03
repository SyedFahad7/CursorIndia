import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CityCard } from "@/components/cities/CityCard";
import { cities } from "@/content/cities";
import { getDict } from "@/lib/i18n/server";

const HOME_CITY_LIMIT = 4;

export async function CitiesGrid() {
  const dict = await getDict();
  const t = dict.citiesGrid;
  const featured = cities.slice(0, HOME_CITY_LIMIT);

  return (
    <section className="py-12 md:py-16">
      <Container width="wide">
        <SectionHeader
          eyebrow={t.eyebrow}
          title={t.title}
          subhead=""
          cta={{ label: t.cta, href: "/cities" }}
        />

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((city) => (
            <CityCard key={city.slug} city={city} />
          ))}
        </div>
      </Container>
    </section>
  );
}
