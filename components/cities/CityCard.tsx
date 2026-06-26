import Link from "next/link";
import { CircleArrowRight as ArrowCircleRight } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { getAmbassadorName } from "@/content/ambassadors";
import { getAmbassadorsForCity } from "@/lib/admin-settings";
import { getServerLocale } from "@/lib/i18n/server";
import { localizedName } from "@/lib/i18n/names";
import type { City } from "@/lib/types";

interface CityCardProps {
  city: City;
}

export async function CityCard({ city }: CityCardProps) {
  const locale = await getServerLocale();
  const ambassador = (await getAmbassadorsForCity(city.slug))[0];

  return (
    <Card className="h-full">
      <Link
        href={`/cities/${city.slug}`}
        className="group relative flex h-full min-h-[104px] flex-col justify-center gap-1.5 p-5 pr-16 md:p-6 md:pr-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] rounded-[var(--radius-lg)]"
      >
        <Heading level={3} size="md" className="leading-tight">
          {localizedName(city, locale)}
        </Heading>
        {ambassador ? (
          <span className="text-sm text-[var(--color-muted)]">
            {getAmbassadorName(ambassador, locale)}
          </span>
        ) : null}
        <ArrowCircleRight
          aria-hidden
          strokeWidth={0.5}
          className="pointer-events-none absolute right-3 top-1/2 h-14 w-14 -translate-y-1/2 -rotate-45 text-[var(--color-muted)] transition-transform duration-200 ease-out group-hover:rotate-0 md:right-4 md:h-16 md:w-16"
        />
      </Link>
    </Card>
  );
}
