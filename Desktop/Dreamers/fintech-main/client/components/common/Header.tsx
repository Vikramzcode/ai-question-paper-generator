import { useAuth } from "@/context/AuthContext";
import { StatusBadge } from "./StatusBadge";
import { Bell, User, Sun, Moon } from "lucide-react";

interface HeaderProps {
  isDarkMode: boolean;
  onToggleDarkMode: (isDark: boolean) => void;
}

export function Header({ isDarkMode, onToggleDarkMode }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-20 bg-background/80 backdrop-blur border-b border-border transition-all duration-300">
      <div className="flex items-center justify-between p-4 lg:pl-72">
        <div>
          <h2 className="text-sm text-muted-foreground transition-colors duration-300">Welcome back</h2>
          <p className="text-lg font-semibold transition-colors duration-300">{user?.name || "Trader"}</p>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <StatusBadge
              status={user.accountStatus === "ACTIVE" ? "active" :"pending"}
            />
          )}

          <button className="p-2 hover:bg-card rounded-lg transition-all duration-300" title="Notifications">
            <Bell size={20} className="text-muted-foreground transition-colors duration-300" />
          </button>

          <button
            onClick={() => onToggleDarkMode(!isDarkMode)}
            className="p-2 hover:bg-card rounded-lg transition-all duration-300"
            title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? (
              <Sun size={20} className="text-amber-400 transition-colors duration-300" />
            ) : (
              <Moon size={20} className="text-indigo-500 transition-colors duration-300" />
            )}
          </button>

          <button className="p-2 hover:bg-card rounded-lg transition-all duration-300" title="Profile">
            <User size={20} className="text-muted-foreground transition-colors duration-300" />
          </button>
        </div>
      </div>
    </header>
  );
}
