
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AuthService } from "@/services/AuthService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, Github } from "lucide-react";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [userType, setUserType] = useState<'customer' | 'admin'>('customer');
  
  // Form states
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  
  const { subdomain } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const isAdminSubdomain = subdomain && subdomain !== 'superadmin';
  const isSuperAdminSubdomain = subdomain === 'superadmin';

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await AuthService.signIn(email, password);
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      // Redirect based on user role and subdomain
      if (isSuperAdminSubdomain) {
        navigate("/dashboard");
      } else if (isAdminSubdomain) {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await AuthService.signInWithPhone(phone, password);
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      navigate("/");
    } catch (error: any) {
      console.error("Phone login error:", error);
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await AuthService.signUp(email, password, {
        name,
        role: 'customer'
      });
      
      toast({
        title: "Account created",
        description: "Please check your email for verification link.",
      });
      
      setAuthMode('login');
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Signup failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await AuthService.signUpWithPhone(phone, password, {
        name,
        role: 'customer'
      });
      
      toast({
        title: "Account created",
        description: "Please check your phone for verification code.",
      });
      
      setAuthMode('login');
    } catch (error: any) {
      console.error("Phone signup error:", error);
      toast({
        title: "Signup failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github' | 'twitter') => {
    setIsLoading(true);

    try {
      await AuthService.signInWithOAuth(provider);
    } catch (error: any) {
      console.error("Social login error:", error);
      toast({
        title: "Social login failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getBrandingTitle = () => {
    if (isSuperAdminSubdomain) return "ShopNaija Admin";
    if (isAdminSubdomain) return `${subdomain} Store`;
    return "ShopNaija";
  };

  const getBrandingDescription = () => {
    if (isSuperAdminSubdomain) return "Super Admin Portal";
    if (isAdminSubdomain) return "Admin Dashboard";
    return "Your Nigerian Marketplace";
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-brand-800">
              {getBrandingTitle()}
            </CardTitle>
            <CardDescription>
              {getBrandingDescription()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={authMode} onValueChange={(value) => setAuthMode(value as 'login' | 'signup')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                {/* Admin Social Login Options */}
                {(isSuperAdminSubdomain || isAdminSubdomain) && (
                  <div className="space-y-3">
                    <div className="text-center text-sm text-gray-600 mb-4">
                      Admin Login - Use social accounts only
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => handleSocialLogin('google')}
                      disabled={isLoading}
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Continue with Google
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => handleSocialLogin('github')}
                      disabled={isLoading}
                    >
                      <Github className="mr-2 h-4 w-4" />
                      Continue with GitHub
                    </Button>
                  </div>
                )}

                {/* Customer Login Options */}
                {!isSuperAdminSubdomain && !isAdminSubdomain && (
                  <>
                    <Tabs value={loginMethod} onValueChange={(value) => setLoginMethod(value as 'email' | 'phone')}>
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="email">Email</TabsTrigger>
                        <TabsTrigger value="phone">Phone</TabsTrigger>
                      </TabsList>

                      <TabsContent value="email">
                        <form onSubmit={handleEmailLogin} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="email@example.com"
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                              id="password"
                              type="password"
                              placeholder="••••••••"
                              required
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                          </div>
                          <Button
                            type="submit"
                            className="w-full bg-brand-800 hover:bg-brand-700"
                            disabled={isLoading}
                          >
                            {isLoading ? "Logging in..." : "Login with Email"}
                          </Button>
                        </form>
                      </TabsContent>

                      <TabsContent value="phone">
                        <form onSubmit={handlePhoneLogin} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                              id="phone"
                              type="tel"
                              placeholder="+234XXXXXXXXXX"
                              required
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="password-phone">Password</Label>
                            <Input
                              id="password-phone"
                              type="password"
                              placeholder="••••••••"
                              required
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                          </div>
                          <Button
                            type="submit"
                            className="w-full bg-brand-800 hover:bg-brand-700"
                            disabled={isLoading}
                          >
                            {isLoading ? "Logging in..." : "Login with Phone"}
                          </Button>
                        </form>
                      </TabsContent>
                    </Tabs>
                  </>
                )}
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                {(isSuperAdminSubdomain || isAdminSubdomain) && (
                  <div className="text-center text-sm text-gray-600">
                    Admin accounts are created by super admins only.
                  </div>
                )}

                {!isSuperAdminSubdomain && !isAdminSubdomain && (
                  <Tabs value={loginMethod} onValueChange={(value) => setLoginMethod(value as 'email' | 'phone')}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="email">Email</TabsTrigger>
                      <TabsTrigger value="phone">Phone</TabsTrigger>
                    </TabsList>

                    <TabsContent value="email">
                      <form onSubmit={handleEmailSignup} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="signup-name">Full Name</Label>
                          <Input
                            id="signup-name"
                            type="text"
                            placeholder="Your full name"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="signup-email">Email</Label>
                          <Input
                            id="signup-email"
                            type="email"
                            placeholder="email@example.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="signup-password">Password</Label>
                          <Input
                            id="signup-password"
                            type="password"
                            placeholder="••••••••"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirm Password</Label>
                          <Input
                            id="confirm-password"
                            type="password"
                            placeholder="••••••••"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                          />
                        </div>
                        <Button
                          type="submit"
                          className="w-full bg-brand-800 hover:bg-brand-700"
                          disabled={isLoading}
                        >
                          {isLoading ? "Creating account..." : "Create Account"}
                        </Button>
                      </form>
                    </TabsContent>

                    <TabsContent value="phone">
                      <form onSubmit={handlePhoneSignup} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="signup-name-phone">Full Name</Label>
                          <Input
                            id="signup-name-phone"
                            type="text"
                            placeholder="Your full name"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="signup-phone">Phone Number</Label>
                          <Input
                            id="signup-phone"
                            type="tel"
                            placeholder="+234XXXXXXXXXX"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="signup-password-phone">Password</Label>
                          <Input
                            id="signup-password-phone"
                            type="password"
                            placeholder="••••••••"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password-phone">Confirm Password</Label>
                          <Input
                            id="confirm-password-phone"
                            type="password"
                            placeholder="••••••••"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                          />
                        </div>
                        <Button
                          type="submit"
                          className="w-full bg-brand-800 hover:bg-brand-700"
                          disabled={isLoading}
                        >
                          {isLoading ? "Creating account..." : "Create Account"}
                        </Button>
                      </form>
                    </TabsContent>
                  </Tabs>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="text-center text-sm text-gray-600">
            <div className="w-full">
              <a href="/forgot-password" className="text-brand-800 hover:underline">
                Forgot your password?
              </a>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
