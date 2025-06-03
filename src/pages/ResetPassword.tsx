
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import PasswordResetCard from "@/components/PasswordResetCard";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if we have the required tokens
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    
    if (!accessToken || !refreshToken) {
      toast({
        title: "Invalid reset link",
        description: "Please request a new password reset email.",
        variant: "destructive",
      });
      navigate("/forgot-password");
    }
  }, [searchParams, navigate, toast]);

  return <PasswordResetCard />;
};

export default ResetPassword;
