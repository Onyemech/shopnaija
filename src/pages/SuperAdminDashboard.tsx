
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Package, 
  ShoppingBag, 
  MessageCircle, 
  Bell, 
  UserPlus,
  TrendingUp,
  DollarSign
} from "lucide-react";
import AdminManagement from "@/components/superadmin/AdminManagement";
import FeedbackManagement from "@/components/superadmin/FeedbackManagement";
import NotificationCenter from "@/components/superadmin/NotificationCenter";
import ReferralTracking from "@/components/superadmin/ReferralTracking";

const SuperAdminDashboard = () => {
  const { user } = useAuth();

  // Mock stats - in real app, these would come from API
  const stats = [
    {
      title: "Total Admins",
      value: 12,
      icon: <Users className="h-8 w-8 text-brand-800" />,
      description: "Active store owners",
      change: "+2 this month",
      trend: "up"
    },
    {
      title: "Total Revenue",
      value: "₦2,450,000",
      icon: <DollarSign className="h-8 w-8 text-green-600" />,
      description: "This month",
      change: "+15% from last month",
      trend: "up"
    },
    {
      title: "Total Products",
      value: 1240,
      icon: <Package className="h-8 w-8 text-blue-600" />,
      description: "Across all stores",
      change: "+180 this week",
      trend: "up"
    },
    {
      title: "Total Orders",
      value: 456,
      icon: <ShoppingBag className="h-8 w-8 text-purple-600" />,
      description: "Completed orders",
      change: "+23 today",
      trend: "up"
    }
  ];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening across the GrowthSmallBeez platform today.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button className="bg-brand-800 hover:bg-brand-700">
            <UserPlus className="mr-2 h-4 w-4" /> 
            Create New Admin
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
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
      <Tabs defaultValue="admins" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="admins" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Admin Management</span>
            <span className="sm:hidden">Admins</span>
          </TabsTrigger>
          <TabsTrigger value="referrals" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Referral Tracking</span>
            <span className="sm:hidden">Referrals</span>
          </TabsTrigger>
          <TabsTrigger value="feedback" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Feedback</span>
            <span className="sm:hidden">Feedback</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
            <span className="sm:hidden">Alerts</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="admins">
          <AdminManagement />
        </TabsContent>

        <TabsContent value="referrals">
          <ReferralTracking />
        </TabsContent>

        <TabsContent value="feedback">
          <FeedbackManagement />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationCenter />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SuperAdminDashboard;
