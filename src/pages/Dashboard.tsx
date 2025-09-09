import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navbar } from "@/components/navigation/Navbar";
import { 
  getUser, 
  isAdmin, 
  mockProducts, 
  mockArtisans, 
  mockOrders,
  type Product,
  type Artisan,
  type Order 
} from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { 
  ShoppingBag, 
  Users, 
  Package, 
  TrendingUp, 
  Star,
  UserCheck,
  ShoppingCart
} from "lucide-react";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const [pendingApps, setPendingApps] = useState<any[]>([]);
  const [approvedArtisans, setApprovedArtisans] = useState<any[]>([]);
  const [actionNotice, setActionNotice] = useState<{ text: string; variant: "default" | "secondary" | "destructive" } | null>(null);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>(isAdmin() ? "overview" : "purchases");
  const [removedIds, setRemovedIds] = useState<string[]>([]);

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      navigate("/login");
      return;
    }
    setUser(currentUser);
    const apps = JSON.parse(localStorage.getItem("artisanApplications") || "[]");
    setPendingApps(apps);
    const approved = JSON.parse(localStorage.getItem("approvedArtisans") || "[]");
    setApprovedArtisans(approved);
    const removed = JSON.parse(localStorage.getItem("removedArtisanIds") || "[]");
    setRemovedIds(removed);
  }, [navigate]);

  const approveApp = (id: number) => {
    const app = pendingApps.find((a) => a.id === id);
    if (!app) return;
    const updatedPending = pendingApps.filter((a) => a.id !== id);
    const updatedApproved = [app, ...approvedArtisans];
    setPendingApps(updatedPending);
    setApprovedArtisans(updatedApproved);
    localStorage.setItem("artisanApplications", JSON.stringify(updatedPending));
    localStorage.setItem("approvedArtisans", JSON.stringify(updatedApproved));
    setActionNotice({ text: `Approved ${app.name}`, variant: "default" });
    toast({ title: "Approved", description: `${app.name} is now visible on Explore & Home.` });
    setTimeout(() => setActionNotice(null), 3000);
  };

  const rejectApp = (id: number) => {
    const app = pendingApps.find((a) => a.id === id);
    const updatedPending = pendingApps.filter((a) => a.id !== id);
    setPendingApps(updatedPending);
    localStorage.setItem("artisanApplications", JSON.stringify(updatedPending));
    if (app) {
      setActionNotice({ text: `Rejected ${app.name}`, variant: "secondary" });
      toast({ title: "Rejected", description: `${app.name}'s application was rejected.` });
      setTimeout(() => setActionNotice(null), 3000);
    }
  };

  const removeApproved = (id: number) => {
    const removed = approvedArtisans.find((a) => a.id === id);
    const updated = approvedArtisans.filter((a) => a.id !== id);
    setApprovedArtisans(updated);
    localStorage.setItem("approvedArtisans", JSON.stringify(updated));
    if (removed) {
      setActionNotice({ text: `Removed ${removed.name}`, variant: "destructive" });
      toast({ title: "Removed", description: `${removed.name} will no longer appear on Explore & Home.` });
      setTimeout(() => setActionNotice(null), 3000);
    }
  };

  const toggleVisibility = (manageId: string, makeVisible: boolean) => {
    let next = removedIds.slice();
    if (makeVisible) {
      next = next.filter((id) => id !== manageId);
    } else {
      if (!next.includes(manageId)) next.push(manageId);
    }
    setRemovedIds(next);
    localStorage.setItem("removedArtisanIds", JSON.stringify(next));
  };

  // Dashboard header does not render its own auth controls; navbar handles them.

  if (!user) {
    return <div>Loading...</div>;
  }

  const totalRevenue = mockOrders.reduce((sum, order) => sum + order.total, 0);
  const totalProducts = mockProducts.length;
  const totalArtisans = mockArtisans.length;
  const totalOrders = mockOrders.length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold">
              {isAdmin() ? "Admin Dashboard" : "My Dashboard"}
            </h1>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-craft-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-craft-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
              <p className="text-xs text-muted-foreground">Active listings</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-craft-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Artisans</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalArtisans}</div>
              <p className="text-xs text-muted-foreground">Registered creators</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-craft-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            {isAdmin() ? (
              <>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="artisans">Artisans</TabsTrigger>
                <TabsTrigger value="manage-artisans">Manage Artisans</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </>
            ) : (
              <>
                <TabsTrigger value="purchases">My Purchases</TabsTrigger>
                <TabsTrigger value="favorites">Favorites</TabsTrigger>
                <TabsTrigger value="profile">Profile</TabsTrigger>
              </>
            )}
          </TabsList>

          {/* Admin Views */}
          {isAdmin() && (
            <>
              <TabsContent value="overview">
                <div className="grid gap-6">
                  {/* Quick Actions */}
                  <Card className="shadow-craft-soft">
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                      <CardDescription>Common administrative tasks</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <Button 
                          variant="outline" 
                          className="h-20 flex-col gap-2"
                          onClick={() => navigate("/admin/add-product")}
                        >
                          <Package className="h-6 w-6" />
                          <span className="text-xs">Add Product</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          className="h-20 flex-col gap-2"
                          onClick={() => navigate("/admin/add-artisan")}
                        >
                          <Users className="h-6 w-6" />
                          <span className="text-xs">Add Artisan</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="h-20 flex-col gap-2"
                          onClick={() => setActiveTab("manage-artisans")}
                        >
                          <Users className="h-6 w-6" />
                          <span className="text-xs">Manage Artisans</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          className="h-20 flex-col gap-2"
                          onClick={() => navigate("/admin/view-orders")}
                        >
                          <ShoppingBag className="h-6 w-6" />
                          <span className="text-xs">View Orders</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          className="h-20 flex-col gap-2"
                          onClick={() => navigate("/admin/analytics")}
                        >
                          <TrendingUp className="h-6 w-6" />
                          <span className="text-xs">Analytics</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Activity */}
                  <Card className="shadow-craft-soft">
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>Latest platform activities</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { action: "New order #12345", time: "2 minutes ago", type: "order" },
                          { action: "Artisan registration: Jane Smith", time: "15 minutes ago", type: "artisan" },
                          { action: "Product approved: Ceramic Vase", time: "1 hour ago", type: "product" },
                          { action: "Order shipped #12340", time: "2 hours ago", type: "shipping" },
                        ].map((activity, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              {activity.type === "order" && <ShoppingBag className="h-4 w-4 text-blue-500" />}
                              {activity.type === "artisan" && <Users className="h-4 w-4 text-green-500" />}
                              {activity.type === "product" && <Package className="h-4 w-4 text-purple-500" />}
                              {activity.type === "shipping" && <TrendingUp className="h-4 w-4 text-orange-500" />}
                              <span className="text-sm">{activity.action}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{activity.time}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="orders">
                <Card className="shadow-craft-soft">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Order Management</CardTitle>
                      <CardDescription>Manage customer orders and fulfillment</CardDescription>
                    </div>
                    <Button size="sm">
                      <Package className="h-4 w-4 mr-2" />
                      Export Orders
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockOrders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex-1">
                            <div className="flex items-center gap-4">
                              <div>
                                <p className="font-medium">{order.id}</p>
                                <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                                <p className="text-xs text-muted-foreground">{order.orderDate}</p>
                              </div>
                              <div className="hidden md:block">
                                <p className="text-sm text-muted-foreground">
                                  {order.products.length} item(s)
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="font-medium">${order.total.toFixed(2)}</p>
                              <Badge variant={
                                order.status === "delivered" ? "default" :
                                order.status === "shipped" ? "secondary" :
                                order.status === "processing" ? "secondary" : "outline"
                              }>
                                {order.status}
                              </Badge>
                            </div>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="products">
                <Card className="shadow-craft-soft">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Product Management</CardTitle>
                      <CardDescription>Manage product listings and inventory</CardDescription>
                    </div>
                    <Button size="sm">
                      <Package className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockProducts.map((product) => (
                        <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                              <Package className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-muted-foreground">by {product.artisan}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  Stock: {product.inStock}
                                </Badge>
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-current text-yellow-400" />
                                  <span className="text-xs">{product.rating}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="font-medium">${product.price}</p>
                              <p className="text-xs text-muted-foreground">{product.category}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                Edit
                              </Button>
                              <Button variant="outline" size="sm">
                                View
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="artisans">
                <Card className="shadow-craft-soft">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Artisan Management</CardTitle>
                      <CardDescription>Manage artisan profiles and applications</CardDescription>
                    </div>
                    <div className="flex items-center gap-3">
                      {actionNotice && <Badge variant={actionNotice.variant}>{actionNotice.text}</Badge>}
                      <div className="text-sm text-muted-foreground">Pending: {pendingApps.length} • Approved: {approvedArtisans.length}</div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {pendingApps.map((artisan) => (
                        <div key={artisan.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                              <Users className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-medium">{artisan.name}</p>
                              <p className="text-sm text-muted-foreground">{artisan.specialty}</p>
                              <p className="text-xs text-muted-foreground">{artisan.location}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex gap-2">
                              <Button variant="secondary" size="sm" onClick={() => approveApp(artisan.id)}>
                                <UserCheck className="h-4 w-4 mr-2" />Approve
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => rejectApp(artisan.id)}>
                                Reject
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                      {pendingApps.length === 0 && (
                        <div className="text-sm text-muted-foreground">No pending applications.</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="users">
                <Card className="shadow-craft-soft">
                  <CardHeader>
                    <CardTitle>Approved Artisans</CardTitle>
                    <CardDescription>Remove artisans from Explore if needed</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {approvedArtisans.map((a) => (
                        <div key={a.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-medium">{a.name}</p>
                            <p className="text-xs text-muted-foreground">{a.specialty} • {a.location}</p>
                          </div>
                          <Button variant="destructive" size="sm" onClick={() => removeApproved(a.id)}>Remove</Button>
                        </div>
                      ))}
                      {approvedArtisans.length === 0 && (
                        <div className="text-sm text-muted-foreground">No approved artisans yet.</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="manage-artisans">
                <Card className="shadow-craft-soft">
                  <CardHeader>
                    <CardTitle>Manage Artisans (All)</CardTitle>
                    <CardDescription>Show or hide artisans on Explore</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        ...mockArtisans.map((a) => ({ manageId: `base-${a.id}`, name: a.name, specialty: a.specialty, location: a.location })),
                        ...approvedArtisans.map((a: any) => ({ manageId: `approved-${a.id}`, name: a.name, specialty: a.specialty, location: a.location })),
                      ].map((a) => {
                        const isHidden = removedIds.includes(a.manageId);
                        return (
                          <div key={a.manageId} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium flex items-center gap-2">
                                {a.name}
                                {isHidden && <span className="text-xs px-2 py-0.5 rounded bg-destructive/10 text-destructive">Removed</span>}
                              </p>
                              <p className="text-xs text-muted-foreground">{a.specialty} • {a.location}</p>
                            </div>
                            {isHidden ? (
                              <Button size="sm" variant="secondary" onClick={() => toggleVisibility(a.manageId, true)}>Restore</Button>
                            ) : (
                              <Button size="sm" variant="outline" onClick={() => toggleVisibility(a.manageId, false)}>Remove</Button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="users">
                <Card className="shadow-craft-soft">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>User Management</CardTitle>
                      <CardDescription>Manage platform users and permissions</CardDescription>
                    </div>
                    <Button size="sm">
                      <Users className="h-4 w-4 mr-2" />
                      Export Users
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { id: 1, email: "john.doe@example.com", role: "Customer", status: "Active", joined: "2024-01-15" },
                        { id: 2, email: "jane.smith@example.com", role: "Artisan", status: "Active", joined: "2024-02-20" },
                        { id: 3, email: "admin@craftmarket.com", role: "Admin", status: "Active", joined: "2023-12-01" },
                        { id: 4, email: "mike.wilson@example.com", role: "Customer", status: "Suspended", joined: "2024-03-10" },
                      ].map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                              <Users className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-medium">{user.email}</p>
                              <p className="text-sm text-muted-foreground">Joined: {user.joined}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <Badge variant="outline">{user.role}</Badge>
                              <p className="text-xs mt-1">
                                <Badge variant={user.status === "Active" ? "default" : "destructive"}>
                                  {user.status}
                                </Badge>
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                Edit
                              </Button>
                              <Button variant="outline" size="sm">
                                View
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics">
                <div className="grid gap-6">
                  {/* Performance Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="shadow-craft-soft">
                      <CardHeader>
                        <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">3.2%</div>
                        <p className="text-xs text-green-600">+0.5% from last month</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="shadow-craft-soft">
                      <CardHeader>
                        <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">$156.80</div>
                        <p className="text-xs text-green-600">+$12.30 from last month</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="shadow-craft-soft">
                      <CardHeader>
                        <CardTitle className="text-sm font-medium">Return Rate</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">2.1%</div>
                        <p className="text-xs text-red-600">+0.2% from last month</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Top Performing Products */}
                  <Card className="shadow-craft-soft">
                    <CardHeader>
                      <CardTitle>Top Performing Products</CardTitle>
                      <CardDescription>Best selling products this month</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {mockProducts.slice(0, 5).map((product, index) => (
                          <div key={product.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-muted rounded flex items-center justify-center text-sm font-medium">
                                #{index + 1}
                              </div>
                              <div>
                                <p className="font-medium text-sm">{product.name}</p>
                                <p className="text-xs text-muted-foreground">by {product.artisan}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-sm">{12 - index * 2} sales</p>
                              <p className="text-xs text-muted-foreground">${product.price}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </>
          )}

          {/* User Views */}
          {!isAdmin() && (
            <>
              <TabsContent value="purchases">
                <Card className="shadow-craft-soft">
                  <CardHeader>
                    <CardTitle>My Purchases</CardTitle>
                    <CardDescription>View your order history and track deliveries</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockOrders.slice(0, 2).map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-medium">{order.id}</p>
                            <p className="text-sm text-muted-foreground">
                              {order.products.length} item(s) • {order.orderDate}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${order.total.toFixed(2)}</p>
                            <Badge variant="secondary">{order.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="favorites">
                <Card className="shadow-craft-soft">
                  <CardHeader>
                    <CardTitle>Favorite Products</CardTitle>
                    <CardDescription>Products you've saved for later</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {mockProducts.slice(0, 3).map((product) => (
                        <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">by {product.artisan}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${product.price}</p>
                            <Button size="sm" variant="outline">
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Add to Cart
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="profile">
                <Card className="shadow-craft-soft">
                  <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription>Manage your account information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <UserCheck className="h-8 w-8 text-primary" />
                      <div>
                        <p className="font-medium">{user.email}</p>
                        <p className="text-sm text-muted-foreground">Verified Account</p>
                      </div>
                    </div>
                    <div className="pt-4 border-t">
                      <Button variant="outline" className="w-full">
                        Edit Profile Information
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;