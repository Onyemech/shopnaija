
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AuthService } from "@/services/AuthService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, MessageCircle } from "lucide-react";

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

  const handleSuperadminRegistration = () => {
    const whatsappMessage = encodeURIComponent(
      "Hello! I want to register as an admin on GrowthSmallBeez. Please help me set up my store with the following details: Name, Phone, Email, NIN, Account Name, Account Number, Bank Name, Website Name, and Subdomain."
    );
    window.open(`https://wa.me/+2348158025887?text=${whatsappMessage}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-green-600">GrowthSmallBeez</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Hero Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Grow Your 
              <span className="text-green-600 block">Small Business</span>
              with GrowthSmallBeez
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              The all-in-one platform for Nigerian entrepreneurs to create beautiful online stores, 
              manage inventory, process payments, and grow their business online.
            </p>
            
            {/* Superadmin Registration Button */}
            <div className="mb-8">
              <Button 
                onClick={handleSuperadminRegistration}
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Get Started - Register Your Store
              </Button>
              <p className="text-sm text-gray-500 mt-2">
                Contact us on WhatsApp to set up your online store
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏪</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Online Store</h3>
                <p className="text-gray-600 text-sm">Beautiful, mobile-responsive stores for your products</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💳</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Secure Payments</h3>
                <p className="text-gray-600 text-sm">Accept payments safely with Paystack integration</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📱</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">WhatsApp Orders</h3>
                <p className="text-gray-600 text-sm">Connect with customers directly via WhatsApp</p>
              </div>
            </div>
          </div>

          {/* Right Side - Admin Login Form */}
          <div className="flex justify-center lg:justify-end">
            <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Admin Login
                </CardTitle>
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
                      className="h-12 text-base border-gray-300 focus:border-green-500 focus:ring-green-500"
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
                      className="h-12 text-base border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold text-base rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
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
                    onClick={() => navigate("/forgot-password")}
                    className="text-sm text-green-600 hover:text-green-700 font-medium hover:underline"
                  >
                    Forgot your password?
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
