
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import React from "react";

// Pages
import Login from "./pages/Login";
import Home from "./pages/Home";
import ReportIncident from "./pages/ReportIncident";
import ViewIncidents from "./pages/ViewIncidents";
import EmergencySOS from "./pages/EmergencySOS";
import SafetyTips from "./pages/SafetyTips";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminReports from "./pages/AdminReports";
import AdminMap from "./pages/AdminMap";
import AdminAnalytics from "./pages/AdminAnalytics";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected route component for admin routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, isAdmin, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-safezone-purple text-xl">Loading...</div>
    </div>;
  }
  
  if (!currentUser || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <DataProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Routes>
                {/* Entry point - Login page */}
                <Route path="/" element={<Login />} />
                
                {/* User Routes */}
                <Route path="/home" element={<Home />} />
                <Route path="/report" element={<ReportIncident />} />
                <Route path="/incidents" element={<ViewIncidents />} />
                <Route path="/emergency" element={<EmergencySOS />} />
                <Route path="/safety-tips" element={<SafetyTips />} />
                
                {/* Admin Login */}
                <Route path="/admin/login" element={<AdminLogin />} />
                
                {/* Admin Protected Routes */}
                <Route path="/admin" element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin/reports" element={
                  <ProtectedRoute>
                    <AdminReports />
                  </ProtectedRoute>
                } />
                <Route path="/admin/map" element={
                  <ProtectedRoute>
                    <AdminMap />
                  </ProtectedRoute>
                } />
                <Route path="/admin/analytics" element={
                  <ProtectedRoute>
                    <AdminAnalytics />
                  </ProtectedRoute>
                } />
                
                {/* Catch-all for 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </DataProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
