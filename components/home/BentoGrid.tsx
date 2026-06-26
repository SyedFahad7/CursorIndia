import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * Bento photo grid for the hero. Expects hero1–hero6 in /public/images/hero/
 * (jpg/png/webp). Mobile: 2-column stack; desktop: 4×3 grid with placement
 * for up to six tiles; extra images get simple single cells.
 */

const tileLayouts = [
  { cls: "md:col-span-2 md:row-span-2", aspect: "aspect-square md:aspect-auto" },
  { cls: "md:col-span-2 md:row-span-1", aspect: "aspect-[4/3] md:aspect-auto" },
  { cls: "md:col-span-1 md:row-span-1", aspect: "aspect-square" },
  { cls: "md:col-span-1 md:row-span-2", aspect: "aspect-square md:aspect-auto" },
  { cls: "md:col-span-2 md:row-span-1", aspect: "aspect-[4/3] md:aspect-auto" },
  { cls: "hidden md:block md:col-span-1 md:row-span-1", aspect: "md:aspect-square" },
] as const;

const fallbackLayout = {
  cls: "md:col-span-1 md:row-span-1",
  aspect: "aspect-square",
} as const;

interface HeroPhoto {
  src: string;
  alt: string;
}

interface BentoGridProps {
  photos: HeroPhoto[];
  className?: string;
}

export function BentoGrid({ photos, className }: BentoGridProps) {
  const slotCount = photos.length > 0 ? photos.length : tileLayouts.length;

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-2 md:grid-cols-4 md:auto-rows-[7rem] lg:auto-rows-[8rem] xl:auto-rows-[9rem]",
        className,
      )}
    >
      {Array.from({ length: slotCount }, (_, idx) => {
        const base = tileLayouts[idx] ?? fallbackLayout;
        const photo = photos[idx];
        const layout =
          idx === 5 && photo
            ? { cls: "md:col-span-1 md:row-span-1", aspect: "aspect-square" as const }
            : base;
        return (
          <div
            key={photo?.src ?? `placeholder-${idx}`}
            className={cn(
              "relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-elevated)]",
              layout.cls,
              layout.aspect,
            )}
          >
            {photo ? (
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 768px) 25vw, 50vw"
                className="object-cover"
                priority={idx === 0}
              />
            ) : (
              <Placeholder slot={idx + 1} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function Placeholder({ slot }: { slot: number }) {
  return (
    <div
      aria-hidden
      className="absolute inset-0 grid place-items-center bg-[radial-gradient(at_30%_20%,var(--color-accent-soft)_0%,transparent_50%),radial-gradient(at_80%_80%,rgba(255,255,255,0.05)_0%,transparent_60%)]"
    >
      <span className="font-mono text-xs text-[var(--color-subtle)]">
        /images/hero/hero{slot}.jpg
      </span>
    </div>
  );
}
