import { cn } from "@/lib/utils";

type Variant = "surface" | "elevated" | "outline";

const variantClass: Record<Variant, string> = {
  surface:
    "bg-[var(--color-surface)] border border-[var(--color-border)]",
  elevated:
    "bg-[var(--color-elevated)] border border-[var(--color-border)]",
  outline:
    "bg-transparent border border-[var(--color-border)]",
};

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
  /** Adds a subtle hover lift used on link cards. */
  interactive?: boolean;
}

export function Card({
  variant = "surface",
  interactive = false,
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] overflow-hidden",
        variantClass[variant],
        interactive &&
          "transition-[transform,border-color,background] duration-150 ease-out hover:-translate-y-0.5 hover:border-[var(--color-border-strong)] hover:bg-[var(--color-elevated)]",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
