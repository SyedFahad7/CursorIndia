import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

type Width = "narrow" | "default" | "wide";

interface SectionBreakProps {
  width?: Width;
  className?: string;
}

/** Soft fade-out rule between page sections — container-width, not full bleed. */
export function SectionBreak({ width = "wide", className }: SectionBreakProps) {
  return (
    <div
      role="separator"
      aria-hidden
      className={cn("py-8 md:py-12", className)}
    >
      <Container width={width}>
        <hr className="section-break" />
      </Container>
    </div>
  );
}
