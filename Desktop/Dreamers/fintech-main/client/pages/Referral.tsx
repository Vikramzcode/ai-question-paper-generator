import { useEffect, useState } from "react";
import { GlassCard } from "@/components/common/GlassCard";
import { Copy, Check, Gift, TrendingUp, Loader2 } from "lucide-react";
import { formatCurrency } from "@/utils/formatting";
import { ReferralResponse } from "@/types/referral.types.tsx";
import { useAuth } from "@/context/AuthContext";
import { referralService } from "@/services/referral.service";

export default function Referral() {
  const [copied, setCopied] = useState(false);
  const { user } = useAuth();
  const [referralData, setReferralData] = useState<ReferralResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleCopyLink = () => {
    if (referralData?.referralLink) {
      navigator.clipboard.writeText(referralData.referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    const fetchReferralData = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        setError("");
        const data = await referralService.getReferralData(user.id);
        setReferralData(data);
      } catch (error: any) {
        console.error("Referral fetch error:", error);
        setError(error.message || "Failed to load referral data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchReferralData();
  }, [user?.id]);

  const progress = referralData?.nextRankTarget
    ? (referralData.totalReferred / referralData.nextRankTarget) * 100
    : 0;

  return (
    <main className="p-4 lg:p-8 lg:ml-64 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold mb-2">Referral Program</h1>
          <p className="text-muted-foreground">
            Earn rewards by referring your friends
          </p>
        </div>

        {loading && (
          <GlassCard heavy className="p-8 flex items-center justify-center">
            <Loader2 className="animate-spin mr-2" size={24} />
            <span>Loading referral data...</span>
          </GlassCard>
        )}

        {error && (
          <GlassCard heavy className="p-4 border-loss/50 flex items-start gap-4">
            <div className="text-loss">⚠️</div>
            <div>
              <p className="font-semibold">Error</p>
              <p className="text-sm text-muted-foreground mt-1">{error}</p>
            </div>
          </GlassCard>
        )}

        {!loading && !error && referralData && (
          <>
            {/* Referral Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <GlassCard heavy className="p-6">
                <p className="text-muted-foreground text-sm font-medium">
                  Total Referrals
                </p>
                <p className="text-3xl font-bold mt-2">{referralData.totalReferred}</p>
                <p className="text-xs text-muted-foreground mt-2">Friends invited</p>
              </GlassCard>

              <GlassCard heavy className="p-6">
                <p className="text-muted-foreground text-sm font-medium">
                  Bonus Earned
                </p>
                <p className="text-3xl font-bold text-profit mt-2">
                  {formatCurrency(referralData.totalBonus)}
                </p>
                <p className="text-xs text-muted-foreground mt-2">From referrals</p>
              </GlassCard>

              <GlassCard heavy className="p-6">
                <p className="text-muted-foreground text-sm font-medium">Rank</p>
                <p className="text-2xl font-bold text-accent mt-2">
                  {referralData.rank}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {referralData.nextRankTarget ? "Next milestone" : "Max rank achieved"}
                </p>
              </GlassCard>
            </div>

            {/* Referral Link */}
            <GlassCard heavy className="p-8 space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Gift size={20} />
                Your Referral Link
              </h3>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={referralData.referralLink || ""}
                  readOnly
                  className="flex-1 bg-input border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-3 rounded-lg transition-all flex items-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check size={18} />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy size={18} />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </GlassCard>

            {/* Rank Progress */}
            <GlassCard heavy className="p-8 space-y-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp size={20} />
                Progress to Next Rank
              </h3>

              {referralData.nextRankTarget ? (
                <div>
                  <div className="flex justify-between mb-3">
                    <span className="text-sm font-semibold">{referralData.rank}</span>
                    <span className="text-sm text-muted-foreground">
                      {referralData.totalReferred} / {referralData.nextRankTarget}
                    </span>
                  </div>
                  <div className="w-full bg-card rounded-full h-3 overflow-hidden border border-white/10">
                    <div
                      className="bg-gradient-to-r from-profit to-accent h-full transition-all duration-300"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    Invite {referralData.nextRankTarget - referralData.totalReferred} more{" "}
                    {referralData.nextRankTarget - referralData.totalReferred === 1
                      ? "friend"
                      : "friends"}{" "}
                    to reach the next rank
                  </p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">
                    🎉 Congratulations! You've reached the maximum rank.
                  </p>
                </div>
              )}

              {/* Rewards Table */}
              <div className="pt-6 border-t border-white/10">
                <h4 className="font-semibold mb-4">Reward Structure</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between p-3 bg-card/50 rounded-lg">
                    <span className="text-muted-foreground">Rank Upgrade Bonus</span>
                    <span className="font-semibold text-primary">Based on rank</span>
                  </div>
                  <div className="flex justify-between p-3 bg-card/50 rounded-lg">
                    <span className="text-muted-foreground">Referral Activation</span>
                    <span className="font-semibold text-primary">Automatic tracking</span>
                  </div>
                  <div className="flex justify-between p-3 bg-card/50 rounded-lg">
                    <span className="text-muted-foreground">Bonus credited to</span>
                    <span className="font-semibold text-profit">Referral Balance</span>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Referrals List */}
            <GlassCard heavy className="p-8 space-y-6">
              <h3 className="text-lg font-semibold">Recent Referrals</h3>

              {referralData.referrals && referralData.referrals.length > 0 ? (
                <div className="space-y-3">
                  {referralData.referrals.map((ref) => (
                    <div
                      key={ref.id}
                      className="flex items-center justify-between p-4 bg-card/50 rounded-lg border border-white/10 hover:border-white/20 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-semibold">{ref.name || "Anonymous"}</p>
                        <p className="text-xs text-muted-foreground">{ref.email}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Joined {new Date(ref.joinedDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            ref.status === "active"
                              ? "bg-profit/20 text-profit"
                              : "bg-warning/20 text-warning"
                          }`}
                        >
                          {ref.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No referrals yet. Share your link to get started!</p>
                </div>
              )}
            </GlassCard>
          </>
        )}
      </div>
    </main>
  );
}
