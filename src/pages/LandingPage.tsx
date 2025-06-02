
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AuthService } from "@/services/AuthService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, MessageCircle, Mail, Github } from "lucide-react";

const LandingPage = () => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
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

      // Get current user to check role and subdomain
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

  const handleGetStarted = () => {
    const whatsappMessage = encodeURIComponent(
      "Hello! I want to register as an admin on GrowthSmallBeez. Please help me set up my store with the following details: Name, Phone, Email, NIN, Account Name, Account Number, Bank Name, Website Name, and Subdomain."
    );
    window.open(`https://wa.me/+2348158025887?text=${whatsappMessage}`, '_blank');
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-md mx-auto px-4 sm:px-6 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold" style={{ color: '#00A862' }}>
              GrowthSmallBeez
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content - Single Column */}
      <main className="max-w-md mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Grow Your 
            <span className="block" style={{ color: '#00A862' }}>Small Business</span>
          </h1>
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            The all-in-one platform for Nigerian entrepreneurs to create beautiful online stores and grow their business online.
          </p>
        </div>

        {/* Get Started Button for Superadmin Registration */}
        <div className="text-center">
          <Button 
            onClick={handleGetStarted}
            size="lg"
            className="w-full text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            style={{ backgroundColor: '#00A862' }}
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Get Started - Register Your Store
          </Button>
          <p className="text-sm text-gray-500 mt-3">
            Contact us on WhatsApp to set up your online store
          </p>
        </div>

        {/* Admin Login Form */}
        <Card className="shadow-lg border border-gray-200">
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

        {/* Footer */}
        <footer className="text-center pt-8">
          <p className="text-gray-600 text-sm">
            © 2024 GrowthSmallBeez. Empowering Nigerian entrepreneurs to grow their businesses online.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default LandingPage;
