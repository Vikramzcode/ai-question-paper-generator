import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider, useAuth } from "@/context/AuthContext";
import { WalletProvider } from "@/context/WalletContext";
import { AppProvider } from "@/context/AppContext";

import { AppLayout } from "@/components/common/AppLayout";

import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import VerifyEmail from "@/pages/VerifyEmail";
import Verify2FA from "@/pages/Verify2FA";
import Enable2FA from "@/pages/Enable2FA";
import Confirm2FA from "@/pages/Confirm2FA";
import Dashboard from "@/pages/Dashboard";

import Deposit from "@/pages/Deposit";
import Withdraw from "@/pages/Withdraw";
import RobotActivation from "@/pages/RobotActivation";
import Referral from "@/pages/Referral";
import History from "@/pages/History";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Auth Route Component (redirects to dashboard if already authenticated)
function AuthRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/landing" element={<Landing />} />

      {/* Auth Routes */}
      <Route
        path="/login"
        element={
          <AuthRoute>
            <Login />
          </AuthRoute>
        }
      />
      <Route
        path="/register"
        element={
          <AuthRoute>
            <Signup />
          </AuthRoute>
        }
      />
      {/* Verify-email is accessible after signup — not wrapped in AuthRoute */}
      <Route path="/verify-email" element={<VerifyEmail />} />
      {/* 2FA verification during login */}
      <Route path="/verify-2fa" element={<Verify2FA />} />

      {/* Protected Routes with Layout */}
      <Route
        element={
          isAuthenticated ? <AppLayout /> : <Navigate to="/login" replace />
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/wallet/deposit" element={<Deposit />} />
        <Route path="/wallet/withdraw" element={<Withdraw />} />
        <Route path="/robot/activate" element={<RobotActivation />} />
        <Route path="/referral" element={<Referral />} />
        <Route path="/history" element={<History />} />
        <Route path="/settings" element={<Settings />} />
        {/* 2FA setup pages - protected */}
        <Route path="/security/enable-2fa" element={<Enable2FA />} />
        <Route path="/security/confirm-2fa" element={<Confirm2FA />} />
      </Route>

      {/* Redirect root to dashboard if authenticated, otherwise to landing */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/landing" replace />
          )
        }
      />

      {/* 404 Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <WalletProvider>
            <AppProvider>
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
            </AppProvider>
          </WalletProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
