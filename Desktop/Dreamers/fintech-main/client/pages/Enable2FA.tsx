import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GlassCard } from "@/components/common/GlassCard";
import { apiClient } from "@/services/api";
import { Shield, Copy, Check, QrCode, Key } from "lucide-react";

export default function Enable2FA() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [secretKey, setSecretKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleEnable2FA = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.post("/auth/enable-2fa");
      const { qrCode, secret } = response.data;
      
      setQrCodeUrl(qrCode);
      setSecretKey(secret);
    } catch (err: any) {
      setError(err?.message || "Failed to enable 2FA. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopySecret = () => {
    if (secretKey) {
      navigator.clipboard.writeText(secretKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleContinue = () => {
    if (secretKey) {
      navigate("/security/confirm-2fa", { state: { secret: secretKey } });
    }
  };

  return (
    <main className="p-4 lg:p-8 lg:ml-64 min-h-screen">
      <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold mb-2">Enable Two-Factor Authentication</h1>
          <p className="text-muted-foreground">
            Add an extra layer of security to your account
          </p>
        </div>

        <GlassCard heavy className="p-8 space-y-6">
          {!qrCodeUrl ? (
            <>
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                  <Shield className="text-primary" size={40} />
                </div>
                <h2 className="text-2xl font-bold">Secure Your Account</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Two-factor authentication adds an additional layer of security to your account
                  by requiring more than just a password to log in.
                </p>
              </div>

              {error && (
                <div className="bg-loss/20 border border-loss/30 text-loss px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-card/50 rounded-lg border border-white/10">
                  <div className="text-3xl">📱</div>
                  <div>
                    <h3 className="font-semibold mb-1">Step 1: Get the App</h3>
                    <p className="text-sm text-muted-foreground">
                      Download an authenticator app like Google Authenticator or Authy on your mobile device.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-card/50 rounded-lg border border-white/10">
                  <div className="text-3xl">🔍</div>
                  <div>
                    <h3 className="font-semibold mb-1">Step 2: Scan QR Code</h3>
                    <p className="text-sm text-muted-foreground">
                      Click the button below to generate your QR code and secret key.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-card/50 rounded-lg border border-white/10">
                  <div className="text-3xl">✅</div>
                  <div>
                    <h3 className="font-semibold mb-1">Step 3: Verify</h3>
                    <p className="text-sm text-muted-foreground">
                      Enter the 6-digit code from your app to complete setup.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleEnable2FA}
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  "Generating..."
                ) : (
                  <>
                    <Shield size={20} />
                    Generate 2FA Setup
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                  <QrCode className="text-primary" size={40} />
                </div>
                <h2 className="text-2xl font-bold">Scan QR Code</h2>
                <p className="text-muted-foreground">
                  Use your authenticator app to scan this QR code
                </p>
              </div>

              {/* QR Code Display */}
              <div className="flex justify-center p-6 bg-white rounded-lg">
                <img 
                  src={qrCodeUrl} 
                  alt="2FA QR Code" 
                  className="w-64 h-64"
                />
              </div>

              {/* Manual Entry Key */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Key size={16} />
                  <span className="font-semibold">Can't scan? Enter this key manually:</span>
                </div>
                
                <div className="flex items-center gap-2 p-4 bg-card/50 rounded-lg border border-white/10">
                  <code className="flex-1 text-sm font-mono break-all text-foreground">
                    {secretKey}
                  </code>
                  <button
                    onClick={handleCopySecret}
                    className="p-2 hover:bg-card rounded transition-colors"
                    title="Copy to clipboard"
                  >
                    {copied ? (
                      <Check size={18} className="text-profit" />
                    ) : (
                      <Copy size={18} className="text-muted-foreground" />
                    )}
                  </button>
                </div>

                <div className="text-xs text-muted-foreground bg-card/30 p-3 rounded border border-white/10">
                  <p className="font-semibold mb-1">💡 How to enter manually:</p>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Open your authenticator app</li>
                    <li>Select "Enter a setup key" or "Manual entry"</li>
                    <li>Enter account name: <span className="text-foreground font-mono">TradePro</span></li>
                    <li>Paste or type the key above</li>
                    <li>Select "Time-based" option</li>
                  </ol>
                </div>
              </div>

              <button
                onClick={handleContinue}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                Continue to Verification
                <Check size={20} />
              </button>

              <p className="text-xs text-center text-muted-foreground">
                A backup copy of the QR code has also been sent to your email
              </p>
            </>
          )}
        </GlassCard>
      </div>
    </main>
  );
}
