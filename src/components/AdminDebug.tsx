import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { checkFirebaseConfig, isFirebaseAvailable } from "@/utils/firebaseChecker";
import { testFirebaseConnection } from "@/utils/firebase-test";
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Database, 
  User, 
  Shield,
  RefreshCw
} from "lucide-react";

/**
 * Admin Debug Component - Helps diagnose admin access issues
 * This component should be removed in production
 */
export const AdminDebug = () => {
  const { currentUser, userProfile, loading, isAdmin } = useAuth();
  const [firebaseStatus, setFirebaseStatus] = useState({
    configured: false,
    available: false,
    missingVars: [] as string[]
  });

  useEffect(() => {
    checkFirebaseStatus();
    // Run Firebase connection test
    if (import.meta.env.DEV) {
      testFirebaseConnection();
    }
  }, []);

  const checkFirebaseStatus = async () => {
    const config = checkFirebaseConfig();
    const available = await isFirebaseAvailable();
    
    setFirebaseStatus({
      configured: config.isConfigured,
      available,
      missingVars: config.missingVars
    });
  };

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  const getStatusBadge = (status: boolean, trueText: string, falseText: string) => {
    return (
      <Badge variant={status ? "default" : "destructive"}>
        {status ? trueText : falseText}
      </Badge>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Admin Access Diagnostic
          </CardTitle>
          <CardDescription>
            Debug information for admin access issues
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Authentication Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-4 w-4" />
              Authentication Status
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 border rounded">
                <span>Loading State</span>
                {getStatusBadge(!loading, "Ready", "Loading")}
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded">
                <span>User Logged In</span>
                {getStatusIcon(!!currentUser)}
                {getStatusBadge(!!currentUser, "Yes", "No")}
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded">
                <span>User Profile Loaded</span>
                {getStatusIcon(!!userProfile)}
                {getStatusBadge(!!userProfile, "Yes", "No")}
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded">
                <span>Admin Status</span>
                {getStatusIcon(isAdmin())}
                {getStatusBadge(isAdmin(), "Admin", "Not Admin")}
              </div>
            </div>

            {/* User Details */}
            {currentUser && (
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Current User Details:</h4>
                <div className="text-sm space-y-1">
                  <p><strong>UID:</strong> {currentUser.uid}</p>
                  <p><strong>Email:</strong> {currentUser.email}</p>
                  <p><strong>Display Name:</strong> {currentUser.displayName || 'Not set'}</p>
                  <p><strong>Email Verified:</strong> {currentUser.emailVerified ? 'Yes' : 'No'}</p>
                </div>
              </div>
            )}

            {/* User Profile Details */}
            {userProfile && (
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">User Profile Details:</h4>
                <div className="text-sm space-y-1">
                  <p><strong>Role:</strong> {userProfile.role}</p>
                  <p><strong>Profile UID:</strong> {userProfile.uid}</p>
                  <p><strong>Profile Email:</strong> {userProfile.email}</p>
                </div>
              </div>
            )}
          </div>

          {/* Firebase Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Database className="h-4 w-4" />
              Firebase Configuration
              <Button 
                variant="outline" 
                size="sm" 
                onClick={checkFirebaseStatus}
                className="ml-auto"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 border rounded">
                <span>Environment Variables</span>
                {getStatusIcon(firebaseStatus.configured)}
                {getStatusBadge(firebaseStatus.configured, "Configured", "Missing")}
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded">
                <span>Firebase Available</span>
                {getStatusIcon(firebaseStatus.available)}
                {getStatusBadge(firebaseStatus.available, "Connected", "Offline")}
              </div>
            </div>

            {/* Missing Environment Variables */}
            {firebaseStatus.missingVars.length > 0 && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Missing Environment Variables:</strong>
                  <ul className="mt-2 list-disc list-inside">
                    {firebaseStatus.missingVars.map((varName) => (
                      <li key={varName}>{varName}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Troubleshooting Steps */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Troubleshooting Steps</h3>
            
            {!firebaseStatus.configured && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Step 1:</strong> Set up Firebase environment variables
                  <ol className="mt-2 list-decimal list-inside space-y-1">
                    <li>Copy <code>.env.example</code> to <code>.env</code></li>
                    <li>Fill in your Firebase configuration from Firebase Console</li>
                    <li>Restart your development server</li>
                  </ol>
                </AlertDescription>
              </Alert>
            )}

            {!currentUser && firebaseStatus.configured && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Step 2:</strong> You need to log in first
                  <p className="mt-2">
                    <a href="/login" className="text-blue-600 underline">Go to Login Page</a>
                  </p>
                </AlertDescription>
              </Alert>
            )}

            {currentUser && !userProfile && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Step 3:</strong> User profile not found in Firestore
                  <p className="mt-2">This might be a Firestore connection issue or the user document doesn't exist.</p>
                </AlertDescription>
              </Alert>
            )}

            {userProfile && userProfile.role !== 'admin' && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Step 4:</strong> Grant admin privileges
                  <ol className="mt-2 list-decimal list-inside space-y-1">
                    <li>Go to Firebase Console → Firestore Database</li>
                    <li>Find your user document in the 'users' collection</li>
                    <li>Change 'role' field from '{userProfile.role}' to 'admin'</li>
                    <li>Add field 'isFirstAdmin': true</li>
                    <li>Refresh this page</li>
                  </ol>
                </AlertDescription>
              </Alert>
            )}

            {isAdmin() && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>✅ All checks passed!</strong> You should be able to access admin pages.
                  <p className="mt-2">
                    <a href="/admin-dashboard" className="text-blue-600 underline">Go to Admin Dashboard</a>
                  </p>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDebug;
