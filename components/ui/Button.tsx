import Link from "next/link";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "link";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-1.5 rounded-[var(--radius-md)] font-medium transition-[background,border-color,color,transform] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] disabled:opacity-50 disabled:pointer-events-none";

const variantClass: Record<Variant, string> = {
  primary:
    "bg-[var(--color-accent)] text-[var(--color-bg)] hover:bg-[var(--color-accent-hover)] active:translate-y-px",
  secondary:
    "border border-[var(--color-border-strong)] bg-transparent text-[var(--color-text)] hover:bg-[var(--color-elevated)] hover:border-[var(--color-border-strong)]",
  ghost:
    "bg-transparent text-[var(--color-text)] hover:bg-[var(--color-elevated)]",
  link:
    "text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] underline-offset-4 hover:underline px-0 py-0",
};

const sizeClass: Record<Size, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm md:text-[15px]",
  lg: "h-11 px-5 text-base",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}

type ButtonAsButton = CommonProps &
  Omit<ComponentProps<"button">, keyof CommonProps> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps &
  Omit<ComponentProps<typeof Link>, keyof CommonProps> & {
    href: string;
    external?: boolean;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", className } = props;

  const cls = cn(
    base,
    variantClass[variant],
    variant !== "link" && sizeClass[size],
    className,
  );

  if ("href" in props && props.href) {
    const { href, external, children, variant: _v, size: _s, className: _c, ...rest } = props;
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={cls}
          {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} {...rest}>
        {children}
      </Link>
    );
  }

  const { children, variant: _v, size: _s, className: _c, ...rest } = props as ButtonAsButton;
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
