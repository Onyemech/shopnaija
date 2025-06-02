
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AuthService } from "@/services/AuthService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, MessageCircle, Bell, Store, CreditCard, Phone } from "lucide-react";
import { NotificationDropdown } from "@/components/NotificationDropdown";

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

  const handleGetStarted = () => {
    const whatsappMessage = encodeURIComponent(
      "Hello! I want to register as an admin on GrowthSmallBeez. Please help me set up my store with the following details: Name, Phone, Email, NIN, Account Name, Account Number, Bank Name, Website Name, and Subdomain."
    );
    window.open(`https://wa.me/+2348158025887?text=${whatsappMessage}`, '_blank');
  };

  const handleForgotPassword = () => {
    // For now, redirect to a general forgot password page
    // In the future, this will be subdomain-specific
    navigate("/forgot-password");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold" style={{ color: '#00A862' }}>
              GrowthSmallBeez
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content - Single Column */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Grow Your 
            <span className="block" style={{ color: '#00A862' }}>Small Business</span>
            with GrowthSmallBeez
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            The all-in-one platform for Nigerian entrepreneurs to create beautiful online stores, 
            manage inventory, process payments, and grow their business online.
          </p>
        </div>

        {/* Get Started Button */}
        <div className="text-center mb-12">
          <Button 
            onClick={handleGetStarted}
            size="lg"
            className="text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
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
        <div className="flex justify-center mb-12">
          <Card className="w-full max-w-md shadow-lg border border-gray-200">
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold text-gray-900 flex-1">
                  Admin Login
                </CardTitle>
                <NotificationDropdown />
              </div>
              <p className="text-gray-600">
                Access your store dashboard
              </p>
            </CardHeader>
            <CardContent>
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
        </div>

        {/* Feature Icons Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Why Choose GrowthSmallBeez?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center">
              <div 
                className="rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: '#00A862', opacity: 0.1 }}
              >
                <Store size={32} style={{ color: '#00A862' }} />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Online Store</h4>
              <p className="text-gray-600 text-sm">
                Beautiful, mobile-responsive stores for your products
              </p>
            </div>
            <div className="text-center">
              <div 
                className="rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: '#00A862', opacity: 0.1 }}
              >
                <CreditCard size={32} style={{ color: '#00A862' }} />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Secure Payments</h4>
              <p className="text-gray-600 text-sm">
                Accept payments safely with Paystack integration
              </p>
            </div>
            <div className="text-center">
              <div 
                className="rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: '#00A862', opacity: 0.1 }}
              >
                <Phone size={32} style={{ color: '#00A862' }} />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">WhatsApp Orders</h4>
              <p className="text-gray-600 text-sm">
                Connect with customers directly via WhatsApp
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 mt-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
          <div className="text-center">
            <p className="text-gray-600">
              © 2024 GrowthSmallBeez. Empowering Nigerian entrepreneurs to grow their businesses online.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
