
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  MessageCircle, 
  Bell, 
  UserPlus,
  TrendingUp,
  BarChart3
} from "lucide-react";
import AdminManagement from "@/components/superadmin/AdminManagement";
import FeedbackManagement from "@/components/superadmin/FeedbackManagement";
import NotificationCenter from "@/components/superadmin/NotificationCenter";
import ReferralTracking from "@/components/superadmin/ReferralTracking";
import DashboardStats from "@/components/superadmin/DashboardStats";
import RecentActivity from "@/components/superadmin/RecentActivity";
import TopPerformingStores from "@/components/superadmin/TopPerformingStores";

const SuperAdminDashboard = () => {
  const { user } = useAuth();

  // Mock stats - in real app, these would come from API
  const stats = {
    totalAdmins: 12,
    totalRevenue: 2450000,
    totalProducts: 1240,
    totalOrders: 456,
    activeStores: 10,
    monthlyGrowth: 15.2
  };

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

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="admins" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Admins</span>
          </TabsTrigger>
          <TabsTrigger value="referrals" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Referrals</span>
          </TabsTrigger>
          <TabsTrigger value="feedback" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Feedback</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Alerts</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="space-y-6">
            {/* Stats Grid */}
            <DashboardStats stats={stats} />
            
            {/* Recent Activity and Top Stores */}
            <div className="grid gap-6 lg:grid-cols-2">
              <RecentActivity />
              <TopPerformingStores />
            </div>
          </div>
        </TabsContent>

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
