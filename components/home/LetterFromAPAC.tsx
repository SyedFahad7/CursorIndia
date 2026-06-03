import Image from "next/image";

import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { ThemedLogo } from "@/components/ui/ThemedLogo";
import { getDict } from "@/lib/i18n/server";

// The closing section of the home page. A short, hand-written welcome from the
// APAC region lead. Kept deliberately plain: no marketing copy, no rhyming, no
// dashes. The signature is an inline SVG that falls back to a system cursive
// font so it works without shipping a font file. Swap in a real handwritten
// signature later by replacing <SignatureMark /> with a regular <Image />.

export async function LetterFromAPAC() {
  const dict = await getDict();
  const t = dict.letter;

  return (
    <section aria-labelledby="letter-heading" className="py-10 md:py-4">
      <Container width="narrow">
        <article className="relative rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 md:p-12 lg:p-16">
          {/* CUBE: top-right inside the card. */}
          <ThemedLogo
            dark="/images/logos/CUBE_2D_DARK.png"
            light="/images/logos/CUBE_2D_LIGHT.png"
            alt=""
            width={1401}
            height={1597}
            className="absolute right-8 top-8 h-14 w-auto md:right-12 md:top-12 md:h-16 lg:right-16 lg:top-16 lg:h-[4.25rem]"
            sizes="68px"
          />

          <Heading
            level={2}
            id="letter-heading"
            size="lg"
            className="pr-16 md:pr-20"
          >
            {t.heading}
          </Heading>

          <div className="mt-6 flex flex-col gap-5 md:text-[17px] md:leading-[1.7]">
            {t.paragraphs.map((p, i) => (
              <Text key={i}>{p}</Text>
            ))}
          </div>

          <div className="mt-10">
            <SignatureMark />
          </div>

          <div className="mt-6 flex items-center gap-3">
            <Image
              src="/images/avatars/hooman4.png"
              alt="Mohammed Sanjeed"
              width={88}
              height={88}
              className="h-11 w-11 rounded-full object-cover border border-[var(--color-border)]"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold text-[var(--color-text)]">
                Mohammed Sanjeed
              </span>
              <span className="text-xs text-[var(--color-muted)]">
                {t.role}
              </span>
            </div>
          </div>
        </article>
      </Container>
    </section>
  );
}

/**
 * Placeholder signature mark. Renders a stylized "Sanjeed" using a system
 * cursive font so it doesn't require shipping a webfont or a PNG.
 *
 * To replace with a real scanned signature, drop a transparent PNG at
 * /public/images/signatures/mohammed-sanjeed.png and swap this for:
 *   <Image src="/images/signatures/mohammed-sanjeed.png" alt="" width={240} height={60} className="h-14 w-auto" />
 */
function SignatureMark() {
  return (
    <svg
      viewBox="0 0 240 64"
      className="h-14 w-auto text-[var(--color-text)]"
      aria-hidden
      focusable="false"
    >
      <text
        x="0"
        y="46"
        fill="currentColor"
        style={{
          fontFamily:
            "'Snell Roundhand', 'Apple Chancery', 'Lucida Handwriting', 'Brush Script MT', cursive",
          fontSize: "42px",
          fontStyle: "italic",
        }}
      >
        Sanjeed
      </text>
    </svg>
  );
}
