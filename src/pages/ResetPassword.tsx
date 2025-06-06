
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import PasswordResetCard from "@/components/PasswordResetCard";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isValidLink, setIsValidLink] = useState(false);

  useEffect(() => {
    // Check for tokens in both URL hash and query params
    const hash = window.location.hash;
    const hashParams = new URLSearchParams(hash.substring(1));
    
    const accessToken = searchParams.get('access_token') || hashParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token') || hashParams.get('refresh_token');
    const type = searchParams.get('type') || hashParams.get('type');
    
    console.log('Reset password tokens:', { accessToken: !!accessToken, refreshToken: !!refreshToken, type });
    
    if (!accessToken || type !== 'recovery') {
      console.log('Invalid reset link - missing tokens or wrong type');
      toast({
        title: "Invalid reset link",
        description: "Please request a new password reset email.",
        variant: "destructive",
      });
      setTimeout(() => {
        navigate("/forgot-password", { replace: true });
      }, 3000);
    } else {
      console.log('Valid reset link found');
      setIsValidLink(true);
    }
  }, [searchParams, navigate, toast]);

  if (!isValidLink) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Validating reset link...</h2>
          <p className="text-gray-600">Please wait while we verify your password reset request.</p>
        </div>
      </div>
    );
  }

  return <PasswordResetCard />;
};

export default ResetPassword;
