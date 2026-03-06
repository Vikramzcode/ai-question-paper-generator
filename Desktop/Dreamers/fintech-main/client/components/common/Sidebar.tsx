import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useApp } from "@/context/AppContext";
import {
  BarChart3,
  Wallet,
  TrendingUp,
  Users,
  History,
  Settings,
  LogOut,
  Menu,
  Bot,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
  },
  {
    label: "Deposit",
    href: "/wallet/deposit",
    icon: Wallet,
  },
  {
    label: "Withdraw",
    href: "/wallet/withdraw",
    icon: TrendingUp,
  },
  {
    label: "Activate Robot",
    href: "/robot/activate",
    icon: Bot,
  },
  {
    label: "Referral",
    href: "/referral",
    icon: Users,
  },
  {
    label: "History",
    href: "/history",
    icon: History,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { setActivationModalOpen } = useApp();

  const handleNav = (href: string, label: string) => {
    if (
      (label === "Deposit" || label === "Withdraw" || label === "Activate Robot") &&
      user?.accountStatus === "inactive"
    ) {
      setActivationModalOpen(true);
    } else {
      navigate(href);
    }

    if (window.innerWidth < 1024) {
      onToggle();
    }
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-40 lg:hidden bg-card/80 p-2 rounded-lg border border-white/10 hover:bg-card transition-colors duration-300"
      >
        <Menu size={20} />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden transition-all duration-300"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-border transition-all duration-300 z-40 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-bold text-slate-900">TradePro</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Professional Trading Platform
          </p>
        </div>

        <nav className="flex flex-col gap-1 p-4 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            const isActionItem =
              item.label === "Deposit" || item.label === "Withdraw";

            return (
              <div
                key={item.href}
                onClick={() => handleNav(item.href, item.label)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium cursor-pointer",
                  isActive
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "text-foreground hover:bg-sidebar-accent"
                )}
              >
                <Icon size={18} />
                {item.label}
              </div>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => {
              logout();
              onToggle();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-sidebar-accent transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
