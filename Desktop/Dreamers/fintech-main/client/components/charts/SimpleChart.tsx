import { GlassCard } from "../common/GlassCard";

interface DataPoint {
  time: string;
  price: number;
  volume: number;
}

interface SimpleChartProps {
  data: DataPoint[];
  title?: string;
  height?: string;
}

export function SimpleChart({
  data,
  title = "Price Chart",
  height = "h-96",
}: SimpleChartProps) {
  if (!data || data.length === 0) {
    return (
      <GlassCard heavy className={`p-6 ${height} flex items-center justify-center`}>
        <p className="text-muted-foreground">No data available</p>
      </GlassCard>
    );
  }

  const prices = data.map((d) => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice;

  // Normalize prices to 0-100
  const normalizedData = data.map((d) => ({
    ...d,
    normalizedPrice: ((d.price - minPrice) / priceRange) * 100,
  }));

  return (
    <GlassCard heavy className={`p-6 flex flex-col gap-4 ${height}`}>
      <h3 className="text-lg font-semibold">{title}</h3>

      <div className="flex-1 flex flex-col justify-between">
        {/* Simple chart visualization */}
        <div className="relative h-full">
          <svg className="w-full h-full" viewBox="0 0 1000 400" preserveAspectRatio="none">
            {/* Grid lines */}
            <line x1="0" y1="100" x2="1000" y2="100" stroke="rgba(255,255,255,0.1)" />
            <line x1="0" y1="200" x2="1000" y2="200" stroke="rgba(255,255,255,0.1)" />
            <line x1="0" y1="300" x2="1000" y2="300" stroke="rgba(255,255,255,0.1)" />

            {/* Price line */}
            <polyline
              points={normalizedData
                .map(
                  (d, i) =>
                    `${(i / (normalizedData.length - 1)) * 1000},${400 - d.normalizedPrice * 4}`
                )
                .join(" ")}
              fill="none"
              stroke="hsl(var(--profit))"
              strokeWidth="3"
            />

            {/* Area under curve */}
            <polygon
              points={[
                `0,400`,
                ...normalizedData.map(
                  (d, i) =>
                    `${(i / (normalizedData.length - 1)) * 1000},${400 - d.normalizedPrice * 4}`
                ),
                `1000,400`,
              ].join(" ")}
              fill="hsl(var(--profit))"
              fillOpacity="0.1"
            />
          </svg>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-4 gap-4 text-xs pt-4 border-t border-white/10">
          <div>
            <p className="text-muted-foreground">Min</p>
            <p className="font-semibold text-white">${minPrice.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Max</p>
            <p className="font-semibold text-white">${maxPrice.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Current</p>
            <p className="font-semibold text-profit">
              ${data[data.length - 1].price.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Change</p>
            <p className="font-semibold text-profit">
              +{((data[data.length - 1].price - data[0].price) / data[0].price * 100).toFixed(2)}%
            </p>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
