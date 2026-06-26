import Image from "next/image";

import type { EventPhoto } from "@/lib/types";

interface RecapPhotoGridProps {
  photos: EventPhoto[];
  photoCredit?: string;
}

export function RecapPhotoGrid({ photos, photoCredit }: RecapPhotoGridProps) {
  if (photos.length === 0) return null;

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold text-[var(--color-text)]">Photos</h2>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          {photos.length} photo{photos.length === 1 ? "" : "s"} from the event
        </p>
        {photoCredit ? (
          <p className="mt-1 text-xs text-[var(--color-muted)]">
            Photo credits: {photoCredit}
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:gap-3">
        {photos.map((photo, i) => (
          <div
            key={`${photo.src}-${i}`}
            className="relative aspect-square overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-elevated)]"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(min-width: 768px) 33vw, 50vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
