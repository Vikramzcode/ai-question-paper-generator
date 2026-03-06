import { useEffect, useRef } from "react";
import { formatCurrency, formatNumber } from "@/utils/formatting";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  format?: "currency" | "number";
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  glowing?: boolean;
}

export function AnimatedCounter({
  value,
  duration = 2000,
  format = "currency",
  decimals = 2,
  prefix = "",
  suffix = "",
  className = "",
  glowing = false,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const startValue = useRef(0);
  const rafId = useRef<number>();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const startTime = performance.now();
    startValue.current = 0;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue.current + value * easeOut;

      const formattedValue =
        format === "currency"
          ? formatCurrency(currentValue, "USD", decimals).replace("$", "")
          : formatNumber(currentValue, decimals);

      element.textContent = `${prefix}${formattedValue}${suffix}`;

      if (progress < 1) {
        rafId.current = requestAnimationFrame(animate);
      }
    };

    rafId.current = requestAnimationFrame(animate);

    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [value, duration, format, decimals, prefix, suffix]);

  return (
    <span
      ref={ref}
      className={`${glowing ? "animate-counter-glow" : ""} ${className}`}
    >
      {prefix}
      {format === "currency"
        ? formatCurrency(value, "USD", decimals)
        : formatNumber(value, decimals)}
      {suffix}
    </span>
  );
}
