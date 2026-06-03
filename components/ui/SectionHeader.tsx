import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Eyebrow, Heading } from "./Heading";
import { Text } from "./Text";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subhead?: string;
  /** Optional "see all" link rendered on the right on desktop, below on mobile. */
  cta?: { label: string; href: string };
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  subhead,
  cta,
  align = "left",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 md:flex-row md:items-end md:justify-between",
        align === "center" && "md:flex-col md:items-center md:text-center",
        className,
      )}
    >
      <div className={cn("flex flex-col gap-2", align === "center" && "items-center")}>
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <Heading level={2} size="lg">
          {title}
        </Heading>
        {subhead ? (
          <Text variant="muted" className="max-w-2xl">
            {subhead}
          </Text>
        ) : null}
      </div>
      {cta ? (
        <Link
          href={cta.href}
          className="group inline-flex items-center gap-1 text-sm font-medium text-[var(--color-coral)] transition-[opacity,text-decoration] hover:underline hover:opacity-90 underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] rounded"
        >
          {cta.label}
          <ArrowRight
            className="h-4 w-4 transition-transform duration-200 ease-out group-hover:-rotate-45"
            aria-hidden
          />
        </Link>
      ) : null}
    </div>
  );
}
