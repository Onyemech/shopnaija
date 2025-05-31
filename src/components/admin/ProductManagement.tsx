
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ProductService } from "@/services/ProductService";
import { CategoryService } from "@/services/CategoryService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash, Package } from "lucide-react";
import { Product, Category } from "@/types";

const ProductManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    category_id: "",
    image_url: ""
  });

  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [user?.id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        ProductService.getProductsByAdmin(user!.id),
        CategoryService.getCategoriesByAdmin(user!.id)
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateFees = (price: number) => {
    const paystackFee = (price * 0.015) + 100; // 1.5% + ₦100
    const superadminFee = price * 0.015; // 1.5%
    const adjustedPrice = price + paystackFee;
    
    return {
      paystackFee,
      superadminFee,
      adjustedPrice
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.price) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const price = parseFloat(formData.price);
      const fees = calculateFees(price);
      
      const productData = {
        ...formData,
        admin_id: user!.id,
        price,
        adjusted_price: fees.adjustedPrice,
        paystack_fee: fees.paystackFee,
        superadmin_fee: fees.superadminFee,
        category_id: formData.category_id || null
      };

      if (editingProduct) {
        await ProductService.updateProduct(editingProduct.id, productData);
        toast({
          title: "Success",
          description: "Product updated successfully"
        });
      } else {
        await ProductService.createProduct(productData);
        toast({
          title: "Success",
          description: "Product created successfully"
        });
      }

      setDialogOpen(false);
      setEditingProduct(null);
      setFormData({
        title: "",
        description: "",
        price: "",
        location: "",
        category_id: "",
        image_url: ""
      });
      loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description || "",
      price: product.price.toString(),
      location: product.location || "",
      category_id: product.category_id || "",
      image_url: product.image_url || ""
    });
    setDialogOpen(true);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await ProductService.deleteProduct(productId);
      toast({
        title: "Success",
        description: "Product deleted successfully"
      });
      loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading products...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Product Management</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-brand-800 hover:bg-brand-700"
              onClick={() => {
                setEditingProduct(null);
                setFormData({
                  title: "",
                  description: "",
                  price: "",
                  location: "",
                  category_id: "",
                  image_url: ""
                });
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Edit Product" : "Add New Product"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="price">Price (₦) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  required
                />
                {formData.price && (
                  <p className="text-xs text-gray-500 mt-1">
                    Customer pays: ₦{(parseFloat(formData.price) + (parseFloat(formData.price) * 0.015) + 100).toFixed(2)}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category_id} onValueChange={(value) => setFormData({...formData, category_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingProduct ? "Update" : "Create"} Product
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Package className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">No products yet</p>
              <p className="text-sm text-gray-400">Click "Add Product" to get started</p>
            </CardContent>
          </Card>
        ) : (
          products.map((product) => (
            <Card key={product.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg truncate">{product.title}</CardTitle>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(product)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {product.image_url && (
                  <img
                    src={product.image_url}
                    alt={product.title}
                    className="w-full h-32 object-cover rounded mb-3"
                  />
                )}
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {product.description}
                </p>
                <div className="space-y-1">
                  <p className="font-semibold">₦{product.price}</p>
                  <p className="text-xs text-gray-500">
                    Customer pays: ₦{product.adjusted_price?.toFixed(2)}
                  </p>
                  {product.location && (
                    <p className="text-xs text-gray-500">📍 {product.location}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductManagement;
