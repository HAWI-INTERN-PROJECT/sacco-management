import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { useAuthStore } from "./stores/auth";
import ErrorBoundary from "./components/ErrorBoundary";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import NotFoundPage from "./pages/NotFoundPage";
import { useEffect, useState } from "react";

import { SuperAdminLayout } from "./layouts/super-admin/SuperAdminLayout";
import { SuperAdminDashboardPage } from "./pages/super-admin/SuperAdminDashboardPage";
import { ManageSaccosPage } from "./pages/super-admin/ManageSaccosPage";
import { SaccoDetailsPage } from "./pages/super-admin/SaccoDetailsPage";
import PublicLayout from "./components/PublicLayout";
import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import ContactPage from "./pages/ContactPage";
import { MemberLayout } from "./layouts/member/Memberlayout";
import { MemberDashboardPage } from "./pages/member/Memberdashboardpage";
import Savings from "./pages/member/Savings";
import Dividends from "./pages/member/Dividends";
import Loans from "./pages/member/Loans";
import Notifications from "./pages/member/Notifications";
import Payments from "./pages/member/Payments";
import Statements from "./pages/member/Statements";
//import ApplayLoan from "./pages/member/ApplayLoan";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
function MemberRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== "member") {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}
function SuperAdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (
    user?.role !== "superadmin" &&
    user?.username !== "superadmin" &&
    user?.email !== "superadmin@example.com"
  ) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}
function GuestRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuthStore();
  if (isAuthenticated) {
    if (
      user?.role === "superadmin" ||
      user?.username === "superadmin" ||
      user?.email === "superadmin@example.com"
    ) {
      return <Navigate to="/super-admin" replace />;
    }
    if (
      user?.role === "member" ||
      user?.username === "member" ||
      user?.email === "member@example.com"
    ) {
      return <Navigate to="/member" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  const token = useAuthStore((s) => s.token);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      if (token) {
        try {
          await useAuthStore.getState().getProfile();
        } catch {
          // The token is already invalid. Clear local state instead of making a
          // second request that can keep the app in its loading state.
          localStorage.removeItem("token");
          useAuthStore.setState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      }
      setIsBootstrapping(false);
    };
    bootstrap();
  }, []);

  if (isBootstrapping) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ErrorBoundary>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Route>
            <Route
              path="/login"
              element={
                <GuestRoute>
                  <LoginPage />
                </GuestRoute>
              }
            />
            <Route
              path="/register"
              element={
                <GuestRoute>
                  <RegisterPage />
                </GuestRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Super Admin Routes */}
            <Route
              path="/super-admin"
              element={
                <SuperAdminRoute>
                  <SuperAdminLayout />
                </SuperAdminRoute>
              }
            >
              <Route index element={<SuperAdminDashboardPage />} />
              <Route path="saccos" element={<ManageSaccosPage />} />
              <Route path="saccos/:id" element={<SaccoDetailsPage />} />
              <Route path="members" element={<ManageSaccosPage />} />
              <Route path="loans" element={<ManageSaccosPage />} />
              <Route path="savings" element={<ManageSaccosPage />} />
              <Route path="accounts" element={<ManageSaccosPage />} />
              <Route path="reports" element={<ManageSaccosPage />} />
              <Route path="settings" element={<SuperAdminDashboardPage />} />
              <Route path="support" element={<SuperAdminDashboardPage />} />
            </Route>
            {/* Member Routes */}
            <Route
              path="/member"
              element={
                <MemberRoute>
                  <MemberLayout />
                </MemberRoute>
              }
            >
              {" "}
              <Route index element={<MemberDashboardPage />} />
              {/* Add these as you build them: */}
              <Route path="savings" element={<Savings />} />
              <Route path="loans" element={<Loans />} />
              <Route path="dividends" element={<Dividends />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="payments" element={<Payments />} />
              <Route path="statements" element={<Statements />} />
              <Route path="statements" element={<Statements />} />
              {/**<Route path="profile" element={<pr/>} /> **/}
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
}
