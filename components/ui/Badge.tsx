import { cn } from "@/lib/utils";

type Variant = "default" | "accent" | "outline" | "success" | "warning" | "danger";

const variantClass: Record<Variant, string> = {
  default:
    "bg-[var(--color-elevated)] text-[var(--color-text)] border border-[var(--color-border)]",
  accent:
    "bg-[var(--color-accent-soft)] text-[var(--color-text)] border border-[var(--color-border-strong)]",
  outline:
    "bg-transparent text-[var(--color-muted)] border border-[var(--color-border)]",
  success:
    "bg-[rgba(34,197,94,0.12)] text-[var(--color-success)] border border-[rgba(34,197,94,0.18)]",
  warning:
    "bg-[rgba(234,179,8,0.12)] text-[var(--color-warning)] border border-[rgba(234,179,8,0.18)]",
  danger:
    "bg-[rgba(239,68,68,0.12)] text-[var(--color-danger)] border border-[rgba(239,68,68,0.18)]",
};

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
}

export function Badge({
  variant = "default",
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium leading-none whitespace-nowrap",
        variantClass[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
