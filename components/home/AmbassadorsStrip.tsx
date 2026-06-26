import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AmbassadorCard } from "@/components/ambassadors/AmbassadorCard";
import { getAllAmbassadorsMerged } from "@/lib/admin-settings";
import { getDict } from "@/lib/i18n/server";

export async function AmbassadorsStrip() {
  const dict = await getDict();
  const t = dict.ambassadorsStrip;

  const featured = [...(await getAllAmbassadorsMerged())]
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, 8);

  return (
    <section className="py-12 md:py-16">
      <Container width="wide">
        <SectionHeader
          eyebrow={t.eyebrow}
          title={t.title}
          cta={{ label: t.cta, href: "/ambassadors" }}
        />

        <div className="mt-8 grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 [&>*]:min-h-0">
          {featured.map((a) => (
            <AmbassadorCard key={a.handle} ambassador={a} />
          ))}
        </div>
      </Container>
    </section>
  );
}
