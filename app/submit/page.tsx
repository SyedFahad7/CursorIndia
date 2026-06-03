import type { Metadata } from "next";

import { ContactForm } from "@/components/contact/ContactForm";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Card } from "@/components/ui/Card";
import { getDict } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDict();
  return {
    title: dict.pages.submit.title,
    description: dict.pages.submit.metaDesc,
  };
}

export default async function SubmitPage() {
  const dict = await getDict();
  const t = dict.pages.submit;

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
        <Container width="narrow">
          <Card className="p-6 md:p-8">
            <ContactForm />
          </Card>
        </Container>
      </section>
    </>
  );
}
