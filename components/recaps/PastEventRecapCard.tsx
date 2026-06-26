import Image from "next/image";
import Link from "next/link";
import { Calendar } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { formatLongDate } from "@/lib/utils";
import type { CursorIndiaEvent, EventRecap } from "@/lib/types";

interface PastEventRecapCardProps {
  event: CursorIndiaEvent;
  recap: EventRecap;
  viewRecapLabel?: string;
}

const PREVIEW_COUNT = 4;

export function PastEventRecapCard({
  event,
  recap,
  viewRecapLabel = "View recap",
}: PastEventRecapCardProps) {
  const preview = recap.photos.slice(0, PREVIEW_COUNT);
  const extra = recap.photos.length - preview.length;

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-4 p-5 md:p-6">
        <div>
          <Heading level={3} size="sm" className="leading-snug">
            {event.title}
          </Heading>
          <span className="mt-1 inline-flex items-center gap-1.5 text-xs text-[var(--color-muted)]">
            <Calendar className="h-3.5 w-3.5" aria-hidden />
            {formatLongDate(event.date)}
          </span>
        </div>

        {preview.length > 0 ? (
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
            {preview.map((photo, i) => (
              <div
                key={`${photo.src}-${i}`}
                className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-sm)] bg-[var(--color-elevated)]"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-cover"
                />
                {i === preview.length - 1 && extra > 0 ? (
                  <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-sm font-medium text-white">
                    +{extra} more
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        ) : recap.summary ? (
          <Text variant="muted" className="line-clamp-3 text-sm">
            {recap.summary}
          </Text>
        ) : null}

        <Link
          href={`/recaps/${event.slug}`}
          className="inline-flex w-fit items-center gap-1 text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-coral)] hover:underline underline-offset-4"
        >
          {viewRecapLabel} →
        </Link>
      </div>
    </Card>
  );
}
