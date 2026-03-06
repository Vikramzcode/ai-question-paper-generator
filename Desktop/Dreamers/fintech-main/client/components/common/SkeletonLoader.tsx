import { cn } from "@/lib/utils";

interface SkeletonLoaderProps {
  className?: string;
  width?: string;
  height?: string;
  circle?: boolean;
}

export function SkeletonLoader({
  className,
  width = "w-full",
  height = "h-4",
  circle = false,
}: SkeletonLoaderProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-gradient-to-r from-card to-card/50",
        width,
        height,
        circle ? "rounded-full" : "rounded-md",
        className
      )}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="glass-card p-6 space-y-4">
      <SkeletonLoader height="h-8" className="w-2/3" />
      <SkeletonLoader height="h-6" className="w-full" />
      <SkeletonLoader height="h-6" className="w-5/6" />
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex gap-4">
          <SkeletonLoader height="h-6" className="w-1/4" />
          <SkeletonLoader height="h-6" className="w-1/4" />
          <SkeletonLoader height="h-6" className="w-1/4" />
          <SkeletonLoader height="h-6" className="w-1/4" />
        </div>
      ))}
    </div>
  );
}
