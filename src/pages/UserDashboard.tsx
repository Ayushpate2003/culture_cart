import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Navbar } from "@/components/navigation/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  ShoppingBag, 
  Heart, 
  Settings, 
  Package, 
  Star,
  TrendingUp,
  Palette,
  Shield,
  Edit,
  Eye,
  Plus,
  Calendar
} from "lucide-react";

const UserDashboard = () => {
  const { currentUser, userProfile, isAdmin, isArtisan, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    
    // If user doesn't have a complete profile, redirect to profile page
    if (!userProfile?.role) {
      navigate("/profile");
      return;
    }
  }, [currentUser, userProfile, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Logout Failed",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-5 w-5" />;
      case 'artisan':
        return <Palette className="h-5 w-5" />;
      default:
        return <User className="h-5 w-5" />;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'artisan':
        return 'default';
      default:
        return 'secondary';
    }
  };

  if (!currentUser || !userProfile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={currentUser.photoURL || undefined} />
              <AvatarFallback className="text-lg">
                {getInitials(userProfile.displayName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-heading font-bold">
                Welcome back, {userProfile.displayName || "User"}!
              </h1>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant={getRoleBadgeVariant(userProfile.role)}>
                  <span className="flex items-center space-x-1">
                    {getRoleIcon(userProfile.role)}
                    <span className="capitalize">{userProfile.role}</span>
                  </span>
                </Badge>
                <span className="text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">{userProfile.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            {isArtisan() && <TabsTrigger value="artisan">Artisan Tools</TabsTrigger>}
            {isAdmin() && <TabsTrigger value="admin">Admin Panel</TabsTrigger>}
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="shadow-craft-soft">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate("/catalog")}
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Browse Products
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate("/stories")}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Read Stories
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate("/artisans")}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Meet Artisans
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-craft-soft">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    <p>• Account created</p>
                    <p>• Profile completed</p>
                    <p>• Welcome to CultureCart!</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-craft-soft">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Recommendations</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    <p>• Explore featured products</p>
                    <p>• Read cultural stories</p>
                    <p>• Follow your favorite artisans</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Role-specific content */}
            {isArtisan() && (
              <Card className="shadow-craft-soft">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Palette className="h-5 w-5" />
                    <span>Artisan Dashboard</span>
                  </CardTitle>
                  <CardDescription>
                    Manage your products and connect with customers
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button 
                      variant="outline" 
                      className="h-20 flex-col"
                      onClick={() => navigate("/artisan-signup")}
                    >
                      <Plus className="h-6 w-6 mb-2" />
                      Add Product
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex-col"
                      onClick={() => navigate("/dashboard")}
                    >
                      <Package className="h-6 w-6 mb-2" />
                      My Products
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex-col"
                      onClick={() => navigate("/dashboard")}
                    >
                      <TrendingUp className="h-6 w-6 mb-2" />
                      Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {isAdmin() && (
              <Card className="shadow-craft-soft">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Admin Panel</span>
                  </CardTitle>
                  <CardDescription>
                    Manage users, products, and system settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Button 
                      variant="outline" 
                      className="h-20 flex-col"
                      onClick={() => navigate("/admin/add-product")}
                    >
                      <Plus className="h-6 w-6 mb-2" />
                      Add Product
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex-col"
                      onClick={() => navigate("/admin/add-artisan")}
                    >
                      <User className="h-6 w-6 mb-2" />
                      Add Artisan
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex-col"
                      onClick={() => navigate("/admin/view-orders")}
                    >
                      <ShoppingBag className="h-6 w-6 mb-2" />
                      View Orders
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex-col"
                      onClick={() => navigate("/admin/analytics")}
                    >
                      <TrendingUp className="h-6 w-6 mb-2" />
                      Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="shadow-craft-soft">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Profile Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Full Name</label>
                    <p className="text-sm text-muted-foreground">
                      {userProfile.displayName || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="text-sm text-muted-foreground">{userProfile.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Account Type</label>
                    <div className="mt-1">
                      <Badge variant={getRoleBadgeVariant(userProfile.role)}>
                        <span className="flex items-center space-x-1">
                          {getRoleIcon(userProfile.role)}
                          <span className="capitalize">{userProfile.role}</span>
                        </span>
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Member Since</label>
                    <p className="text-sm text-muted-foreground">
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="pt-4">
                  <Button variant="outline" onClick={() => navigate("/profile")}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Artisan Tools Tab */}
          {isArtisan() && (
            <TabsContent value="artisan" className="space-y-6">
              <Card className="shadow-craft-soft">
                <CardHeader>
                  <CardTitle>Artisan Tools</CardTitle>
                  <CardDescription>
                    Manage your products, orders, and artisan profile
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Palette className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">Artisan Dashboard Coming Soon</h3>
                    <p className="text-muted-foreground mb-4">
                      Advanced tools for managing your products and connecting with customers.
                    </p>
                    <Button onClick={() => navigate("/admin-dashboard")}>
                      Go to Current Dashboard
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Admin Panel Tab */}
          {isAdmin() && (
            <TabsContent value="admin" className="space-y-6">
              <Card className="shadow-craft-soft">
                <CardHeader>
                  <CardTitle>Admin Panel</CardTitle>
                  <CardDescription>
                    System administration and management tools
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">Admin Tools</h3>
                    <p className="text-muted-foreground mb-4">
                      Access advanced administration features.
                    </p>
                    <Button onClick={() => navigate("/admin-dashboard")}>
                      Go to Admin Dashboard
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="shadow-craft-soft">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Account Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Account Information</h4>
                      <p className="text-sm text-muted-foreground">
                        Update your profile and account settings
                      </p>
                    </div>
                    <Button variant="outline" onClick={() => navigate("/profile")}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-destructive">Sign Out</h4>
                        <p className="text-sm text-muted-foreground">
                          Sign out of your CultureCart account
                        </p>
                      </div>
                      <Button variant="destructive" onClick={handleLogout}>
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserDashboard;
