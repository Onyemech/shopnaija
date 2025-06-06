
import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AdminService } from "@/services/AdminService";
import { useQuery } from "@tanstack/react-query";

interface SubdomainRouterProps {
  children: ReactNode;
  adminContent: ReactNode;
}

const SubdomainRouter = ({ children, adminContent }: SubdomainRouterProps) => {
  const { subdomain, loading } = useAuth();

  // Only query for admin data if we have a valid subdomain that's not the main domain
  const { data: adminData, isLoading: adminLoading } = useQuery({
    queryKey: ['admin', subdomain],
    queryFn: () => AdminService.getAdminBySubdomain(subdomain!),
    enabled: !!subdomain && subdomain !== 'superadmin' && subdomain !== 'shopnaija',
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ShopNaija...</p>
        </div>
      </div>
    );
  }

  // If we have a subdomain that's not superadmin or the main domain
  if (subdomain && subdomain !== 'superadmin' && subdomain !== 'shopnaija') {
    if (adminLoading) {
      return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading store...</p>
          </div>
        </div>
      );
    }

    if (!adminData) {
      return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">ShopNaija</h1>
            <p className="text-xl text-gray-600 mb-8">Store not found</p>
            <p className="text-gray-500">The store you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
      );
    }

    if (!adminData.is_active) {
      return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">ShopNaija</h1>
            <p className="text-xl text-gray-600 mb-8">Account Inactive</p>
            <p className="text-gray-500">This store is temporarily unavailable.</p>
          </div>
        </div>
      );
    }

    // Return admin content for valid admin subdomains
    return <>{adminContent}</>;
  }

  // For main domain (no subdomain, superadmin subdomain, or shopnaija subdomain)
  return <>{children}</>;
};

export default SubdomainRouter;
