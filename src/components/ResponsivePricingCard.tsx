
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

const ResponsivePricingCard = () => {
  return (
    <div className="w-full max-w-sm mx-auto px-4">
      <Card className="relative overflow-hidden border-2 border-green-500 shadow-lg">
        {/* Discount Badge */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-3 py-1 text-xs font-bold rounded-b-lg">
          20% DISCOUNT
        </div>
        <div className="absolute top-6 right-4 bg-green-500 text-white px-2 py-1 text-xs font-bold rounded">
          ACTIVE!
        </div>

        <CardHeader className="text-center pt-8 pb-4">
          <CardTitle className="text-lg font-bold text-gray-900">Annual Plan</CardTitle>
          
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm text-gray-500 line-through">₦75,000</span>
              <span className="text-2xl md:text-3xl font-bold text-green-600">₦60,000</span>
            </div>
            <p className="text-xs text-gray-600">/year</p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-2 mt-3">
            <p className="text-xs text-red-700 font-medium">
              Save ₦15,000 with 20% Discount!
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 pb-6">
          <div className="flex items-start gap-2">
            <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            <div className="text-xs">
              <span className="font-medium">Custom subdomain</span>
              <p className="text-gray-600">(yourstore.shopnaija.com.ng)</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
            <span className="text-xs font-medium">Unlimited products</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
            <span className="text-xs font-medium">Professional dashboard</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
            <span className="text-xs font-medium">Payment integration</span>
          </div>

          <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 text-sm mt-4">
            Get Started Now
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResponsivePricingCard;
