import { cn } from "@/lib/utils";

type Level = 1 | 2 | 3 | 4 | 5;
type Size = "display" | "xl" | "lg" | "md" | "sm";

const sizeClass: Record<Size, string> = {
  display:
    "text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold tracking-tight",
  xl: "text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight",
  lg: "text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight",
  md: "text-xl md:text-2xl font-semibold",
  sm: "text-lg md:text-xl font-semibold",
};

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: Level;
  size?: Size;
}

export function Heading({
  level = 2,
  size = "lg",
  className,
  children,
  ...rest
}: HeadingProps) {
  const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5";
  return (
    <Tag
      className={cn(
        "text-[var(--color-text)] [text-wrap:balance]",
        sizeClass[size],
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function Eyebrow({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]",
        className,
      )}
      {...rest}
    >
      {children}
    </p>
  );
}
