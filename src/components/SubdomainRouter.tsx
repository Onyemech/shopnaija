import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface SubdomainRouterProps {
  children: ReactNode;
  adminContent: ReactNode;
}

const SubdomainRouter = ({ children, adminContent }: SubdomainRouterProps) => {
  const { subdomain, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // If we have a subdomain, show admin-specific content
  if (subdomain) {
    return <>{adminContent}</>;
  }

  // Otherwise, show main site content
  return <>{children}</>;
};

export default SubdomainRouter;
