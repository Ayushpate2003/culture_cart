import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
// import Signup from "./pages/Signup"; // File doesn't exist yet
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
import SubmitStory from "./pages/SubmitStory";
// import ResetPassword from "./pages/ResetPassword"; // TODO: Create this page

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<ArtisanSignup />} />
              {/* <Route path="/reset-password" element={<ResetPassword />} /> */}
              <Route path="/stories" element={<Stories />} />
              <Route path="/help" element={<Help />} />
              <Route path="/artisan-signup" element={<ArtisanSignup />} />
              <Route path="/catalog" element={<ProductCatalog />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/artisans" element={<ArtisanProfiles />} />
              
              {/* Protected Routes - Require Authentication */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/stories/submit" 
                element={
                  <ProtectedRoute>
                    <SubmitStory />
                  </ProtectedRoute>
                } 
              />
              
              {/* Admin Only Routes */}
              <Route 
                path="/admin/add-product" 
                element={
                  <ProtectedRoute requireAdmin>
                    <AddProduct />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/add-artisan" 
                element={
                  <ProtectedRoute requireAdmin>
                    <AddArtisan />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/view-orders" 
                element={
                  <ProtectedRoute requireAdmin>
                    <ViewOrders />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/analytics" 
                element={
                  <ProtectedRoute requireAdmin>
                    <Analytics />
                  </ProtectedRoute>
                } 
              />
              
              {/* 404 - Catch All */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
