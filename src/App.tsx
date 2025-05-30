
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Pages
import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import SubdomainRouter from "./components/SubdomainRouter";
import DashboardLayout from "./components/DashboardLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route 
              path="/" 
              element={
                <SubdomainRouter 
                  // Root domain or superadmin subdomain shows landing page
                  children={<LandingPage />} 
                  // Admin subdomains show store frontend
                  adminContent={
                    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                      <div className="text-center">
                        <h1 className="text-4xl font-bold text-brand-800 mb-4">ShopNaija Store</h1>
                        <p className="text-xl text-gray-600 mb-8">Welcome to our store!</p>
                        <p className="text-gray-500">Store frontend coming soon...</p>
                      </div>
                    </div>
                  } 
                />
              } 
            />

            <Route path="/login" element={<Login />} />

            {/* Super Admin Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requiredRole="superadmin">
                  <DashboardLayout>
                    <SuperAdminDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requiredRole="admin">
                  <DashboardLayout>
                    <AdminDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* 404 fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
