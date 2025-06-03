
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
            console.log("User authenticated:", user.role, "Subdomain:", subdomain);
            
            // Show success message
            toast({
              title: "Login successful",
              description: `Welcome ${user.name}! Redirecting to your dashboard...`,
            });

            // Redirect based on user role
            if (user.role === 'superadmin') {
              console.log("Redirecting superadmin to dashboard");
              navigate("/dashboard");
            } else if (user.role === 'admin') {
              console.log("Redirecting admin to admin dashboard");
              // Check if admin has subdomain, if yes redirect to their admin area
              if (user.subdomain) {
                navigate("/admin/dashboard");
              } else {
                toast({
                  title: "Setup Required",
                  description: "Your admin account needs to be configured. Please contact support.",
                  variant: "destructive",
                });
                navigate("/");
              }
            } else {
              // Customer or unrecognized role
              console.log("Redirecting customer/other to home");
              if (subdomain && subdomain !== 'superadmin') {
                navigate("/");
              } else {
                navigate("/");
              }
            }
          } else {
            console.log("No user found after auth callback");
            toast({
              title: "Authentication failed",
              description: "Please try logging in again.",
              variant: "destructive",
            });
            navigate("/");
          }
        }, 1500); // Give auth state time to update
      } catch (error) {
        console.error("Auth callback error:", error);
        toast({
          title: "Authentication error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
        navigate("/");
      }
    };

    handleCallback();
  }, [user, navigate, toast, subdomain]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Completing authentication...</h2>
        <p className="text-gray-600">Please wait while we verify your account and redirect you.</p>
      </div>
    </div>
  );
};

export default AuthCallback;
