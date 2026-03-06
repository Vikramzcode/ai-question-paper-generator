import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useWallet } from "@/context/WalletContext";
import { useApp } from "@/context/AppContext";
import { MetricsCard } from "@/components/dashboard/MetricsCard";
import { ProfitTicker } from "@/components/dashboard/ProfitTicker";
import { SimpleChart } from "@/components/charts/SimpleChart";
import { MarketCandleChart } from "@/components/charts/MarketCandleChart";
import { GlassCard } from "@/components/common/GlassCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { mockChartData } from "@/mock/data";
import { useEffect } from "react";
import {
  Wallet,
  TrendingUp,
  Gift,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { balance, fetchWalletBalance } = useWallet();
  const { setActivationModalOpen } = useApp();

  useEffect(() => {
    if (user) {
      fetchWalletBalance();
    }
  }, [user]);
  // Use mock data if balance is not loaded
  const displayBalance = balance;

  const handleAction = (path: string) => {
    if (user?.accountStatus === "inactive") {
      setActivationModalOpen(true);
    } else {
      navigate(path);
    }
  };
  return (
    <main className="p-4 lg:p-8 lg:ml-64 min-h-screen">
      <div className="w-full max-w-7xl mx-auto space-y-8 animate-fade-in">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}! Here's your trading overview.
          </p>
        </div>

        {/* Key Metrics - 5 Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <MetricsCard
            title="Main Wallet"
            value={displayBalance.mainWallet}
            icon={<Wallet />}
            glowing
            trend={{ value: 2.5, isPositive: true }}
          />
          <MetricsCard
            title="Active Deposit"
            value={displayBalance.activeDeposit}
            icon={<TrendingUp />}
            trend={{ value: 5.2, isPositive: true }}
          />
          <MetricsCard
            title="Profit Balance"
            value={displayBalance.profitBalance}
            icon={<ArrowUpRight />}
            glowing
            trend={{ value: 12.8, isPositive: true }}
          />
          <MetricsCard
            title="Referral Bonus"
            value={displayBalance.referralBonus}
            icon={<Gift />}
            trend={{ value: 3.5, isPositive: true }}
          />
          <MetricsCard
            title="Total Investment"
            value={displayBalance.totalInvestment}
            icon={<ArrowDownLeft />}
          />
        </div>

        {/* Row 1: Profit Ticker (4 cols) + Chart (8 cols) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Live Profit Ticker - 4 columns */}
          <div className="md:col-span-4">
            <ProfitTicker
              baseProfitPerDay={displayBalance.profitBalance / 30}
            />
          </div>

          {/* Investment Growth Chart - 8 columns */}
          <div className="md:col-span-8">
            <SimpleChart
              data={mockChartData}
              title="Investment Growth Chart"
              height="h-80"
            />
          </div>
        </div>

        {/* Row 2: Quick Actions (4 cols each) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Deposit Funds Card */}
          <div className="md:col-span-4 animate-slide-in">
            <button
              onClick={() => handleAction("/wallet/deposit")}
              className="w-full h-full group"
            >
              <GlassCard
                heavy
                className="p-6 bg-gradient-to-br from-emerald-500/10 to-green-500/5 hover:from-emerald-500/20 hover:to-green-500/10 transition-all hover:scale-105 h-full flex flex-col justify-between border border-emerald-500/20 hover:border-emerald-500/40"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium group-hover:text-emerald-500 transition-colors">
                      Deposit Funds
                    </p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-green-500 bg-clip-text text-transparent mt-2 group-hover:animate-float">
                      →
                    </p>
                  </div>
                  <Wallet
                    className="text-emerald-500/50 group-hover:text-emerald-500 transition-all group-hover:scale-110"
                    size={24}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-4 group-hover:text-foreground transition-colors">
                  Add funds to your account
                </p>
              </GlassCard>
            </button>
          </div>

          {/* Withdraw Profit Card */}
          <div
            className="md:col-span-4 animate-slide-in"
            style={{ animationDelay: "0.1s" }}
          >
            <button
              onClick={() => handleAction("/wallet/withdraw")}
              className="w-full h-full group"
            >
              <GlassCard
                heavy
                className="p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/5 hover:from-blue-500/20 hover:to-cyan-500/10 transition-all hover:scale-105 h-full flex flex-col justify-between border border-blue-500/20 hover:border-blue-500/40"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium group-hover:text-blue-500 transition-colors">
                      Withdraw Profit
                    </p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent mt-2 group-hover:animate-float">
                      →
                    </p>
                  </div>
                  <TrendingUp
                    className="text-blue-500/50 group-hover:text-blue-500 transition-all group-hover:scale-110"
                    size={24}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-4 group-hover:text-foreground transition-colors">
                  Withdraw your earnings
                </p>
              </GlassCard>
            </button>
          </div>

          {/* Referral Program Card */}
          <div
            className="md:col-span-4 animate-slide-in"
            style={{ animationDelay: "0.2s" }}
          >
            <button
              onClick={() => navigate("/referral")}
              className="w-full h-full group"
            >
              <GlassCard
                heavy
                className="p-6 bg-gradient-to-br from-amber-500/10 to-orange-500/5 hover:from-amber-500/20 hover:to-orange-500/10 transition-all hover:scale-105 h-full flex flex-col justify-between border border-amber-500/20 hover:border-amber-500/40"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium group-hover:text-amber-500 transition-colors">
                      Referral Program
                    </p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent mt-2 group-hover:animate-float">
                      →
                    </p>
                  </div>
                  <Gift
                    className="text-amber-500/50 group-hover:text-amber-500 transition-all group-hover:scale-110"
                    size={24}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-4 group-hover:text-foreground transition-colors">
                  Earn by referring friends
                </p>
              </GlassCard>
            </button>
          </div>
        </div>

        {/* Row 3: Market Candle Chart (12 cols) */}
        <div className="animate-slide-in">
          <MarketCandleChart />
        </div>

        {/* Row 4: Account Information (12 cols) */}
        <GlassCard heavy className="p-6 md:p-8 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Account Information</h3>
            <StatusBadge
              status={
                user?.accountStatus === "inactive" ? "inactive" : "active"
              }
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                Account Status
              </p>
              <p className="text-base font-semibold mt-2 capitalize">
                {user?.accountStatus || "inactive"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                Member Since
              </p>
              <p className="text-base font-semibold mt-2">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                Referral Code
              </p>
              <p className="text-base font-semibold mt-2 text-primary font-mono">
                {user?.referralCode || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                Email
              </p>
              <p className="text-base font-semibold mt-2 truncate">
                {user?.email}
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </main>
  );
}
