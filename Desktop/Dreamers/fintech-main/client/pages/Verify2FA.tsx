import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { GlassCard } from "@/components/common/GlassCard";
import { apiClient } from "@/services/api";
import { Shield } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Verify2FA() {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateAuthAfter2FA } = useAuth();
  
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Get temp token from location state
  const tempToken = location.state?.tempToken;

  useEffect(() => {
    if (!tempToken) {
      navigate("/login");
      return;
    }
    inputRefs.current[0]?.focus();
  }, [tempToken, navigate]);

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
      const res = await apiClient.post("/auth/verify-2fa", {
        tempToken,
        code: codeString,
      });

      const { token, refreshToken } = res.data;
      
      // Update auth context with tokens
      if (updateAuthAfter2FA) {
        await updateAuthAfter2FA(token, refreshToken);
      }

      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Invalid 2FA code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!tempToken) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 animate-slide-up">
        {/* Logo */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-primary">TradePro</h1>
          <p className="text-muted-foreground">Professional Trading Platform</p>
        </div>

        {/* 2FA Form */}
        <GlassCard heavy className="p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
              <Shield className="text-primary" size={32} />
            </div>
            <h2 className="text-2xl font-bold">Two-Factor Authentication</h2>
            <p className="text-sm text-muted-foreground">
              Enter the 6-digit code from your authenticator app
            </p>
          </div>

          {error && (
            <div className="bg-loss/20 border border-loss/30 text-loss px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Verifying..." : "Verify"}
            </button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            Lost access to your authenticator?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Back to login
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
