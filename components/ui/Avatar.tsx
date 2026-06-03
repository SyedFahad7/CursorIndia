import Image from "next/image";

import { cn } from "@/lib/utils";

type Size = "sm" | "md" | "lg" | "xl";

const sizePx: Record<Size, number> = {
  sm: 32,
  md: 48,
  lg: 80,
  xl: 120,
};

const sizeClass: Record<Size, string> = {
  sm: "h-8 w-8",
  md: "h-12 w-12",
  lg: "h-20 w-20",
  xl: "h-28 w-28 md:h-32 md:w-32",
};

interface AvatarProps {
  src?: string;
  alt: string;
  size?: Size;
  className?: string;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  return (first + last).toUpperCase();
}

export function Avatar({ src, alt, size = "md", className }: AvatarProps) {
  const px = sizePx[size];

  if (!src) {
    return (
      <div
        className={cn(
          "inline-flex items-center justify-center rounded-full bg-[var(--color-elevated)] border border-[var(--color-border)] text-[var(--color-muted)] font-medium select-none",
          sizeClass[size],
          className,
        )}
        aria-label={alt}
        role="img"
      >
        {initials(alt)}
      </div>
    );
  }

  return (
    <span
      className={cn(
        "relative inline-block overflow-hidden rounded-full border border-[var(--color-border)] bg-[var(--color-elevated)]",
        sizeClass[size],
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        width={px * 2}
        height={px * 2}
        className="h-full w-full object-cover"
      />
    </span>
  );
}
