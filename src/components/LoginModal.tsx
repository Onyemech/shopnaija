
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "@/services/AuthService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, MessageCircle, Mail, Github, X } from "lucide-react";

interface LoginModalProps {
  children: React.ReactNode;
}

const LoginModal = ({ children }: LoginModalProps) => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const isEmail = emailOrPhone.includes('@');
      
      if (isEmail) {
        await AuthService.signIn(emailOrPhone, password);
      } else {
        await AuthService.signInWithPhone(emailOrPhone, password);
      }

      const user = await AuthService.getCurrentUser();
      
      if (user && user.role === 'admin' && user.subdomain) {
        navigate(`/${user.subdomain}/admin`);
        toast({
          title: "Login successful",
          description: "Welcome to your admin dashboard!",
        });
      } else if (user && user.role === 'superadmin') {
        navigate("/dashboard");
        toast({
          title: "Login successful",
          description: "Welcome to GrowthSmallBeez superadmin!",
        });
      } else {
        toast({
          title: "Access denied",
          description: "This login is for admins only.",
          variant: "destructive",
        });
      }
      setOpen(false);
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github' | 'twitter') => {
    setLoading(true);
    try {
      await AuthService.signInWithOAuth(provider);
    } catch (error: any) {
      toast({
        title: "Social login failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <Card className="border-0 shadow-none">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Admin Login
            </CardTitle>
            <p className="text-gray-600">
              Access your store dashboard
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Social Login Buttons */}
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 text-base border-gray-300 hover:bg-gray-50"
                onClick={() => handleSocialLogin('google')}
                disabled={loading}
              >
                <Mail className="mr-2 h-5 w-5" />
                Continue with Google
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 text-base border-gray-300 hover:bg-gray-50"
                onClick={() => handleSocialLogin('github')}
                disabled={loading}
              >
                <Github className="mr-2 h-5 w-5" />
                Continue with GitHub
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Email/Phone Login Form */}
            <form onSubmit={handleAdminLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="emailOrPhone" className="text-sm font-medium text-gray-700">
                  Email or Phone Number
                </Label>
                <Input
                  id="emailOrPhone"
                  type="text"
                  placeholder="admin@example.com or 08012345678"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  required
                  className="h-12 text-base border-gray-300 focus:border-green-600 focus:ring-green-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 text-base border-gray-300 focus:border-green-600 focus:ring-green-600"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 text-white font-semibold text-base rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                style={{ backgroundColor: '#00A862' }}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In to Dashboard"
                )}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <button 
                onClick={handleForgotPassword}
                className="text-sm font-medium hover:underline"
                style={{ color: '#00A862' }}
              >
                Forgot your password?
              </button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
