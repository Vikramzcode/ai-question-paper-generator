import { useState } from "react";
import { GlassCard } from "@/components/common/GlassCard";
import { Copy, Check, AlertCircle, CheckCircle, Bot } from "lucide-react";
import { apiClient } from "@/services/api";
import { useAuth } from "@/context/AuthContext";

interface RobotActivationResponse {
  success: boolean;
  message: string;
  robotId?: string;
}

export default function RobotActivation() {
  const { user } = useAuth();
  const [txHash, setTxHash] = useState("");
  const [depositAddress, setDepositAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState<"txHash" | "address" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleCopy = (text: string, type: "txHash" | "address") => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const validateTxHash = (hash: string): boolean => {
    // Standard transaction hash is 64-66 characters long (hex)
    if (!hash || hash.length < 60) {
      return false;
    }
    return /^0x?[a-fA-F0-9]{60,}$/.test(hash);
  };

  const validateAddress = (address: string): boolean => {
    // Standard crypto address validation (40-66 characters)
    if (!address || address.length < 26) {
      return false;
    }
    // Supports Ethereum, TRON, and other standard addresses
    return /^(0x)?[a-zA-Z0-9]{26,}$/.test(address);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (!txHash.trim()) {
      setError("Please enter a transaction hash");
      return;
    }

    if (!validateTxHash(txHash)) {
      setError("Invalid transaction hash format. Please check and try again.");
      return;
    }

    if (!depositAddress.trim()) {
      setError("Please enter a deposit address");
      return;
    }

    if (!validateAddress(depositAddress)) {
      setError("Invalid deposit address format. Please check and try again.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await apiClient.post<RobotActivationResponse>(
        "/robot/activate",
        {
          tx_hash: txHash.trim(),
          deposit_address: depositAddress.trim(),
        }
      );

      if (response.data.success) {
        setSuccess(
          response.data.message ||
            "Robot activated successfully! Your robot is now live."
        );
        setTxHash("");
        setDepositAddress("");

        // Reset form after 5 seconds
        setTimeout(() => {
          setSuccess(null);
        }, 5000);
      }
    } catch (err: any) {
      setError(
        err?.message || "Failed to activate robot. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="p-4 lg:p-8 lg:ml-64 min-h-screen">
      <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold mb-2">Activate Trading Robot</h1>
          <p className="text-muted-foreground">
            Activate your automated trading robot with transaction details
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-loss/20 border border-loss/30 text-loss px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Success State */}
        {success && (
          <div className="bg-profit/20 border border-profit/30 text-profit px-4 py-3 rounded-lg flex items-center gap-2">
            <CheckCircle size={20} />
            <span>{success}</span>
          </div>
        )}

        {/* Main Form */}
        <GlassCard heavy className="p-8 space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bot className="text-primary" size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-2">Activate Your Robot</h2>
            <p className="text-sm text-muted-foreground">
              Enter transaction details to activate your trading robot
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Transaction Hash Input */}
            <div>
              <label className="block text-sm font-semibold mb-3">
                Transaction Hash (TxID) <span className="text-loss">*</span>
              </label>
              <input
                type="text"
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
                placeholder="0x1234567890abcdef... or transaction ID"
                className="w-full bg-input border border-white/10 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all disabled:opacity-50"
                required
                disabled={submitting}
              />
              <div className="mt-2 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Your transaction hash from blockchain
                </p>
                {txHash && (
                  <button
                    type="button"
                    onClick={() => handleCopy(txHash, "txHash")}
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    {copied === "txHash" ? (
                      <>
                        <Check size={12} /> Copied
                      </>
                    ) : (
                      <>
                        <Copy size={12} /> Copy
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Deposit Address Input */}
            <div>
              <label className="block text-sm font-semibold mb-3">
                Deposit Address <span className="text-loss">*</span>
              </label>
              <input
                type="text"
                value={depositAddress}
                onChange={(e) => setDepositAddress(e.target.value)}
                placeholder="0x... or wallet address"
                className="w-full bg-input border border-white/10 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all disabled:opacity-50"
                required
                disabled={submitting}
              />
              <div className="mt-2 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Your wallet deposit address
                </p>
                {depositAddress && (
                  <button
                    type="button"
                    onClick={() => handleCopy(depositAddress, "address")}
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    {copied === "address" ? (
                      <>
                        <Check size={12} /> Copied
                      </>
                    ) : (
                      <>
                        <Copy size={12} /> Copy
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={
                submitting || !txHash.trim() || !depositAddress.trim()
              }
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"></div>
                  Activating...
                </>
              ) : (
                <>
                  <Bot size={20} />
                  Activate Robot
                </>
              )}
            </button>
          </form>

          {/* Important Information */}
          <div className="space-y-4 p-4 bg-warning/10 border border-warning/30 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle size={20} className="text-warning flex-shrink-0" />
              <h3 className="font-semibold">Important Information</h3>
            </div>
            <ul className="space-y-2 text-sm ml-7">
              <li className="flex items-start gap-2">
                <span className="text-warning font-bold mt-0.5">•</span>
                <span>Ensure the transaction hash is correct</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-warning font-bold mt-0.5">•</span>
                <span>Double-check the deposit address before submitting</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-warning font-bold mt-0.5">•</span>
                <span>Your robot will be activated after verification</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-warning font-bold mt-0.5">•</span>
                <span>
                  Verification typically takes <strong>5-10 minutes</strong>
                </span>
              </li>
            </ul>
          </div>
        </GlassCard>

        {/* Help Section */}
        <GlassCard className="p-6">
          <h3 className="font-semibold mb-4">Need Help?</h3>
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-semibold mb-1">
                Where can I find my transaction hash?
              </p>
              <p className="text-muted-foreground">
                Open your wallet or blockchain explorer, find your transaction,
                and copy the transaction ID/hash.
              </p>
            </div>
            <div>
              <p className="font-semibold mb-1">What is the deposit address?</p>
              <p className="text-muted-foreground">
                It's the wallet address where you sent the payment from. You can
                find it in your wallet's transaction history.
              </p>
            </div>
            <div>
              <p className="font-semibold mb-1">
                How long until my robot is active?
              </p>
              <p className="text-muted-foreground">
                After you submit, verification takes 5-10 minutes. You'll
                receive a notification once your robot is activated and ready.
              </p>
            </div>
            <div>
              <p className="font-semibold mb-1">Can I change the details later?</p>
              <p className="text-muted-foreground">
                Contact support if you need to modify robot settings after
                activation.
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </main>
  );
}
