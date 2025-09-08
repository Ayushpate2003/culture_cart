import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navbar } from "@/components/navigation/Navbar";
import { ArrowLeft, Search, Filter, Download, Eye, Package, Truck } from "lucide-react";
import { mockOrders } from "@/data/mockData";

const ViewOrders = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "delivered": return "default";
      case "shipped": return "secondary";
      case "processing": return "secondary";
      case "pending": return "outline";
      default: return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "text-green-600";
      case "shipped": return "text-blue-600";
      case "processing": return "text-yellow-600";
      case "pending": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const ordersByStatus = {
    all: mockOrders,
    pending: mockOrders.filter(o => o.status === "pending"),
    processing: mockOrders.filter(o => o.status === "processing"),
    shipped: mockOrders.filter(o => o.status === "shipped"),
    delivered: mockOrders.filter(o => o.status === "delivered")
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-heading font-bold">Order Management</h1>
            <p className="text-muted-foreground mt-2">
              View and manage all customer orders
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Orders
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {Object.entries(ordersByStatus).map(([status, orders]) => {
            if (status === "all") return null;
            return (
              <Card key={status} className="shadow-craft-soft">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium capitalize">{status} Orders</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{orders.length}</div>
                  <p className="text-xs text-muted-foreground">
                    ${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)} total
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Filters and Search */}
        <Card className="shadow-craft-soft mb-6">
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div>
                <CardTitle>Order Filters</CardTitle>
                <CardDescription>Search and filter orders</CardDescription>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-80">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by order ID or customer email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Orders Tabs */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Orders ({mockOrders.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({ordersByStatus.pending.length})</TabsTrigger>
            <TabsTrigger value="processing">Processing ({ordersByStatus.processing.length})</TabsTrigger>
            <TabsTrigger value="shipped">Shipped ({ordersByStatus.shipped.length})</TabsTrigger>
            <TabsTrigger value="delivered">Delivered ({ordersByStatus.delivered.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <OrdersList orders={filteredOrders} />
          </TabsContent>
          <TabsContent value="pending">
            <OrdersList orders={ordersByStatus.pending} />
          </TabsContent>
          <TabsContent value="processing">
            <OrdersList orders={ordersByStatus.processing} />
          </TabsContent>
          <TabsContent value="shipped">
            <OrdersList orders={ordersByStatus.shipped} />
          </TabsContent>
          <TabsContent value="delivered">
            <OrdersList orders={ordersByStatus.delivered} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const OrdersList = ({ orders }: { orders: typeof mockOrders }) => {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "delivered": return "default";
      case "shipped": return "secondary";
      case "processing": return "secondary";
      case "pending": return "outline";
      default: return "outline";
    }
  };

  return (
    <Card className="shadow-craft-soft">
      <CardHeader>
        <CardTitle>Orders ({orders.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                    <p className="text-xs text-muted-foreground">{order.orderDate}</p>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium">
                      {order.products.length} item{order.products.length > 1 ? 's' : ''}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.products.map(p => p.productName).join(", ")}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-medium">${order.total.toFixed(2)}</p>
                  <Badge variant={getStatusVariant(order.status)}>
                    {order.status}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  {order.status === "processing" && (
                    <Button variant="outline" size="sm">
                      <Truck className="h-4 w-4 mr-1" />
                      Ship
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No orders found matching your criteria.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ViewOrders;