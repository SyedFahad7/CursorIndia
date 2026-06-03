"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

type Tag = "p" | "h1" | "h2" | "h3" | "h4" | "span" | "div";

interface ProgressTextProps {
  /** Plain string. The component splits on whitespace and wraps each word in a
   *  span so visual lines can activate independently. Don't pass nested JSX. */
  children: string;
  as?: Tag;
  className?: string;
  id?: string;
  /** Fraction of viewport height where activation happens. 0 = top of screen,
   *  1 = bottom. Default 0.6 places the line at 60% from the top, which feels
   *  natural for reading: a word that has scrolled into the upper two thirds
   *  of the viewport is "read". */
  threshold?: number;
}

/**
 * Per-word scroll-progress text reveal.
 *
 * Each word starts in a dim state (subtle color + 60% opacity) and transitions
 * to the body text color as its top edge crosses the activation line. Because
 * every word on the same visual line shares the same `top`, activation happens
 * line-by-line for free — no per-line measurement needed. Reverses on scroll
 * up; persistent above the line so already-read text stays bright.
 *
 * Implementation notes:
 *   - One rAF-throttled scroll listener per instance, not per word.
 *   - Per-word state lives on a `data-active` DOM attribute, not React state,
 *     so we never re-render during scroll. Tailwind's `data-[active=true]:`
 *     variant handles the styling swap.
 *   - Honors prefers-reduced-motion: snaps all words to active and skips the
 *     CSS transition entirely.
 */
export function ProgressText({
  children,
  className,
  as: Tag = "p",
  id,
  threshold = 0.6,
}: ProgressTextProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const words = Array.from(
      root.querySelectorAll<HTMLSpanElement>("span[data-pw]"),
    );
    if (words.length === 0) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      for (const el of words) el.dataset.active = "true";
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const trigger = window.innerHeight * threshold;
      for (const el of words) {
        const top = el.getBoundingClientRect().top;
        const next = top < trigger ? "true" : "false";
        if (el.dataset.active !== next) el.dataset.active = next;
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [children, threshold]);

  // Preserve internal whitespace so wrapping behaves like normal text flow,
  // but trim the edges so multi-line JSX (with leading/trailing newlines and
  // indentation) doesn't leak phantom space at the start/end of the block.
  const tokens = children.trim().split(/(\s+)/);

  // Tag is dynamic; cast for ref typing.
  const TagName = Tag as React.ElementType;

  return (
    <TagName
      ref={ref as React.Ref<HTMLElement>}
      id={id}
      className={cn("text-[var(--color-subtle)]", className)}
    >
      {tokens.map((t, i) =>
        /\s/.test(t) || t === "" ? (
          t
        ) : (
          <span
            key={i}
            data-pw=""
            data-active="false"
            className="opacity-60 transition-[color,opacity] duration-300 ease-out motion-reduce:transition-none data-[active=true]:opacity-100 data-[active=true]:text-[var(--color-text)]"
          >
            {t}
          </span>
        ),
      )}
    </TagName>
  );
}
