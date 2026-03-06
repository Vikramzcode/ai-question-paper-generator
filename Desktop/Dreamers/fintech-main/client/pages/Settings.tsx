import { useAuth } from "@/context/AuthContext";
import { GlassCard } from "@/components/common/GlassCard";
import { User, Lock, Bell, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <main className="p-4 lg:p-8 lg:ml-64 min-h-screen">
      <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and preferences
          </p>
        </div>

        {/* Account Settings */}
        <GlassCard heavy className="p-8 space-y-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <User size={20} />
            Account Settings
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                defaultValue={user?.name}
                className="w-full bg-input border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                defaultValue={user?.email}
                className="w-full bg-input border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                disabled
              />
            </div>
          </div>

          <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-2 rounded-lg transition-colors">
            Save Changes
          </button>
        </GlassCard>

        {/* Security Settings */}
        <GlassCard heavy className="p-8 space-y-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Lock size={20} />
            Security
          </h3>

          <button className="w-full text-left p-4 bg-card/50 hover:bg-card border border-white/10 rounded-lg transition-colors flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">Change Password</p>
              <p className="text-xs text-muted-foreground mt-1">
                Update your password regularly
              </p>
            </div>
            <span className="text-muted-foreground">→</span>
          </button>

          <button
            onClick={() => navigate("/security/enable-2fa")}
            className="w-full text-left p-4 bg-card/50 hover:bg-card border border-white/10 rounded-lg transition-colors flex items-center justify-between"
          >
            <div>
              <p className="font-semibold text-sm">Two-Factor Authentication</p>
              <p className="text-xs text-muted-foreground mt-1">
                Add an extra layer of security
              </p>
            </div>
            <span className="text-muted-foreground">→</span>
          </button>
        </GlassCard>

        {/* Notification Settings */}
        <GlassCard heavy className="p-8 space-y-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Bell size={20} />
            Notifications
          </h3>

          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded" />
              <div>
                <p className="font-medium text-sm">Email Notifications</p>
                <p className="text-xs text-muted-foreground">
                  Receive updates about your account
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded" />
              <div>
                <p className="font-medium text-sm">Profit Updates</p>
                <p className="text-xs text-muted-foreground">
                  Get notified when you earn profits
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="rounded" />
              <div>
                <p className="font-medium text-sm">Weekly Digest</p>
                <p className="text-xs text-muted-foreground">
                  Summary of your weekly activity
                </p>
              </div>
            </label>
          </div>
        </GlassCard>

        {/* Danger Zone */}
        <GlassCard heavy className="p-8 space-y-6 border-loss/30">
          <h3 className="text-lg font-semibold text-loss">Danger Zone</h3>

          <button
            onClick={() => {
              if (
                window.confirm(
                  "Are you sure you want to logout? You will need to sign in again."
                )
              ) {
                logout();
              }
            }}
            className="w-full text-left p-4 bg-loss/20 hover:bg-loss/30 border border-loss/30 rounded-lg transition-colors flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <LogOut size={18} className="text-loss" />
              <div>
                <p className="font-semibold text-sm text-loss">Logout</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Sign out from your account
                </p>
              </div>
            </div>
            <span className="text-loss">→</span>
          </button>
        </GlassCard>
      </div>
    </main>
  );
}
