import { useState } from "react";
import { GlassCard } from "@/components/common/GlassCard";
import { isWithdrawalAllowed, getDaysUntilWithdrawal } from "@/utils/validation";
import { TrendingUp, AlertCircle, Clock, CheckCircle } from "lucide-react";
import { walletService } from "@/services/wallet.service";
import { useNavigate } from "react-router-dom";

export default function Withdraw() {
  const navigate = useNavigate();
  const [withdrawType, setWithdrawType] = useState<"profit" | "principal">("profit");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const isAllowed = isWithdrawalAllowed();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!isAllowed) {
      setError(
        `Withdrawals are only allowed between 1st-5th of each month. Next window in ${getDaysUntilWithdrawal()} days.`
      );
      return;
    }

    if (!amount || parseFloat(amount) < 100) {
      setError("Minimum withdrawal amount is $100");
      return;
    }

    setLoading(true);

    try {
      const result = await walletService.initiateWithdrawal({
        amount: parseFloat(amount),
        type: withdrawType.toUpperCase() as "PROFIT" | "PRINCIPAL",
      });

      setSuccess(true);
      setAmount("");
      
      // Show success message and redirect after 3 seconds
      setTimeout(() => {
        navigate("/wallet");
      }, 3000);

    } catch (err: any) {
      console.error("Withdrawal error:", err);
      setError(err.message || "Failed to process withdrawal request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-4 lg:p-8 lg:ml-64 min-h-screen">
      <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold mb-2">Withdraw Funds</h1>
          <p className="text-muted-foreground">
            Request withdrawal of your profits or principal investment
          </p>
        </div>

        {!isAllowed && (
          <GlassCard heavy className="p-4 border-warning/50 flex items-start gap-4">
            <Clock className="text-warning flex-shrink-0 mt-1" size={20} />
            <div>
              <p className="font-semibold">Withdrawal Window Closed</p>
              <p className="text-sm text-muted-foreground mt-1">
                Withdrawals are available only from 1st to 5th of each month.
                <br />
                Next window: In {getDaysUntilWithdrawal()} days
              </p>
            </div>
          </GlassCard>
        )}

        {error && (
          <GlassCard heavy className="p-4 border-loss/50 flex items-start gap-4">
            <AlertCircle className="text-loss flex-shrink-0 mt-1" size={20} />
            <div>
              <p className="font-semibold">Error</p>
              <p className="text-sm text-muted-foreground mt-1">{error}</p>
            </div>
          </GlassCard>
        )}

        {success && (
          <GlassCard heavy className="p-4 border-profit/50 flex items-start gap-4">
            <CheckCircle className="text-profit flex-shrink-0 mt-1" size={20} />
            <div>
              <p className="font-semibold">Success!</p>
              <p className="text-sm text-muted-foreground mt-1">
                Your withdrawal request has been submitted successfully. Redirecting to wallet...
              </p>
            </div>
          </GlassCard>
        )}

        <GlassCard heavy className="p-8 space-y-6">
          {/* Withdrawal Type Selection */}
          <div>
            <label className="block text-sm font-semibold mb-4">
              Withdrawal Type
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setWithdrawType("profit")}
                className={`p-4 rounded-lg border transition-all ${
                  withdrawType === "profit"
                    ? "border-primary bg-primary/10"
                    : "border-white/10 bg-card/50 hover:border-white/20"
                }`}
              >
                <p className="font-semibold mb-1">Profit Withdrawal</p>
                <p className="text-xs text-muted-foreground">
                  Withdraw your earnings (1% fee)
                </p>
              </button>
              <button
                type="button"
                onClick={() => setWithdrawType("principal")}
                className={`p-4 rounded-lg border transition-all ${
                  withdrawType === "principal"
                    ? "border-primary bg-primary/10"
                    : "border-white/10 bg-card/50 hover:border-white/20"
                }`}
              >
                <p className="font-semibold mb-1">Principal Withdrawal</p>
                <p className="text-xs text-muted-foreground">
                  Withdraw your investment (1% fee)
                </p>
              </button>
            </div>
          </div>

          {/* Early Exit Fee Warning */}
          {withdrawType === "principal" && (
            <GlassCard className="p-4 border-loss/50 flex items-start gap-4">
              <AlertCircle className="text-loss flex-shrink-0 mt-0.5" size={20} />
              <div className="text-sm">
                <p className="font-semibold">Early Exit Fee</p>
                <p className="text-muted-foreground mt-1">
                  If your investment is less than 6 months old, an additional 15% fee applies.
                </p>
              </div>
            </GlassCard>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Amount Input */}
            <div>
              <label className="block text-sm font-semibold mb-3">
                Withdrawal Amount (USD)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-muted-foreground font-semibold">
                  $
                </span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  min="100"
                  step="0.01"
                  disabled={!isAllowed || loading}
                  className="w-full bg-input border border-white/10 rounded-lg pl-8 pr-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all disabled:opacity-50"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Minimum withdrawal: $100
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!amount || !isAllowed || loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <TrendingUp size={20} />
              {loading ? "Processing..." : "Request Withdrawal"}
            </button>
          </form>

          {/* Fee Breakdown */}
          {amount && parseFloat(amount) >= 100 && (
            <div className="pt-6 border-t border-white/10">
              <h3 className="font-semibold mb-4">Withdrawal Breakdown</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gross Amount</span>
                  <span className="font-semibold">${parseFloat(amount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Platform Fee (1%)</span>
                  <span className="text-loss">
                    -${(parseFloat(amount) * 0.01).toFixed(2)}
                  </span>
                </div>
                {withdrawType === "principal" && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Early Exit Fee (if applicable, 15%)
                    </span>
                    <span className="text-loss">
                      -${(parseFloat(amount) * 0.15).toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between border-t border-white/10 pt-3">
                  <span className="font-semibold">Net Amount (Minimum)</span>
                  <span className="font-semibold text-profit">
                    ${withdrawType === "principal" 
                      ? (parseFloat(amount) * 0.84).toFixed(2)
                      : (parseFloat(amount) * 0.99).toFixed(2)
                    }
                  </span>
                </div>
                {withdrawType === "principal" && (
                  <p className="text-xs text-muted-foreground">
                    * Early exit fee applies if any investment is less than 6 months old
                  </p>
                )}
              </div>
            </div>
          )}
        </GlassCard>
      </div>
    </main>
  );
}
