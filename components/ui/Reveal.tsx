"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface RevealProps {
  children: React.ReactNode;
  /** Stagger this child behind others in the same group, in milliseconds. */
  delay?: number;
  className?: string;
  /**
   * If true, the reveal also reverses when the element scrolls back out of
   * view (animation plays both on scroll-down and scroll-up). If false, the
   * element stays visible after the first reveal. Defaults to true to match
   * the "scroll up and down" feel of the brief.
   */
  bidirectional?: boolean;
}

/**
 * Fade + lift reveal on scroll. Implemented with IntersectionObserver so
 * there is no scroll listener cost. Respects `prefers-reduced-motion`: if
 * the user has it on, content renders immediately at rest with no transition.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  bidirectional = true,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reducedMotion) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          setVisible(true);
        } else if (bidirectional) {
          setVisible(false);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [bidirectional, reducedMotion]);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
      className={cn(
        "transition-[opacity,transform] duration-[700ms] ease-out will-change-transform motion-reduce:transition-none",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        className,
      )}
    >
      {children}
    </div>
  );
}
