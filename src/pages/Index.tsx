
import { Button } from "@/components/ui/button";
import LoginModal from "@/components/LoginModal";
import ResponsivePricingCard from "@/components/ResponsivePricingCard";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl sm:text-2xl font-bold text-green-600">ShopNaija</h1>
              <span className="text-xs sm:text-sm text-gray-500 ml-2">www.shopnaija.com</span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <LoginModal>
                <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                  Login
                </Button>
              </LoginModal>
              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-white py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
              Grow Your <span className="text-green-600">Small Business</span>
            </h2>
            <h3 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 sm:mb-8">
              Online with ShopNaija
            </h3>
            <p className="text-lg sm:text-xl text-gray-600 max-w-4xl mx-auto mb-8 sm:mb-12">
              The all-in-one platform for Nigerian entrepreneurs to create beautiful online stores, 
              manage customers, and grow their business with powerful tools designed for success.
            </p>
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
              Start Your Store Today →
            </Button>
          </div>

          {/* Pricing Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center items-center gap-4 mb-6">
              <span className="text-lg text-gray-500 line-through">₦75,000/year</span>
              <span className="text-3xl sm:text-4xl font-bold text-green-600">₦60,000/year</span>
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">20% OFF!</span>
            </div>
            <p className="text-green-600 font-semibold">Special 20% Discount • Limited Time • 24/7 support</p>
            <p className="text-gray-600 text-sm">Contact us on WhatsApp for this exclusive pricing!</p>
          </div>

          {/* Responsive Pricing Card */}
          <div className="flex justify-center mb-12">
            <ResponsivePricingCard />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Powerful features designed specifically for Nigerian small businesses
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-2xl">🏪</span>
              </div>
              <h4 className="text-xl font-semibold mb-3">Your Own Store</h4>
              <p className="text-gray-600">Get a professional online store with your custom subdomain</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-2xl">💳</span>
              </div>
              <h4 className="text-xl font-semibold mb-3">Payment Ready</h4>
              <p className="text-gray-600">Integrated payment system with Paystack for seamless transactions</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-2xl">📱</span>
              </div>
              <h4 className="text-xl font-semibold mb-3">Mobile Optimized</h4>
              <p className="text-gray-600">Fully responsive design that works perfectly on all devices</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 sm:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-lg shadow-xl p-8 sm:p-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
              Ready to Start Your Online Business?
            </h3>
            <p className="text-lg text-gray-600 mb-8">
              Contact us to register as an admin and get your store set up with our special discount pricing.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <p className="text-sm text-blue-800">
                <strong>To become an admin:</strong> Send us a message with your details including Name, Phone, Email, NIN, 
                Account Name, Account Number, Bank Name, Website Name, and desired Subdomain. 
                Our team will set up your store and provide login credentials.
              </p>
            </div>
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg">
              Get Started Today
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600">&copy; 2024 ShopNaija. All rights reserved.</p>
          <p className="text-gray-500 mt-2">Your trusted Nigerian e-commerce platform</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
