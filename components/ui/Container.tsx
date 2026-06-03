import { cn } from "@/lib/utils";

type Width = "narrow" | "default" | "wide";

const widthClass: Record<Width, string> = {
  narrow: "max-w-3xl",
  default: "max-w-6xl",
  wide: "max-w-7xl",
};

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: Width;
}

export function Container({
  width = "default",
  className,
  children,
  ...rest
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 md:px-6 lg:px-8",
        widthClass[width],
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
