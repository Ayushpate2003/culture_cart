import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/navigation/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2, User, Palette, Shield, CheckCircle } from "lucide-react";

const Profile = () => {
  const { currentUser, userProfile, updateUserRole, isAdmin, isArtisan, needsProfileCompletion } = useAuth();
  const [selectedRole, setSelectedRole] = useState<"user" | "artisan">("user");
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    // If user has a complete profile, redirect to dashboard
    if (userProfile && !needsProfileCompletion()) {
      navigate("/dashboard");
    }
  }, [currentUser, userProfile, needsProfileCompletion, navigate]);

  const handleRoleUpdate = async () => {
    if (!currentUser) return;

    setIsUpdating(true);
    try {
      await updateUserRole(selectedRole);
      toast({
        title: "Profile Updated",
        description: `Your account type has been set to ${selectedRole === 'artisan' ? 'Artisan' : 'Regular User'}.`,
      });
      // Small delay to ensure the profile is updated in context
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } catch (error) {
      console.error('Profile update error:', error);
      const errorMessage = error instanceof Error ? error.message : "Failed to update your profile. Please try again.";
      toast({
        title: "Update Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
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

  // If user already has a complete profile, show profile info
  if (userProfile && !needsProfileCompletion()) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-craft-soft">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  {getRoleIcon(userProfile.role)}
                  <CardTitle className="text-2xl font-heading">Your Profile</CardTitle>
                </div>
                <CardDescription>Welcome to CultureCart!</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-lg font-medium">Profile Complete</span>
                  </div>
                  
                  <div className="space-y-2">
                    <p><strong>Name:</strong> {userProfile.displayName || 'Not provided'}</p>
                    <p><strong>Email:</strong> {userProfile.email}</p>
                    <div className="flex items-center justify-center space-x-2">
                      <strong>Account Type:</strong>
                      <Badge variant={getRoleBadgeVariant(userProfile.role)}>
                        <span className="flex items-center space-x-1">
                          {getRoleIcon(userProfile.role)}
                          <span className="capitalize">{userProfile.role}</span>
                        </span>
                      </Badge>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button 
                      onClick={() => navigate("/dashboard")} 
                      className="w-full" 
                      variant="hero"
                    >
                      Go to Dashboard
                    </Button>
                  </div>

                  {/* Role-specific information */}
                  {isArtisan() && (
                    <div className="mt-6 p-4 bg-muted rounded-lg">
                      <h3 className="font-semibold mb-2">Artisan Benefits</h3>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Create and manage your product listings</li>
                        <li>• Access artisan dashboard and analytics</li>
                        <li>• Connect with customers directly</li>
                        <li>• Showcase your cultural crafts</li>
                      </ul>
                    </div>
                  )}

                  {isAdmin() && (
                    <div className="mt-6 p-4 bg-destructive/10 rounded-lg">
                      <h3 className="font-semibold mb-2">Admin Access</h3>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Manage all users and artisans</li>
                        <li>• Access admin dashboard</li>
                        <li>• View analytics and reports</li>
                        <li>• Moderate content and orders</li>
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Show role selection for new users (especially Google login users)
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <Card className="w-full max-w-lg shadow-craft-soft">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-heading">Complete Your Profile</CardTitle>
            <CardDescription>
              Welcome {currentUser?.displayName}! Please select your account type to get started.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-3 block">Choose Your Account Type</label>
              <Select value={selectedRole} onValueChange={(value: "user" | "artisan") => setSelectedRole(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <div>
                        <div className="font-medium">Regular User</div>
                        <div className="text-xs text-muted-foreground">Browse and purchase cultural products</div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="artisan">
                    <div className="flex items-center space-x-2">
                      <Palette className="h-4 w-4" />
                      <div>
                        <div className="font-medium">Artisan</div>
                        <div className="text-xs text-muted-foreground">Sell your cultural crafts and products</div>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              {selectedRole === "artisan" && (
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">As an Artisan, you can:</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• List and sell your cultural products</li>
                    <li>• Manage your artisan profile</li>
                    <li>• Access seller dashboard and analytics</li>
                    <li>• Connect with customers worldwide</li>
                  </ul>
                </div>
              )}

              {selectedRole === "user" && (
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">As a Regular User, you can:</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Browse cultural products from artisans</li>
                    <li>• Purchase authentic cultural items</li>
                    <li>• Read and share cultural stories</li>
                    <li>• Connect with the cultural community</li>
                  </ul>
                </div>
              )}
            </div>

            <Button
              onClick={handleRoleUpdate}
              className="w-full"
              variant="hero"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting up your profile...
                </>
              ) : (
                `Continue as ${selectedRole === 'artisan' ? 'Artisan' : 'Regular User'}`
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
