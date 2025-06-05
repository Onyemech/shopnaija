
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const handleCallback = () => {
      console.log("AuthCallback: Processing...", { user, loading });

      if (loading) {
        console.log("AuthCallback: Still loading, waiting...");
        return;
      }

      if (user) {
        console.log("AuthCallback: User found:", user.role);

        toast({
          title: "Authentication successful",
          description: `Welcome ${user.name}!`,
        });

        // Redirect based on role
        if (user.role === 'superadmin') {
          console.log("Redirecting superadmin to /dashboard");
          navigate("/dashboard", { replace: true });
        } else if (user.role === 'admin') {
          console.log("Redirecting admin to /admin/dashboard");
          navigate("/admin/dashboard", { replace: true });
        } else {
          console.log("Redirecting customer to home");
          navigate("/", { replace: true });
        }
      } else {
        console.log("AuthCallback: No user found");
        toast({
          title: "Authentication failed",
          description: "Please try logging in again.",
          variant: "destructive",
        });
        navigate("/auth", { replace: true });
      }
    };

    // Give auth state time to settle
    const timeoutId = setTimeout(handleCallback, 1000);
    
    return () => clearTimeout(timeoutId);
  }, [user, loading, navigate, toast]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Completing authentication...</h2>
        <p className="text-gray-600">Please wait while we verify your account.</p>
      </div>
    </div>
  );
};

export default AuthCallback;
