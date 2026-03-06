import { useEffect, useState } from "react";
import { GlassCard } from "../common/GlassCard";
import { formatCurrency } from "@/utils/formatting";

interface ProfitTickerProps {
  baseProfitPerDay: number;
  activeSince?: Date;
}

export function ProfitTicker({
  baseProfitPerDay,
  activeSince = new Date(),
}: ProfitTickerProps) {
  const [currentProfit, setCurrentProfit] = useState(baseProfitPerDay * 0.01); // Start with 1% of daily

  useEffect(() => {
    const startTime = activeSince.getTime();
    const msPerDay = 24 * 60 * 60 * 1000;
    const updateInterval = 100; // Update every 100ms

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsedMs = now - startTime;
      const elapsedDays = elapsedMs / msPerDay;
      const profit = baseProfitPerDay * elapsedDays;
      setCurrentProfit(Math.max(profit, baseProfitPerDay * 0.01)); // Ensure minimum display
    }, updateInterval);

    return () => clearInterval(interval);
  }, [baseProfitPerDay, activeSince]);

  return (
    <GlassCard heavy className="p-8 text-center animate-slide-up">
      <p className="text-muted-foreground text-sm font-medium mb-4">
        Live Profit Ticker
      </p>
      <div className="text-4xl md:text-5xl font-bold text-profit animate-counter-glow inline-block">
        {formatCurrency(currentProfit, "USD", 2)}
      </div>
      <p className="text-xs text-muted-foreground mt-4">
        Based on your active investments
      </p>
    </GlassCard>
  );
}
