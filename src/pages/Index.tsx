
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Special Discount Pricing
          </h2>
          <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Start your online store today with our limited-time offer
          </p>
        </div>

        {/* Pricing Card */}
        <div className="flex justify-center mb-8 sm:mb-12">
          <ResponsivePricingCard />
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
          <div className="text-center p-4 sm:p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-xl">🏪</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Your Own Store</h3>
            <p className="text-gray-600 text-sm">Get a professional online store with your custom subdomain</p>
          </div>
          
          <div className="text-center p-4 sm:p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-xl">💳</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Payment Ready</h3>
            <p className="text-gray-600 text-sm">Integrated payment system with Paystack for seamless transactions</p>
          </div>
          
          <div className="text-center p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-xl">📱</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Mobile Optimized</h3>
            <p className="text-gray-600 text-sm">Fully responsive design that works perfectly on all devices</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 max-w-2xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              Ready to Start Your Online Business?
            </h3>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">
              Contact us to register as an admin and get your store set up with our special discount pricing.
            </p>
            <p className="text-xs sm:text-sm text-gray-500 bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-200">
              <strong>To become an admin:</strong> Send us a message with your details including Name, Phone, Email, NIN, 
              Account Name, Account Number, Bank Name, Website Name, and desired Subdomain. 
              Our team will set up your store and provide login credentials.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12 sm:mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="text-center text-gray-600 text-xs sm:text-sm">
            <p>&copy; 2024 ShopNaija. All rights reserved.</p>
            <p className="mt-2">Your trusted Nigerian e-commerce platform</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
