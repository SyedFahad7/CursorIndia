import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="py-24 md:py-32">
      <Container width="narrow" className="flex flex-col gap-4 items-start">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
          404
        </span>
        <Heading level={1} size="xl">
          That page doesn&apos;t exist.
        </Heading>
        <Text variant="lead" className="max-w-lg">
          Either the link is broken, or this page hasn&apos;t shipped yet.
          Try the homepage, or hit ⌘K to search.
        </Text>
        <div className="mt-2 flex gap-3">
          <Button href="/" size="md">
            Back home
          </Button>
          <Link
            href="/events"
            className="inline-flex h-10 items-center px-4 text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-text)]"
          >
            See events
          </Link>
        </div>
      </Container>
    </section>
  );
}
