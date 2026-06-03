import Image from "next/image";
import { ArrowUpRight, Calendar, MapPin, Users } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { archetypeLabel, formatIST, formatTimeIST } from "@/lib/utils";
import { getCityName } from "@/content/cities";
import { getDict, getServerLocale } from "@/lib/i18n/server";
import type { CursorIndiaEvent } from "@/lib/types";

interface EventCardProps {
  event: CursorIndiaEvent;
  variant?: "compact" | "expanded";
}

export async function EventCard({ event, variant = "compact" }: EventCardProps) {
  const expanded = variant === "expanded";
  const [dict, locale] = await Promise.all([getDict(), getServerLocale()]);
  const cityName = getCityName(event.city, locale);
  // There is no internal event detail page; the only "more" destination is the
  // event's Luma page. When that's missing the card simply isn't clickable.
  const href = event.lumaUrl;

  const inner = (
    <>
      <div className="flex items-center justify-between gap-2">
        <Badge variant="accent">{archetypeLabel(event.archetype)}</Badge>
        <span className="inline-flex items-center gap-1 text-xs font-medium tabular-nums text-[var(--color-muted)]">
          <Calendar className="h-3.5 w-3.5" aria-hidden />
          {formatIST(event.date)} · {formatTimeIST(event.date)}
        </span>
      </div>

      <Heading level={3} size="sm" className="leading-snug">
        {event.title}
      </Heading>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs leading-none text-[var(--color-muted)]">
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <span>{cityName}</span>
        </span>
        {typeof event.capacity === "number" ? (
          <span className="inline-flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 shrink-0" aria-hidden />
            <span>{event.attendees ?? 0} / {event.capacity} {dict.common.going}</span>
          </span>
        ) : null}
      </div>

      {expanded ? (
        <Text variant="muted" className="text-sm line-clamp-3">
          {event.description}
        </Text>
      ) : null}

      {href ? (
        <div className="mt-auto inline-flex items-center gap-1 pt-3 text-sm font-medium text-[var(--color-muted)]">
          {dict.common.details}
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </div>
      ) : null}
    </>
  );

  return (
    <Card className="flex h-full flex-col">
      {event.heroImage && expanded ? (
        <div className="relative aspect-[16/9] w-full bg-[var(--color-elevated)]">
          <Image
            src={event.heroImage}
            alt={event.title}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      ) : null}

      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-full flex-col gap-3 p-5 md:p-6 focus-visible:outline-none"
        >
          {inner}
        </a>
      ) : (
        <div className="flex h-full flex-col gap-3 p-5 md:p-6">{inner}</div>
      )}
    </Card>
  );
}
