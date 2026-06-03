import Image from "next/image";

import { getAllEventPhotos } from "@/lib/photos";

/**
 * Pure-CSS infinite marquee of event photos. Reads everything under
 * /public/images/events/<slug>/ (excluding hero.*) and seamlessly scrolls
 * them. Renders nothing while the events folder is empty, so it will quietly
 * appear once ambassadors drop photos in. No colored tile backgrounds; cards
 * inherit the dark surface from the page.
 *
 * Pauses on hover and respects prefers-reduced-motion.
 */
export function PhotoMarquee() {
  const photos = getAllEventPhotos();
  if (photos.length === 0) return null;

  // The track is duplicated so translateX(-50%) loops seamlessly. For very
  // small photo sets we triplicate first so the track is wide enough that
  // the loop point is offscreen on common viewports.
  const base = photos.length < 6 ? [...photos, ...photos, ...photos] : photos;
  const items = [...base, ...base];

  return (
    <section
      aria-label="Photos from Cursor India events"
      className="py-12 md:py-16"
    >
      <div className="marquee">
        <ul className="marquee-track" aria-hidden="true">
          {items.map((p, i) => (
            <li
              key={`${p.src}-${i}`}
              className="marquee-item bg-[var(--color-surface)]"
            >
              <Image
                src={p.src}
                alt=""
                width={640}
                height={400}
                className="h-full w-full object-cover"
                sizes="320px"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
