import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, 
  ShoppingBag, 
  MessageCircle, 
  Bell, 
  PlusCircle,
  TrendingUp,
  Settings,
  Tag
} from "lucide-react";
import ProductManagement from "@/components/admin/ProductManagement";
import CategoryManagement from "@/components/admin/CategoryManagement";
import AdminSettings from "@/components/admin/AdminSettings";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [totalProducts, setTotalProducts] = useState(24);
  const [totalOrders, setTotalOrders] = useState(12);
  const [totalFeedback, setTotalFeedback] = useState(8);
  const [recentOrders, setRecentOrders] = useState([
    {
      id: "ORD-001",
      customer: "John Doe",
      amount: 120.50,
      date: "2 hours ago",
      status: "completed"
    },
    {
      id: "ORD-002",
      customer: "Jane Smith",
      amount: 85.75,
      date: "5 hours ago",
      status: "completed"
    },
    {
      id: "ORD-003",
      customer: "Robert Johnson",
      amount: 210.00,
      date: "1 day ago",
      status: "pending"
    },
    {
      id: "ORD-004",
      customer: "Emily Davis",
      amount: 45.25,
      date: "2 days ago",
      status: "completed"
    }
  ]);

  const Stats = [
    {
      title: "Total Products",
      value: totalProducts,
      icon: <Package className="h-8 w-8 text-brand-800" />,
      description: "In your store",
      change: "+3 this week",
    },
    {
      title: "Total Orders",
      value: totalOrders,
      icon: <ShoppingBag className="h-8 w-8 text-brand-800" />,
      description: "Completed orders",
      change: "+2 today",
    },
    {
      title: "Total Feedback",
      value: totalFeedback,
      icon: <MessageCircle className="h-8 w-8 text-brand-800" />,
      description: "Customer reviews",
      change: "+1 this week",
    },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.name}!</h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening in your store today.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button className="bg-brand-800 hover:bg-brand-700">
            <PlusCircle className="mr-2 h-4 w-4" /> 
            Quick Actions
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Stats.map((stat, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
              <div className="mt-2 flex items-center text-xs">
                <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                <span className="font-medium text-green-600">{stat.change}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Products</span>
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Category className="h-4 w-4" />
            <span className="hidden sm:inline">Categories</span>
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Orders</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order, i) => (
                    <div key={i} className="flex items-center gap-4 p-2 hover:bg-slate-50 rounded-md">
                      <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center">
                        {order.customer.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{order.customer}</p>
                        <p className="text-sm text-muted-foreground">{order.id} - ₦{order.amount.toFixed(2)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{order.date}</p>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Recent Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="p-3 border border-gray-100 rounded-md hover:bg-slate-50">
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, starIndex) => (
                            <svg
                              key={starIndex}
                              className={`w-4 h-4 ${starIndex < 4 + (i % 2) ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">• {i + 1} day{i !== 0 ? 's' : ''} ago</span>
                      </div>
                      <p className="text-sm mt-2">
                        {["Great products and fast shipping!", 
                         "Love the quality of the items!",
                         "Good experience overall, will shop again.",
                         "Satisfied with my purchase, thank you!"][i]}
                      </p>
                      <p className="text-xs text-right font-medium mt-1">
                        - {["John D.", "Maria S.", "Robert K.", "Emily W."][i]}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products">
          <ProductManagement />
        </TabsContent>

        <TabsContent value="categories">
          <CategoryManagement />
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Orders Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Order management functionality coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <AdminSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
