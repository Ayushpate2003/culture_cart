import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Stories from "./pages/Stories";
import Help from "./pages/Help";
import ArtisanSignup from "./pages/ArtisanSignup";
import ProductCatalog from "./pages/ProductCatalog";
import ProductDetail from "./pages/ProductDetail";
import ArtisanProfiles from "./pages/ArtisanProfiles";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import AddProduct from "./pages/admin/AddProduct";
import AddArtisan from "./pages/admin/AddArtisan";
import ViewOrders from "./pages/admin/ViewOrders";
import Analytics from "./pages/admin/Analytics";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/help" element={<Help />} />
          <Route path="/signup" element={<ArtisanSignup />} />
          <Route path="/catalog" element={<ProductCatalog />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/artisans" element={<ArtisanProfiles />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin/add-product" element={<AddProduct />} />
          <Route path="/admin/add-artisan" element={<AddArtisan />} />
          <Route path="/admin/view-orders" element={<ViewOrders />} />
          <Route path="/admin/analytics" element={<Analytics />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
