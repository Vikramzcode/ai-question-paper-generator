import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { GlassCard } from "@/components/common/GlassCard";
import { apiClient } from "@/services/api";
import { Shield, CheckCircle } from "lucide-react";

export default function Confirm2FA() {
  const navigate = useNavigate();
  const location = useLocation();
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Get secret from location state
  const secret = location.state?.secret;

  useEffect(() => {
    if (!secret) {
      navigate("/security/enable-2fa");
      return;
    }
    inputRefs.current[0]?.focus();
  }, [secret, navigate]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setCode(pasted.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const codeString = code.join("");
    if (codeString.length < 6) {
      setError("Please enter the full 6-digit code.");
      return;
    }

    setIsLoading(true);
    try {
      await apiClient.post("/auth/confirm-2fa", {
        secret,
        code: codeString,
      });

      setSuccess("2FA enabled successfully!");
      
      setTimeout(() => {
        navigate("/settings");
      }, 2000);
    } catch (err: any) {
      setError(err?.message || "Invalid code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!secret) {
    return null;
  }

  return (
    <main className="p-4 lg:p-8 lg:ml-64 min-h-screen">
      <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold mb-2">Confirm Two-Factor Authentication</h1>
          <p className="text-muted-foreground">
            Enter the code from your authenticator app
          </p>
        </div>

        <GlassCard heavy className="p-8 space-y-6">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
              {success ? (
                <CheckCircle className="text-profit" size={40} />
              ) : (
                <Shield className="text-primary" size={40} />
              )}
            </div>
            <h2 className="text-2xl font-bold">
              {success ? "Success!" : "Verify Your Setup"}
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              {success
                ? "Two-factor authentication has been enabled on your account."
                : "Open your authenticator app and enter the 6-digit code to complete setup."}
            </p>
          </div>

          {error && (
            <div className="bg-loss/20 border border-loss/30 text-loss px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-profit/20 border border-profit/30 text-profit px-4 py-3 rounded-lg text-sm">
              {success}
            </div>
          )}

          {!success && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Secret Key (backup) */}
              <div className="bg-card/50 p-4 rounded-lg border border-white/10">
                <p className="text-xs text-muted-foreground mb-2">
                  If you can't scan the QR code, enter this key manually:
                </p>
                <code className="text-sm font-mono bg-background px-3 py-2 rounded block break-all">
                  {secret}
                </code>
              </div>

              {/* OTP Input */}
              <div className="flex justify-center gap-2">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    disabled={isLoading}
                    className="w-12 h-14 text-center text-2xl font-bold bg-input border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all disabled:opacity-50"
                  />
                ))}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Verifying..." : "Enable 2FA"}
              </button>
            </form>
          )}

          <div className="text-center text-sm text-muted-foreground">
            <Link to="/settings" className="text-primary hover:underline">
              Back to Settings
            </Link>
          </div>
        </GlassCard>
      </div>
    </main>
  );
}
