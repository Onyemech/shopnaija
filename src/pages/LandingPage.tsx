
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Store, Users, ShoppingCart, Smartphone, MessageCircle } from "lucide-react";

const LandingPage = () => {
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Here you would typically send the form data to your backend
      // For now, we'll just show a success message
      toast({
        title: "Message sent!",
        description: "Thank you for contacting us. We'll get back to you soon.",
      });
      
      setContactForm({ name: "", email: "", message: "" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGetStarted = () => {
    window.open("https://wa.me/+2348158025887", "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Store className="h-8 w-8 text-brand-600" />
              <h1 className="text-2xl font-bold text-gray-900">GrowthSmallBeez</h1>
            </div>
            <Button 
              onClick={handleGetStarted}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Your Complete 
            <span className="text-brand-600"> E-commerce Solution</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Launch your online store in minutes with GrowthSmallBeez. Get a professional website, 
            payment processing, and everything you need to sell online in Nigeria.
          </p>
          <Button 
            onClick={handleGetStarted}
            size="lg"
            className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-4 text-lg"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            Start Selling Today
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Why Choose GrowthSmallBeez?</h3>
            <p className="text-lg text-gray-600">Everything you need to grow your business online</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Store className="h-12 w-12 text-brand-600 mx-auto mb-4" />
                <CardTitle>Professional Store</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Get a beautiful, mobile-responsive online store that converts visitors into customers.</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <ShoppingCart className="h-12 w-12 text-brand-600 mx-auto mb-4" />
                <CardTitle>Easy Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Manage products, orders, and customers from one simple dashboard.</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Smartphone className="h-12 w-12 text-brand-600 mx-auto mb-4" />
                <CardTitle>Mobile Optimized</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Your store works perfectly on all devices, ensuring customers can shop anywhere.</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-brand-600 mx-auto mb-4" />
                <CardTitle>Customer Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Get help when you need it with our dedicated customer support team.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Get In Touch</h3>
            <p className="text-lg text-gray-600">Have questions? We'd love to hear from you.</p>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
              <CardDescription>
                Send us a message and we'll get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="Your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="your@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    required
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Tell us how we can help you..."
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-brand-600 hover:bg-brand-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Store className="h-8 w-8 text-brand-400" />
              <h4 className="text-2xl font-bold">GrowthSmallBeez</h4>
            </div>
            <p className="text-gray-400 mb-4">Empowering small businesses to grow online</p>
            <p className="text-sm text-gray-500">
              © 2024 GrowthSmallBeez. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
