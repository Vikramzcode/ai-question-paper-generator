import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { GlassCard } from "@/components/common/GlassCard";
import { Mail, Lock, User, Phone, LogIn } from "lucide-react";

export default function Signup() {
  const navigate = useNavigate();
  const { signup, isLoading, error, clearError } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setLocalError("Password must be at least 8 characters");
      return;
    }

    try {
      await signup(email, password, name, phone);
      navigate("/verify-email");
    } catch (err) {
      // Error is handled by context
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

        {/* Signup Form */}
        <GlassCard heavy className="p-8 space-y-6">
          <h2 className="text-2xl font-bold text-center">Create Account</h2>

          {(error || localError) && (
            <div className="bg-loss/20 border border-loss/30 text-loss px-4 py-3 rounded-lg text-sm">
              <div>{error || localError}</div>
              {/* If email already registered, it means they signed up but haven't verified yet */}
              {(error || "").toLowerCase().includes("already registered") && (
                <div className="mt-2 text-xs text-muted-foreground">
                  Already signed up?{" "}
                  <a
                    href="/verify-email"
                    className="text-primary font-semibold hover:underline"
                    onClick={() => {
                      sessionStorage.setItem("pending_verify_email", email);
                    }}
                  >
                    Click here to verify your email →
                  </a>
                </div>
              )}
              <button
                onClick={() => {
                  clearError();
                  setLocalError("");
                }}
                className="mt-1 text-xs font-semibold hover:underline block"
              >
                Dismiss
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-muted-foreground" size={18} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Trader"
                  className="w-full bg-input border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Phone Input */}
            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 text-muted-foreground" size={18} />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 234 567 8900"
                  className="w-full bg-input border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-muted-foreground" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-input border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-muted-foreground" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-input border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  required
                  disabled={isLoading}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                At least 8 characters
              </p>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-muted-foreground" size={18} />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-input border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <LogIn size={18} />
              {isLoading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          {/* Terms */}
          <p className="text-xs text-muted-foreground text-center pt-4 border-t border-white/10">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </GlassCard>

        {/* Login Link */}
        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline font-semibold">
            Sign in
          </Link>
        </div>

        <div className="text-center text-xs text-muted-foreground">
          Or go to{" "}
          <Link to="/login" className="text-primary hover:underline">
            login page
          </Link>
        </div>
      </div>
    </div>
  );
}
