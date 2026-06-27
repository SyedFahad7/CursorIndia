import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

type Width = "narrow" | "default" | "wide";

interface SectionBreakProps {
  width?: Width;
  className?: string;
  /** Faint coral tint at the center — use sparingly between hero sections. */
  accent?: boolean;
}

/** Soft fade-out rule between page sections — container-width, not full bleed. */
export function SectionBreak({ width = "wide", className, accent = false }: SectionBreakProps) {
  return (
    <div
      role="separator"
      aria-hidden
      className={cn("py-8 md:py-12", className)}
    >
      <Container width={width}>
        <hr className={cn("section-break", accent && "section-break-accent")} />
      </Container>
    </div>
  );
}
