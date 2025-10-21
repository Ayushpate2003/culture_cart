import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
// Import Firebase test utility in development
if (import.meta.env.DEV) {
  import("@/utils/firebase-test");
}
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Stories from "./pages/Stories";
import Help from "./pages/Help";
import ArtisanSignup from "./pages/ArtisanSignup";
import ProductCatalog from "./pages/ProductCatalog";
import ProductDetail from "./pages/ProductDetail";
import ArtisanProfiles from "./pages/ArtisanProfiles";
import Dashboard from "./pages/Dashboard";
import UserDashboard from "./pages/UserDashboard";
import NotFound from "./pages/NotFound";
import AddProduct from "./pages/admin/AddProduct";
import AddArtisan from "./pages/admin/AddArtisan";
import ViewOrders from "./pages/admin/ViewOrders";
import Analytics from "./pages/admin/Analytics";
import UserManagement from "./pages/admin/UserManagement";
import AdminSync from "./pages/admin/AdminSync";

import ResetPassword from "./pages/ResetPassword";
import SubmitStory from "./pages/SubmitStory";
import AdminDebug from "./components/AdminDebug";
import AdminSetup from "./components/AdminSetup";
import AdminSetupPage from "./pages/AdminSetupPage";

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
              <Route path="/signup" element={<Signup />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/stories" element={<Stories />} />
              <Route path="/help" element={<Help />} />
              <Route path="/artisan-signup" element={<ArtisanSignup />} />
              <Route path="/catalog" element={<ProductCatalog />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/artisans" element={<ArtisanProfiles />} />
              
              {/* Admin setup removed for security - use Firebase console or server-side tools */}
              
              {/* Temporary Debug Route - Remove in production */}
              <Route path="/admin-debug" element={<AdminDebug />} />
              
              {/* Secure Admin Setup Page - Shows instructions only */}
              <Route path="/admin-setup" element={<AdminSetupPage />} />
              
              {/* Protected Routes - Require Authentication */}
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <UserDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin-dashboard" 
                element={
                  <ProtectedRoute requireAdmin>
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
              <Route 
                path="/admin/user-management" 
                element={
                  <ProtectedRoute requireAdmin>
                    <UserManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/sync" 
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminSync />
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
