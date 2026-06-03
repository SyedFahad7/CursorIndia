import { cn } from "@/lib/utils";

type Variant = "default" | "muted" | "subtle" | "lead";

const variantClass: Record<Variant, string> = {
  default: "text-[var(--color-text)]",
  muted: "text-[var(--color-muted)]",
  subtle: "text-[var(--color-subtle)]",
  lead: "text-[var(--color-muted)] text-base md:text-lg leading-relaxed",
};

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: Variant;
  as?: "p" | "span" | "div";
}

export function Text({
  variant = "default",
  as: Tag = "p",
  className,
  children,
  ...rest
}: TextProps) {
  return (
    <Tag
      className={cn("leading-relaxed", variantClass[variant], className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}
