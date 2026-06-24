import Image from "next/image";

import { getDict } from "@/lib/i18n/server";
import { getCarouselSlides, type CarouselSlide } from "@/lib/photos";

/** Minimum slides in one half of the duplicated track so the loop stays seamless. */
const MIN_TRACK_ITEMS = 10;

function buildInfiniteTrack(slides: CarouselSlide[]): CarouselSlide[] {
  let base = [...slides];
  while (base.length < MIN_TRACK_ITEMS) {
    base = [...base, ...slides];
  }
  return [...base, ...base];
}

/** Infinite photo strip on the homepage (below FAQ). */
export async function PhotoCarousel() {
  const dict = await getDict();
  const slides = buildInfiniteTrack(getCarouselSlides());

  return (
    <section aria-label={dict.photoCarousel.sectionAria} className="py-10 md:py-16">
      <div className="photo-carousel">
        <ul className="photo-carousel-track" aria-hidden="true">
          {slides.map((slide, i) => (
            <li key={`${slide.key}-${i}`} className="photo-carousel-slide">
              <figure className="photo-carousel-card">
                <div className="photo-carousel-media relative">
                  {slide.src ? (
                    <Image
                      src={slide.src}
                      alt={slide.alt}
                      width={800}
                      height={600}
                      className="h-full w-full object-cover"
                      sizes="(min-width: 768px) 380px, 300px"
                      draggable={false}
                    />
                  ) : (
                    <CarouselPlaceholder label={slide.placeholderLabel} />
                  )}
                </div>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function CarouselPlaceholder({ label }: { label: string }) {
  return (
    <div
      aria-hidden
      className="absolute inset-0 grid place-items-center bg-[radial-gradient(at_30%_20%,var(--color-accent-soft)_0%,transparent_50%),radial-gradient(at_80%_80%,rgba(255,255,255,0.05)_0%,transparent_60%)]"
    >
      <span className="px-4 text-center font-mono text-xs text-[var(--color-subtle)]">
        {label}
      </span>
    </div>
  );
}
