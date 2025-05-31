
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { user, subdomain } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Wait a moment for auth state to update
        setTimeout(() => {
          if (user) {
            toast({
              title: "Login successful",
              description: "Welcome to GrowthSmallBeez!",
            });

            // Redirect based on user role and subdomain
            console.log("User role:", user.role, "Subdomain:", subdomain);
            
            if (user.role === 'superadmin') {
              navigate("/dashboard");
            } else if (user.role === 'admin') {
              // Ensure admin goes to their subdomain
              if (subdomain && subdomain !== 'superadmin') {
                navigate("/admin/dashboard");
              } else {
                // If no subdomain or wrong subdomain, redirect to their subdomain
                const adminSubdomain = user.subdomain;
                if (adminSubdomain) {
                  window.location.href = `${window.location.protocol}//${window.location.host}/${adminSubdomain}/admin/dashboard`;
                } else {
                  navigate("/auth");
                }
              }
            } else {
              // Customer - redirect to store or home
              if (subdomain && subdomain !== 'superadmin') {
                navigate("/");
              } else {
                navigate("/");
              }
            }
          } else {
            toast({
              title: "Login failed",
              description: "Authentication was not successful.",
              variant: "destructive",
            });
            navigate("/auth");
          }
        }, 2000);
      } catch (error) {
        console.error("Auth callback error:", error);
        toast({
          title: "Authentication error",
          description: "Please try logging in again.",
          variant: "destructive",
        });
        navigate("/auth");
      }
    };

    handleCallback();
  }, [user, navigate, toast, subdomain]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Completing login...</h2>
        <p className="text-gray-600">Please wait while we complete your authentication.</p>
      </div>
    </div>
  );
};

export default AuthCallback;
