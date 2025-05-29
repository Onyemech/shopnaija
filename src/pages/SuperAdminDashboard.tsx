
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  Package, 
  ShoppingBag, 
  MessageCircle, 
  Bell, 
  UserPlus 
} from "lucide-react";

const SuperAdminDashboard = () => {
  const { user } = useAuth();
  const [totalAdmins, setTotalAdmins] = useState(5);
  const [totalProducts, setTotalProducts] = useState(120);
  const [totalOrders, setTotalOrders] = useState(45);
  const [totalFeedback, setTotalFeedback] = useState(28);

  const Stats = [
    {
      title: "Total Admins",
      value: totalAdmins,
      icon: <Users className="h-8 w-8 text-brand-800" />,
      description: "Active store owners",
      change: "+2 this month",
    },
    {
      title: "Total Products",
      value: totalProducts,
      icon: <Package className="h-8 w-8 text-brand-800" />,
      description: "Across all stores",
      change: "+18 this week",
    },
    {
      title: "Total Orders",
      value: totalOrders,
      icon: <ShoppingBag className="h-8 w-8 text-brand-800" />,
      description: "Completed orders",
      change: "+12 today",
    },
    {
      title: "Total Feedback",
      value: totalFeedback,
      icon: <MessageCircle className="h-8 w-8 text-brand-800" />,
      description: "Customer reviews",
      change: "+5 this week",
    },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.name}!</h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening across your platform today.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button className="bg-brand-800 hover:bg-brand-700">
            <UserPlus className="mr-2 h-4 w-4" /> Add New Admin
          </Button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Stats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
              <div className="mt-2 text-xs font-medium text-green-600">{stat.change}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Recent Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-2 hover:bg-slate-50 rounded-md">
                  <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center">
                    {String.fromCharCode(65 + i)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Admin {i + 1}</p>
                    <p className="text-sm text-muted-foreground">admin{i + 1}.example.com</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${i % 3 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {i % 3 ? 'Active' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Recent Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-start gap-4 p-2 hover:bg-slate-50 rounded-md">
                  <div className="h-10 w-10 rounded-full bg-brand-100 flex items-center justify-center">
                    <Bell className="h-5 w-5 text-brand-800" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">New order placed</p>
                    <p className="text-sm text-muted-foreground">
                      Order #{1000 + i} was placed on admin{i + 1}.example.com
                    </p>
                    <p className="text-xs text-slate-500 mt-1">{i + 1} hour{i !== 0 ? 's' : ''} ago</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
