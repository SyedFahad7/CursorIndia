import Image from "next/image";
import { existsSync } from "node:fs";
import { join } from "node:path";

import { cn } from "@/lib/utils";

/**
 * Bento photo grid for the hero. Mobile: 2-column stack; desktop: 4×3 grid
 * with deterministic placement.
 *
 * Drop images into /public/images/hero/01.jpg … 06.jpg.
 * If a file is missing, that tile renders as a stylish placeholder so the
 * grid still composes correctly before photos are added.
 */

const tiles = [
  { i: "01", cls: "md:col-span-2 md:row-span-2", aspect: "aspect-square md:aspect-auto" },
  { i: "02", cls: "md:col-span-2 md:row-span-1", aspect: "aspect-[4/3] md:aspect-auto" },
  { i: "03", cls: "md:col-span-1 md:row-span-1", aspect: "aspect-square" },
  { i: "04", cls: "md:col-span-1 md:row-span-2", aspect: "aspect-square md:aspect-auto" },
  { i: "05", cls: "md:col-span-2 md:row-span-1", aspect: "aspect-[4/3] md:aspect-auto" },
  { i: "06", cls: "hidden md:block md:col-span-1 md:row-span-1", aspect: "md:aspect-square" },
] as const;

function resolveSrc(i: string): string | null {
  for (const ext of ["jpg", "jpeg", "png", "webp", "avif"]) {
    const abs = join(process.cwd(), "public", "images", "hero", `${i}.${ext}`);
    if (existsSync(abs)) return `/images/hero/${i}.${ext}`;
  }
  return null;
}

export function BentoGrid() {
  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:auto-rows-[7rem] lg:auto-rows-[8rem] xl:auto-rows-[9rem]">
      {tiles.map((t) => {
        const src = resolveSrc(t.i);
        return (
          <div
            key={t.i}
            className={cn(
              "relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-elevated)]",
              t.cls,
              t.aspect,
            )}
          >
            {src ? (
              <Image
                src={src}
                alt={`Cursor India event photo ${t.i}`}
                fill
                sizes="(min-width: 768px) 25vw, 50vw"
                className="object-cover"
                priority={t.i === "01"}
              />
            ) : (
              <Placeholder index={t.i} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function Placeholder({ index }: { index: string }) {
  return (
    <div
      aria-hidden
      className="absolute inset-0 grid place-items-center bg-[radial-gradient(at_30%_20%,var(--color-accent-soft)_0%,transparent_50%),radial-gradient(at_80%_80%,rgba(255,255,255,0.05)_0%,transparent_60%)]"
    >
      <span className="font-mono text-xs text-[var(--color-subtle)]">
        /images/hero/{index}.jpg
      </span>
    </div>
  );
}
