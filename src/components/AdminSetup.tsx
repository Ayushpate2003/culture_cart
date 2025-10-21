import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Shield, AlertCircle, CheckCircle, Database, Wifi, WifiOff } from "lucide-react";
import { promoteUserToAdmin, getUserProfile } from "@/utils/adminUtils";
import { checkFirebaseConfig, getFirebaseSetupInstructions, isFirebaseAvailable } from "@/utils/firebaseChecker";

/**
 * AdminSetup Component - Temporary utility for creating the first admin user
 * This component should be removed in production or protected behind proper authentication
 * 
 * ⚠️ SECURITY WARNING: This component has been secured and no longer allows
 * direct admin promotion. Use Firebase Console for admin setup instead.
 */
export const AdminSetup = () => {
  const { currentUser, userProfile, updateUserRole } = useAuth();
  const { toast } = useToast();
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const [firebaseStatus, setFirebaseStatus] = useState<{
    configured: boolean;
    available: boolean;
    missingVars: string[];
  }>({ configured: false, available: false, missingVars: [] });

  useEffect(() => {
    const checkFirebase = async () => {
      const config = checkFirebaseConfig();
      const available = await isFirebaseAvailable();
      
      setFirebaseStatus({
        configured: config.isConfigured,
        available,
        missingVars: config.missingVars
      });
    };

    checkFirebase();
    
    // Auto-fill current user ID if logged in
    if (currentUser) {
      setUserId(currentUser.uid);
    }
  }, [currentUser]);

  const handleAdminSetup = async () => {
    if (!userId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid User ID",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // ⚠️ SECURITY: This function is now disabled for security reasons
      const result = await promoteUserToAdmin(userId);
      
      if (result.success) {
        setSetupComplete(true);
        toast({
          title: "Admin Setup Complete",
          description: "User has been promoted to admin successfully!",
        });
      } else {
        toast({
          title: "Setup Failed",
          description: result.error || "Failed to promote user to admin",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Admin setup error:', error);
      toast({
        title: "Setup Error",
        description: "An unexpected error occurred during admin setup",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCurrentUserPromotion = async () => {
    if (!currentUser) {
      toast({
        title: "Error",
        description: "You must be logged in to promote yourself to admin",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // ⚠️ SECURITY: This will now fail due to security restrictions
      await updateUserRole('admin');
      
      setSetupComplete(true);
      toast({
        title: "Admin Setup Complete",
        description: "You have been promoted to admin successfully!",
      });
    } catch (error) {
      console.error('Self-promotion error:', error);
      toast({
        title: "Promotion Failed",
        description: error instanceof Error ? error.message : "Failed to promote to admin role",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Check if current user is already admin
  const isCurrentUserAdmin = userProfile?.role === 'admin';

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        
        {/* Security Warning */}
        <Alert variant="destructive">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>⚠️ SECURITY NOTICE:</strong> Admin promotion through this interface has been disabled for security reasons. 
            Use Firebase Console to create admin users instead.
          </AlertDescription>
        </Alert>

        {/* Firebase Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Firebase Configuration Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Configuration Status:</span>
                <div className="flex items-center gap-2">
                  {firebaseStatus.configured ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className={firebaseStatus.configured ? "text-green-600" : "text-red-600"}>
                    {firebaseStatus.configured ? "Configured" : "Not Configured"}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span>Firebase Connection:</span>
                <div className="flex items-center gap-2">
                  {firebaseStatus.available ? (
                    <Wifi className="h-4 w-4 text-green-500" />
                  ) : (
                    <WifiOff className="h-4 w-4 text-orange-500" />
                  )}
                  <span className={firebaseStatus.available ? "text-green-600" : "text-orange-600"}>
                    {firebaseStatus.available ? "Connected" : "Offline"}
                  </span>
                </div>
              </div>

              {firebaseStatus.missingVars.length > 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Missing environment variables: {firebaseStatus.missingVars.join(', ')}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Current User Status */}
        {currentUser && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Current User Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <strong>Email:</strong> {currentUser.email}
                </div>
                <div>
                  <strong>UID:</strong> {currentUser.uid}
                </div>
                <div>
                  <strong>Role:</strong> {userProfile?.role || 'Loading...'}
                </div>
                
                {isCurrentUserAdmin ? (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      ✅ You already have admin privileges!
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      You do not have admin privileges. Use Firebase Console to grant admin access.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Secure Admin Setup Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>🔐 Secure Admin Setup Instructions</CardTitle>
            <CardDescription>
              Follow these steps to safely create your first admin user
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Method 1: Firebase Console (Recommended)</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Create a regular account through the signup page</li>
                  <li>Go to Firebase Console → Firestore Database</li>
                  <li>Navigate to the 'users' collection</li>
                  <li>Find your user document</li>
                  <li>Edit: Change 'role' from 'user' to 'admin'</li>
                  <li>Add field 'isFirstAdmin': true</li>
                  <li>Save changes and refresh the application</li>
                </ol>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Method 2: Development Console</h4>
                <p className="text-sm mb-2">Open browser console and run:</p>
                <code className="text-xs bg-gray-100 p-2 rounded block">
                  // This will show secure setup instructions<br/>
                  import('./utils/adminUtils').then(m =&gt; m.setupInitialAdmin());
                </code>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Legacy Admin Setup (Disabled) */}
        <Card className="opacity-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Legacy Admin Setup (Disabled)
            </CardTitle>
            <CardDescription>
              This method has been disabled for security reasons
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="userId">User ID to Promote</Label>
                <Input
                  id="userId"
                  type="text"
                  placeholder="Enter Firebase User UID"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  disabled={true}
                />
              </div>
              
              <div className="flex gap-4">
                <Button 
                  onClick={handleAdminSetup}
                  disabled={true}
                  className="flex-1"
                >
                  Promote User to Admin (Disabled)
                </Button>
                
                {currentUser && (
                  <Button 
                    onClick={handleCurrentUserPromotion}
                    disabled={true}
                    variant="outline"
                    className="flex-1"
                  >
                    Promote Self to Admin (Disabled)
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Success State */}
        {setupComplete && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle className="h-5 w-5" />
                <span className="font-semibold">Admin Setup Complete!</span>
              </div>
              <p className="text-green-600 mt-2">
                You can now access the admin dashboard and other admin features.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminSetup;
