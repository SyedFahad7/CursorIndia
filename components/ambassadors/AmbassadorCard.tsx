import Link from "next/link";
import { Linkedin, Mail } from "lucide-react";

import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { getCityName } from "@/content/cities";
import { getDict, getServerLocale } from "@/lib/i18n/server";
import { localizedName } from "@/lib/i18n/names";
import type { Ambassador } from "@/lib/types";

import { XIcon } from "./XIcon";

interface AmbassadorCardProps {
  ambassador: Ambassador;
}

type SocialKey = "x" | "linkedin" | "email";

interface SocialSlot {
  key: SocialKey;
  href: string | undefined;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}

/**
 * Card for an ambassador on the /ambassadors index. There is no detail page;
 * avatar and name are plain text, city links to the city page.
 *
 * Equal card heights come from the grid (`items-stretch`) + this column flex.
 * The name/role/city block stays tight together at the top; the icon row is
 * pinned to the bottom via `mt-auto`, so any extra height in a row lands as
 * slack above the icons rather than as a gap inside the text block. Long names
 * clamp to two lines with a hover tooltip for the full value.
 */
export async function AmbassadorCard({ ambassador }: AmbassadorCardProps) {
  const [dict, locale] = await Promise.all([getDict(), getServerLocale()]);
  const cityName = getCityName(ambassador.city, locale);
  const displayName = localizedName(ambassador, locale);
  const slots = buildSocialSlots(ambassador, displayName);

  return (
    <Card
      id={ambassador.handle}
      className="flex h-full flex-col scroll-mt-24 p-5 md:p-6"
    >
      <div className="flex items-start gap-4">
        <Avatar src={ambassador.photo} alt={displayName} size="md" className="shrink-0" />
        <div className="min-w-0 flex-1">
          <p
            className="line-clamp-2 text-base font-semibold leading-snug text-[var(--color-text)]"
            title={displayName}
          >
            {displayName}
          </p>
          <p className="mt-0.5 text-sm text-[var(--color-muted)]">{dict.common.cursorAmbassador}</p>
          <Link
            href={`/cities/${ambassador.city}`}
            title={cityName}
            className="mt-0.5 block truncate text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
          >
            {cityName}
          </Link>
        </div>
      </div>

      <div className="mt-auto flex shrink-0 flex-wrap items-center gap-4 pt-4">
        {slots.map(({ key, href, label, Icon }) =>
          href ? (
            <a
              key={key}
              href={href}
              target={key === "email" ? undefined : "_blank"}
              rel={key === "email" ? undefined : "noopener noreferrer"}
              aria-label={label}
              title={label}
              className="text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors focus-visible:outline-none focus-visible:text-[var(--color-text)]"
            >
              <Icon className="h-4 w-4" />
            </a>
          ) : (
            <span
              key={key}
              aria-hidden
              className="text-[var(--color-muted)] opacity-50"
            >
              <Icon className="h-4 w-4" />
            </span>
          ),
        )}
      </div>
    </Card>
  );
}

function buildSocialSlots(a: Ambassador, displayName: string): SocialSlot[] {
  return [
    {
      key: "x",
      href: a.links.x,
      label: `${displayName} on X`,
      Icon: XIcon,
    },
    {
      key: "linkedin",
      href: a.links.linkedin,
      label: `${displayName} on LinkedIn`,
      Icon: Linkedin,
    },
    {
      key: "email",
      href: a.links.email ? `mailto:${a.links.email}` : undefined,
      label: `Email ${displayName}`,
      Icon: Mail,
    },
  ];
}
