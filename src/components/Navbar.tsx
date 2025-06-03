
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Twitter } from "lucide-react";
import LoginModal from "./LoginModal";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleGetStarted = () => {
    const whatsappMessage = encodeURIComponent(
      "Hello! I want to register as an admin on GrowthSmallBeez. Please help me set up my store with the following details: Name, Phone, Email, NIN, Account Name, Account Number, Bank Name, Website Name, and Subdomain."
    );
    window.open(`https://wa.me/+2348158025887?text=${whatsappMessage}`, '_blank');
  };

  const handleFollowTwitter = () => {
    window.open('https://x.com/Caleb0533', '_blank');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold" style={{ color: '#00A862' }}>
              GrowthSmallBeez
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <button 
                onClick={handleFollowTwitter}
                className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium transition-colors flex items-center gap-2"
              >
                <Twitter size={16} />
                Follow us on X
              </button>
            </div>
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <LoginModal>
              <Button 
                variant="outline" 
                className="border-green-600 text-green-600 hover:bg-green-50"
              >
                Login
              </Button>
            </LoginModal>
            <Button 
              onClick={handleGetStarted}
              className="text-white px-6 py-2 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              style={{ backgroundColor: '#00A862' }}
            >
              Get Started
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-green-600 focus:outline-none focus:text-green-600"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <button 
                onClick={handleFollowTwitter}
                className="text-gray-700 hover:text-green-600 block px-3 py-2 text-base font-medium flex items-center gap-2"
              >
                <Twitter size={16} />
                Follow us on X
              </button>
              <div className="px-3 py-2 space-y-3">
                <LoginModal>
                  <Button 
                    variant="outline" 
                    className="w-full border-green-600 text-green-600 hover:bg-green-50"
                  >
                    Login
                  </Button>
                </LoginModal>
                <Button 
                  onClick={handleGetStarted}
                  className="w-full text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                  style={{ backgroundColor: '#00A862' }}
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
