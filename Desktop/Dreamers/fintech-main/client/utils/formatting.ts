/**
 * Format numbers as currency with symbol
 */
export function formatCurrency(
  value: number,
  currency: string = "USD",
  decimals: number = 2
): string {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);

  return formatted;
}

/**
 * Format number with commas and decimals
 */
export function formatNumber(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format percentage with symbol
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${formatNumber(value, decimals)}%`;
}

/**
 * Format date as readable string
 */
export function formatDate(date: Date | string, format: "short" | "long" = "short"): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (format === "short") {
    return dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return dateObj.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Format time as HH:MM:SS
 */
export function formatTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

/**
 * Format datetime as readable string
 */
export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return `${formatDate(dateObj)} ${formatTime(dateObj)}`;
}

/**
 * Get relative time string (e.g., "2 hours ago")
 */
export function getRelativeTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

  return formatDate(dateObj);
}

/**
 * Check if value is positive (profit) or negative (loss)
 */
export function isProfit(value: number): boolean {
  return value >= 0;
}

/**
 * Get color class for profit/loss
 */
export function getProfitColor(value: number): string {
  return isProfit(value) ? "text-profit" : "text-loss";
}

/**
 * Format profit/loss with sign
 */
export function formatProfitLoss(value: number, decimals: number = 2): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${formatNumber(value, decimals)}`;
}
