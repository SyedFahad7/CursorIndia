import Image from "next/image";

import { cn } from "@/lib/utils";

interface ThemedLogoProps {
  /** Path to dark-background artwork (light/white logo). */
  dark: string;
  /** Path to light-background artwork (dark/black logo). */
  light: string;
  /** Accessible label. Pass "" for purely decorative usage. */
  alt: string;
  /** Intrinsic width of the source image. */
  width: number;
  /** Intrinsic height of the source image. */
  height: number;
  /** Tailwind sizing classes etc. Applied to both <img>s. */
  className?: string;
  /** Set on the variant shown by default (dark theme) for fast first paint. */
  priority?: boolean;
  /** Responsive sizes attribute. */
  sizes?: string;
}

/**
 * Renders two <Image>s and lets CSS show exactly one based on `[data-theme]`
 * on <html>. Avoids client JS and avoids the flash you get from a useEffect
 * swap. Both files are downloaded, but logos are tiny so this is fine.
 */
export function ThemedLogo({
  dark,
  light,
  alt,
  width,
  height,
  className,
  priority,
  sizes,
}: ThemedLogoProps) {
  return (
    <>
      <Image
        src={dark}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        sizes={sizes}
        className={cn("logo-on-dark", className)}
      />
      <Image
        src={light}
        alt=""
        aria-hidden
        width={width}
        height={height}
        sizes={sizes}
        className={cn("logo-on-light", className)}
      />
    </>
  );
}
