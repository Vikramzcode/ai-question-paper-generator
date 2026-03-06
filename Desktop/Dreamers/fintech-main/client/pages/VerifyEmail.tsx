import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GlassCard } from "@/components/common/GlassCard";
import { apiClient } from "@/services/api";
import { MailCheck, RefreshCw, Mail } from "lucide-react";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [emailInput, setEmailInput] = useState(
    () => sessionStorage.getItem("pending_verify_email") || ""
  );
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // digits only
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // one digit per box
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!emailInput.trim()) {
      setError("Please enter your email address.");
      return;
    }
    const code = otp.join("");
    if (code.length < 6) {
      setError("Please enter the full 6-digit code.");
      return;
    }

    setIsLoading(true);
    try {
      await apiClient.post("/auth/verify-email", { email: emailInput.trim(), otp: code });
      sessionStorage.removeItem("pending_verify_email");
      setSuccess("Email verified! Redirecting to login…");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      setError(
        err?.message || "Invalid or expired OTP. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setError(null);
    if (!emailInput.trim()) {
      setError("Enter your email address first.");
      return;
    }
    setIsResending(true);
    try {
      await apiClient.post("/auth/resend-otp", { email: emailInput.trim() });
      setSuccess("A new OTP has been sent to your email.");
    } catch (err: any) {
      setError(err?.message || "Could not resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 animate-slide-up">
        {/* Logo */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-primary">TradePro</h1>
          <p className="text-muted-foreground">Professional Trading Platform</p>
        </div>

        <GlassCard heavy className="p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <MailCheck className="text-primary" size={48} />
            </div>
            <h2 className="text-2xl font-bold">Verify Your Email</h2>
            <p className="text-sm text-muted-foreground">
              Enter your email and the 6-digit OTP sent to your inbox.
            </p>
          </div>

          {/* Error / Success messages */}
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-muted-foreground" size={18} />
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="you@example.com"
                  disabled={isLoading || !!success}
                  className="w-full bg-input border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all disabled:opacity-50"
                  required
                />
              </div>
            </div>

            {/* OTP Boxes */}
            <div>
              <label className="block text-sm font-medium mb-4 text-center">
                Enter OTP
              </label>
              <div className="flex justify-center gap-3" onPaste={handlePaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (inputRefs.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    disabled={isLoading || !!success}
                    className="w-12 h-14 text-center text-xl font-bold bg-input border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all disabled:opacity-50"
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !!success}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Verifying…" : "Verify Email"}
            </button>
          </form>

          {/* Resend */}
          <div className="text-center text-sm text-muted-foreground pt-2 border-t border-white/10">
            Didn't receive the code?{" "}
            <button
              onClick={handleResend}
              disabled={isResending}
              className="text-primary hover:underline font-semibold disabled:opacity-50 inline-flex items-center gap-1"
            >
              <RefreshCw size={13} className={isResending ? "animate-spin" : ""} />
              {isResending ? "Sending…" : "Resend OTP"}
            </button>
          </div>
        </GlassCard>

        <div className="text-center text-sm text-muted-foreground">
          Wrong email?{" "}
          <Link to="/register" className="text-primary hover:underline font-semibold">
            Go back to Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
