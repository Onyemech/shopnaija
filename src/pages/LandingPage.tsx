
import { useEffect } from "react";
import { CheckCircle, Users, ShoppingBag, TrendingUp, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";

const LandingPage = () => {
  const { toast } = useToast();

  // Auto-refresh functionality
  useEffect(() => {
    const refreshTimeout = setTimeout(() => {
      window.location.reload();
    }, 30000); // Refresh after 30 seconds of inactivity

    // Clear timeout on component unmount or user activity
    const handleActivity = () => {
      clearTimeout(refreshTimeout);
    };

    window.addEventListener('click', handleActivity);
    window.addEventListener('scroll', handleActivity);
    window.addEventListener('keypress', handleActivity);

    return () => {
      clearTimeout(refreshTimeout);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      window.removeEventListener('keypress', handleActivity);
    };
  }, []);

  const handleGetStarted = () => {
    const whatsappMessage = encodeURIComponent(
      "Hello! I want to register as an admin on ShopNaija. I'm interested in the ₦75,000 annual plan with the massive discount. Please help me set up my store with the following details: Name, Phone, Email, NIN, Account Name, Account Number, Bank Name, Website Name, and Subdomain."
    );
    window.open(`https://wa.me/+2348158025887?text=${whatsappMessage}`, '_blank');
  };

  const handleFooterClick = (section: string, item: string) => {
    let message = "";
    
    switch (item) {
      case "Features":
        message = "ShopNaija offers beautiful online stores, sales analytics, and customer management tools to help Nigerian entrepreneurs succeed online.";
        break;
      case "Pricing":
        message = "ShopNaija costs ₦75,000 annually but we're offering a massive discount! Contact us on WhatsApp at +2348158025887 to get this special offer.";
        break;
      case "Templates":
        message = "Choose from beautiful, mobile-responsive store templates designed specifically for Nigerian businesses.";
        break;
      case "Help Center":
        message = "Need help? Contact us on WhatsApp at +2348158025887 for instant support and guidance.";
        break;
      case "Contact Us":
        message = "Reach out to us on WhatsApp: +2348158025887 or follow us on X @Caleb0533 for updates and support.";
        break;
      case "Documentation":
        message = "Complete guides and tutorials are available to help you set up and manage your online store successfully.";
        break;
      case "About":
        message = "ShopNaija empowers Nigerian entrepreneurs to build successful online businesses with our all-in-one e-commerce platform.";
        break;
      case "Privacy Policy":
        message = "We protect your data and privacy. Your information is secure and never shared with third parties without your consent.";
        break;
      case "Terms of Service":
        message = "Our terms ensure fair usage and protection for all users. We're committed to transparency and ethical business practices.";
        break;
      default:
        message = "This feature is coming soon! Follow us on X @Caleb0533 for updates.";
    }

    toast({
      title: item,
      description: message,
      duration: 5000,
    });
  };

  const features = [
    {
      icon: ShoppingBag,
      title: "Beautiful Online Stores",
      description: "Create stunning, mobile-responsive stores that convert visitors into customers."
    },
    {
      icon: TrendingUp,
      title: "Sales Analytics",
      description: "Track your performance with detailed analytics and insights to grow your business."
    },
    {
      icon: Users,
      title: "Customer Management",
      description: "Manage customer relationships and build a loyal customer base effortlessly."
    }
  ];

  const testimonials = [
    {
      name: "Adaora Okonkwo",
      business: "Fashion Boutique",
      content: "ShopNaija transformed my fashion business. Sales increased by 300% in just 3 months!",
      rating: 5
    },
    {
      name: "Ibrahim Musa",
      business: "Electronics Store",
      content: "The platform is so easy to use. I set up my electronics store in minutes and started selling immediately.",
      rating: 5
    },
    {
      name: "Chioma Nwankwo",
      business: "Beauty Products",
      content: "Customer management tools are amazing. I can track orders and communicate with customers seamlessly.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Grow Your 
              <span className="block text-green-600">Small Business</span>
              <span className="block">Online with ShopNaija</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              The all-in-one platform for Nigerian entrepreneurs to create beautiful online stores, 
              manage customers, and grow their business with powerful tools designed for success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={handleGetStarted}
                size="lg"
                className="text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                style={{ backgroundColor: '#00A862' }}
              >
                Start Your Store Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <div className="text-center">
                <p className="text-sm text-gray-500">
                  ₦75,000/year • Massive discount available • 24/7 support
                </p>
                <p className="text-xs text-green-600 font-semibold">
                  Contact us on WhatsApp for special pricing!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed specifically for Nigerian small businesses
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-8 rounded-xl bg-gray-50 hover:bg-green-50 transition-colors">
                <feature.icon className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Simple, Affordable Pricing
          </h2>
          <div className="bg-white rounded-2xl shadow-xl p-8 border-4 border-green-600 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-green-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                MASSIVE DISCOUNT AVAILABLE
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Annual Plan</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-green-600">₦75,000</span>
                <span className="text-gray-600">/year</span>
              </div>
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <span>Custom subdomain (yourstore.shopnaija.com)</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <span>Unlimited products</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <span>PayStack payment integration</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <span>WhatsApp order notifications</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <span>24/7 customer support</span>
                </li>
              </ul>
              <Button 
                onClick={handleGetStarted}
                size="lg"
                className="w-full text-white font-semibold text-lg py-4"
                style={{ backgroundColor: '#00A862' }}
              >
                Contact Us for Special Discount
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of successful Nigerian entrepreneurs
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.business}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Online Business?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Join thousands of Nigerian entrepreneurs who trust ShopNaija to power their online success.
          </p>
          <Button 
            onClick={handleGetStarted}
            size="lg"
            className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Get Started Now - Special Discount Available!
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-green-400 mb-4">ShopNaija</h3>
              <p className="text-gray-300">
                Empowering Nigerian entrepreneurs to build successful online businesses.
              </p>
              <p className="text-gray-400 text-sm mt-2">www.shopnaija.com</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-300">
                <li><button onClick={() => handleFooterClick('Product', 'Features')} className="hover:text-green-400 text-left">Features</button></li>
                <li><button onClick={() => handleFooterClick('Product', 'Pricing')} className="hover:text-green-400 text-left">Pricing</button></li>
                <li><button onClick={() => handleFooterClick('Product', 'Templates')} className="hover:text-green-400 text-left">Templates</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-300">
                <li><button onClick={() => handleFooterClick('Support', 'Help Center')} className="hover:text-green-400 text-left">Help Center</button></li>
                <li><button onClick={() => handleFooterClick('Support', 'Contact Us')} className="hover:text-green-400 text-left">Contact Us</button></li>
                <li><button onClick={() => handleFooterClick('Support', 'Documentation')} className="hover:text-green-400 text-left">Documentation</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-300">
                <li><button onClick={() => handleFooterClick('Company', 'About')} className="hover:text-green-400 text-left">About</button></li>
                <li><button onClick={() => handleFooterClick('Company', 'Privacy Policy')} className="hover:text-green-400 text-left">Privacy Policy</button></li>
                <li><button onClick={() => handleFooterClick('Company', 'Terms of Service')} className="hover:text-green-400 text-left">Terms of Service</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2024 ShopNaija. All rights reserved. Made with ❤️ for Nigerian entrepreneurs.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
