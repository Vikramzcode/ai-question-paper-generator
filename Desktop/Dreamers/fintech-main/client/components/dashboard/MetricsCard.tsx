import { ReactNode } from "react";
import { GlassCard } from "../common/GlassCard";
import { AnimatedCounter } from "../common/AnimatedCounter";
import { cn } from "@/lib/utils";

interface MetricsCardProps {
  title: string;
  value: number;
  icon?: ReactNode;
  format?: "currency" | "number";
  decimals?: number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  glowing?: boolean;
  className?: string;
}

export function MetricsCard({
  title,
  value,
  icon,
  format = "currency",
  decimals = 2,
  trend,
  glowing = false,
  className,
}: MetricsCardProps) {
  return (
    <GlassCard heavy className={cn("p-6 flex flex-col gap-4 hover:scale-105 transition-all duration-300 group animate-slide-up", className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-muted-foreground text-sm font-medium group-hover:text-primary transition-colors duration-300">{title}</p>
          <div className={glowing ? "animate-counter-glow inline-block" : ""}>
            <p className={cn("text-3xl font-bold mt-2 bg-gradient-to-br from-slate-200 to-blue-100 bg-clip-text text-transparent transition-all duration-300")}>
              {format === "currency" ? "$" : ""}
              <AnimatedCounter
                value={value}
                format={format}
                decimals={decimals}
                className="inline"
                glowing={glowing}
              />
            </p>
          </div>
          {trend && (
            <div className={cn("text-sm font-medium mt-2 transition-all duration-300", trend.isPositive ? "text-profit" : "text-loss")}>
              <span className="inline-block transition-transform duration-300 group-hover:scale-110">
                {trend.isPositive ? "↗" : "↘"}
              </span>
              {" "}
              {Math.abs(trend.value).toFixed(1)}% this month
            </div>
          )}
        </div>
        {icon && <div className="text-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-300 group-hover:scale-110 transform duration-300">{icon}</div>}
      </div>
    </GlassCard>
  );
}
