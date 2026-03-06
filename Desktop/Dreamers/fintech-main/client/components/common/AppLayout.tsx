import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useApp } from "@/context/AppContext";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { WalletActivationModal } from "./WalletActivationModal";

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("appDarkMode");
    return saved !== null ? JSON.parse(saved) : true;
  });
  const { isAuthenticated, user } = useAuth();
  const { setActivationModalOpen, hasSkippedActivation } = useApp();

  useEffect(() => {
    localStorage.setItem("appDarkMode", JSON.stringify(isDarkMode));

    const htmlElement = document.documentElement;

    // Apply/remove dark and light-mode classes
    if (isDarkMode) {
      htmlElement.classList.add("dark");
      htmlElement.classList.remove("light-mode");
    } else {
      htmlElement.classList.remove("dark");
      htmlElement.classList.add("light-mode");
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (
      isAuthenticated &&
      user?.accountStatus === "inactive" &&
      !hasSkippedActivation
    ) {
      setActivationModalOpen(true);
    }
  }, [isAuthenticated, user, hasSkippedActivation, setActivationModalOpen]);

  if (!isAuthenticated) {
    return <Outlet />;
  }

  return (
    <div className="flex w-full h-full transition-colors duration-300">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex flex-col min-h-screen">
        <Header isDarkMode={isDarkMode} onToggleDarkMode={setIsDarkMode} />
        <main className="flex-1 transition-colors duration-300">
          <Outlet />
        </main>
      </div>
      <WalletActivationModal />
    </div>
  );
}
