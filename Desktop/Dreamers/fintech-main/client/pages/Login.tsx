import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { GlassCard } from "@/components/common/GlassCard";
import { Mail, Lock, LogIn } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login(email, password);
      
      // Check if 2FA is required
      if (result?.requires2FA && result?.tempToken) {
        navigate("/verify-2fa", { state: { tempToken: result.tempToken } });
        return;
      }
      
      // Otherwise navigate to dashboard
      navigate("/dashboard");
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

        {/* Login Form */}
        <GlassCard heavy className="p-8 space-y-6">
          <h2 className="text-2xl font-bold text-center">Sign In</h2>

          {error && (
            <div className="bg-loss/20 border border-loss/30 text-loss px-4 py-3 rounded-lg text-sm">
              {error}
              <button
                onClick={clearError}
                className="ml-2 font-semibold hover:underline"
              >
                Dismiss
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <LogIn size={18} />
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="pt-4 border-t border-white/10">
            <p className="text-xs text-muted-foreground text-center mb-3">
              Demo Credentials
            </p>
            <div className="space-y-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setEmail("demo@example.com");
                  setPassword("Demo123!@#");
                }}
                className="w-full text-left bg-card/50 hover:bg-card/80 p-2 rounded border border-white/10 transition-colors"
              >
                <span className="text-muted-foreground">Email:</span>{" "}
                <span className="text-foreground">demo@example.com</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail("demo@example.com");
                  setPassword("Demo123!@#");
                }}
                className="w-full text-left bg-card/50 hover:bg-card/80 p-2 rounded border border-white/10 transition-colors"
              >
                <span className="text-muted-foreground">Password:</span>{" "}
                <span className="text-foreground">Demo123!@#</span>
              </button>
            </div>
          </div>
        </GlassCard>

        {/* Sign Up Link */}
        <div className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary hover:underline font-semibold">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
