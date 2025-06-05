
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AdminService } from "@/services/AdminService";
import { ProductService } from "@/services/ProductService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  ShoppingCart, 
  Star, 
  MapPin,
  Heart,
  Filter
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const StoreFront = () => {
  const { subdomain } = useParams();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [cart, setCart] = useState<any[]>([]);

  // Get admin data for this subdomain
  const { data: adminData, isLoading: adminLoading } = useQuery({
    queryKey: ['admin', subdomain],
    queryFn: () => subdomain ? AdminService.getAdminBySubdomain(subdomain) : null,
    enabled: !!subdomain,
  });

  // Get products for this admin
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['products', adminData?.id],
    queryFn: () => adminData?.id ? ProductService.getProductsByAdmin(adminData.id) : [],
    enabled: !!adminData?.id,
  });

  // Get categories for this admin
  const { data: categories } = useQuery({
    queryKey: ['categories', adminData?.id],
    queryFn: () => adminData?.id ? ProductService.getCategoriesByAdmin(adminData.id) : [],
    enabled: !!adminData?.id,
  });

  const addToCart = (product: any) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    
    toast({
      title: "Added to cart",
      description: `${product.title} has been added to your cart`,
    });
  };

  const filteredProducts = products?.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  if (adminLoading || productsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading store...</p>
        </div>
      </div>
    );
  }

  if (!adminData || !adminData.is_active) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Store Not Available</h1>
          <p className="text-xl text-gray-600">This store is currently inactive or doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header 
        className="bg-white shadow-sm border-b-4"
        style={{ borderBottomColor: adminData.primary_color || '#1a56db' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-3">
              {adminData.logo_url && (
                <img 
                  src={adminData.logo_url} 
                  alt={adminData.website_name}
                  className="h-10 w-auto"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {adminData.website_name || 'Store'}
                </h1>
                <p className="text-sm text-gray-600">Powered by GrowthSmallBeez</p>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <Button 
                variant="outline" 
                className="relative"
                onClick={() => toast({ title: "Cart", description: "Cart functionality coming soon!" })}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart
                {cart.length > 0 && (
                  <Badge 
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center"
                    style={{ backgroundColor: adminData.primary_color || '#1a56db' }}
                  >
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="">All Categories</option>
                {categories?.map((category: any) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product: any) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow overflow-hidden">
              <div className="aspect-square bg-gray-200 relative overflow-hidden">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
              
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold line-clamp-2">
                  {product.title}
                </CardTitle>
                {product.location && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-3 w-3 mr-1" />
                    {product.location}
                  </div>
                )}
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold" style={{ color: adminData.primary_color || '#1a56db' }}>
                        ₦{product.adjusted_price?.toLocaleString() || product.price.toLocaleString()}
                      </p>
                      {product.adjusted_price && product.adjusted_price !== product.price && (
                        <p className="text-sm text-gray-500 line-through">
                          ₦{product.price.toLocaleString()}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">4.5</span>
                    </div>
                  </div>
                  
                  {product.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                  
                  <Button 
                    className="w-full"
                    style={{ backgroundColor: adminData.primary_color || '#1a56db' }}
                    onClick={() => addToCart(product)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">
              {searchTerm || selectedCategory 
                ? "Try adjusting your search or filter criteria" 
                : "This store doesn't have any products yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreFront;
