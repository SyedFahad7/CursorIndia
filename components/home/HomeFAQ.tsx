import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import type { Dict } from "@/lib/i18n/dictionaries";
import { getDict } from "@/lib/i18n/server";

const faqLinkClass =
  "text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)] no-underline";

type FaqPart = Dict["faq"]["items"][number]["parts"][number];

function FaqAnswer({ parts }: { parts: readonly FaqPart[] }) {
  return (
    <Text variant="muted" className="mt-3">
      {parts.map((part, i) => {
        if (part.type === "text") {
          return <span key={i}>{part.value}</span>;
        }
        if (part.external) {
          return (
            <a
              key={i}
              href={part.href}
              target="_blank"
              rel="noopener noreferrer"
              className={faqLinkClass}
            >
              {part.label}
            </a>
          );
        }
        return (
          <Link key={i} href={part.href} className={faqLinkClass}>
            {part.label}
          </Link>
        );
      })}
    </Text>
  );
}

export async function HomeFAQ() {
  const dict = await getDict();
  const t = dict.faq;

  return (
    <section aria-labelledby="faq-heading" className="py-12 md:py-20">
      <Container width="narrow">
        <Heading level={2} id="faq-heading" size="md">
          {t.heading}
        </Heading>
        <div className="mt-10 flex flex-col gap-10">
          {t.items.map((item) => (
            <article key={item.question}>
              <Heading level={3} size="sm" className="!text-base md:!text-lg">
                {item.question}
              </Heading>
              <FaqAnswer parts={item.parts} />
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
