import Image from "next/image";

import type { EventPhoto } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PhotoGalleryProps {
  photos: EventPhoto[];
  title: string;
  className?: string;
}

/**
 * Bento-style gallery. Server-rendered, no JS.
 * Mobile = 2 cols, desktop = 4 cols. Larger tiles every 5th + 8th photo.
 */
export function PhotoGallery({ photos, title, className }: PhotoGalleryProps) {
  if (photos.length === 0) return null;

  return (
    <section
      aria-label={`${title} — photo gallery`}
      className={cn("", className)}
    >
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {photos.map((p, i) => {
          const big = i % 7 === 0;
          return (
            <div
              key={`${p.src}-${i}`}
              className={cn(
                "relative overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-elevated)]",
                big ? "col-span-2 row-span-2 aspect-square" : "aspect-square",
              )}
            >
              <Image
                src={p.src}
                alt={p.alt}
                fill
                sizes={big ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 50vw"}
                className="object-cover"
                loading={i < 4 ? "eager" : "lazy"}
              />
              {p.credit ? (
                <span className="absolute bottom-1 right-1 rounded bg-black/50 px-1.5 py-0.5 text-[10px] font-medium text-white">
                  📷 {p.credit}
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
