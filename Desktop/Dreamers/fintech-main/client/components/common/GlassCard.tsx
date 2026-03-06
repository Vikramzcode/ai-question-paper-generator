import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  heavy?: boolean;
}

export function GlassCard({
  children,
  className,
  hover = false,
  onClick,
  heavy = false,
}: GlassCardProps) {
  return (
    <div
      className={cn(
        heavy ? "glass-card-heavy" : "glass-card",
        hover && "hover:bg-card/50 cursor-pointer transition-colors",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
