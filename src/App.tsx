
import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import LoadingFallback from "@/components/LoadingFallback";

// Lazy load components
const Index = React.lazy(() => import("./pages/Index"));
const Auth = React.lazy(() => import("./pages/Auth"));
const ForgotPassword = React.lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = React.lazy(() => import("./pages/ResetPassword"));
const AuthCallback = React.lazy(() => import("./pages/AuthCallback"));
const SuperAdminDashboard = React.lazy(() => import("./pages/SuperAdminDashboard"));

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/dashboard" element={<SuperAdminDashboard />} />
          </Routes>
        </Suspense>
        <Toaster />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
