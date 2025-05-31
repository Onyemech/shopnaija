
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { user, subdomain } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Handle OAuth callback
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
            if (user.role === 'superadmin') {
              navigate("/dashboard");
            } else if (user.role === 'admin') {
              navigate("/admin/dashboard");
            } else {
              navigate("/");
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
  }, [user, navigate, toast]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Completing login...</h2>
        <p className="text-gray-600">Please wait while we complete your authentication.</p>
      </div>
    </div>
  );
};

export default AuthCallback;
