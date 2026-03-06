import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "active" | "inactive" | "pending" | "verified" | "completed" | "failed";
  className?: string;
}

const statusStyles = {
  active: "bg-profit/20 text-profit border border-profit/30",
  inactive: "bg-muted text-muted-foreground border border-muted",
  pending: "bg-warning/20 text-warning border border-warning/30",
  verified: "bg-profit/20 text-profit border border-profit/30",
  completed: "bg-profit/20 text-profit border border-profit/30",
  failed: "bg-loss/20 text-loss border border-loss/30",
};

const statusLabels = {
  active: "active",
  inactive: "inactive",
  pending: "pending",
  verified: "verified",
  completed: "completed",
  failed: "failed",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "px-3 py-1 rounded-full text-xs font-semibold inline-block",
        statusStyles[status],
        className
      )}
    >
      {statusLabels[status]}
    </span>
  );
}
