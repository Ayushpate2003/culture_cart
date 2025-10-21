import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navbar } from "@/components/navigation/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Database, 
  Wifi, 
  WifiOff,
  User,
  Settings,
  BookOpen,
  ExternalLink
} from "lucide-react";
import { checkFirebaseConfig, isFirebaseAvailable, getFirebaseSetupInstructions } from "@/utils/firebaseChecker";
import { setupInitialAdmin } from "@/utils/adminUtils";

/**
 * AdminSetupPage - Comprehensive admin setup and configuration page
 * 
 * ⚠️ SECURITY: This page provides secure instructions for admin setup
 * but does not allow direct admin promotion for security reasons.
 */
const AdminSetupPage = () => {
  const navigate = useNavigate();
  const { currentUser, userProfile, isAdmin } = useAuth();
  const { toast } = useToast();
  
  const [firebaseStatus, setFirebaseStatus] = useState({
    configured: false,
    available: false,
    missingVars: [] as string[]
  });
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    checkFirebaseStatus();
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

  const handleShowInstructions = () => {
    setupInitialAdmin();
    toast({
      title: "Instructions Displayed",
      description: "Check the browser console for detailed setup instructions",
    });
  };

  const getStatusBadge = (status: boolean, trueText: string, falseText: string) => {
    return (
      <Badge variant={status ? "default" : "destructive"}>
        {status ? trueText : falseText}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-8">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="p-0 h-auto"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <div>
            <h1 className="text-3xl font-heading font-bold flex items-center gap-2">
              <Shield className="h-8 w-8" />
              Admin Setup & Configuration
            </h1>
            <p className="text-muted-foreground">Secure admin initialization and system configuration</p>
          </div>
        </div>

        {/* Security Notice */}
        <Alert variant="destructive" className="mb-6">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>🔐 SECURITY NOTICE:</strong> For security reasons, admin users cannot be created through this web interface. 
            This page provides secure instructions for admin setup using Firebase Console or server-side tools.
          </AlertDescription>
        </Alert>

        {/* Current Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Firebase Config</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {firebaseStatus.configured ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                )}
                {getStatusBadge(firebaseStatus.configured, "Configured", "Missing")}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Connection</CardTitle>
              <Wifi className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {firebaseStatus.available ? (
                  <Wifi className="h-4 w-4 text-green-500" />
                ) : (
                  <WifiOff className="h-4 w-4 text-orange-500" />
                )}
                {getStatusBadge(firebaseStatus.available, "Connected", "Offline")}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">User Status</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {currentUser ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                )}
                {getStatusBadge(!!currentUser, "Logged In", "Not Logged In")}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admin Status</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {isAdmin() ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                )}
                {getStatusBadge(isAdmin(), "Admin", "Not Admin")}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="setup">Admin Setup</TabsTrigger>
            <TabsTrigger value="firebase">Firebase Config</TabsTrigger>
            <TabsTrigger value="troubleshoot">Troubleshoot</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Overview</CardTitle>
                  <CardDescription>Current status of your CultureCart admin setup</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  {/* Current User Info */}
                  {currentUser ? (
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-semibold mb-2">Current User</h4>
                      <div className="space-y-1 text-sm">
                        <p><strong>Email:</strong> {currentUser.email}</p>
                        <p><strong>UID:</strong> {currentUser.uid}</p>
                        <p><strong>Role:</strong> {userProfile?.role || 'Loading...'}</p>
                        <p><strong>Admin Status:</strong> {isAdmin() ? '✅ Admin' : '❌ Not Admin'}</p>
                      </div>
                    </div>
                  ) : (
                    <Alert>
                      <User className="h-4 w-4" />
                      <AlertDescription>
                        You are not logged in. <a href="/login" className="text-blue-600 underline">Login here</a> or <a href="/signup" className="text-blue-600 underline">create an account</a>.
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Admin Status */}
                  {isAdmin() ? (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        ✅ <strong>You have admin privileges!</strong> You can access the <a href="/admin-dashboard" className="text-blue-600 underline">Admin Dashboard</a>.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        You do not have admin privileges. Follow the setup instructions in the "Admin Setup" tab.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Admin Setup Tab */}
          <TabsContent value="setup">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Secure Admin Setup Instructions
                  </CardTitle>
                  <CardDescription>
                    Follow these steps to safely create your first admin user
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Method 1: Firebase Console */}
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <ExternalLink className="h-4 w-4" />
                      Method 1: Firebase Console (Recommended)
                    </h4>
                    <ol className="list-decimal list-inside space-y-2 text-sm">
                      <li>Create a regular user account through the <a href="/signup" className="text-blue-600 underline">signup page</a></li>
                      <li>Go to <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Firebase Console</a></li>
                      <li>Navigate to <strong>Firestore Database</strong></li>
                      <li>Find the <code className="bg-gray-100 px-1 rounded">users</code> collection</li>
                      <li>Locate your user document (search by email)</li>
                      <li>Edit the document:
                        <ul className="list-disc list-inside ml-4 mt-1">
                          <li>Change <code className="bg-gray-100 px-1 rounded">role</code> from <code className="bg-gray-100 px-1 rounded">"user"</code> to <code className="bg-gray-100 px-1 rounded">"admin"</code></li>
                          <li>Add field <code className="bg-gray-100 px-1 rounded">isFirstAdmin: true</code></li>
                        </ul>
                      </li>
                      <li>Save changes and refresh this page</li>
                    </ol>
                  </div>

                  {/* Method 2: Development Console */}
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Method 2: Development Console
                    </h4>
                    <p className="text-sm mb-3">For development purposes, you can view detailed instructions in the browser console:</p>
                    <Button onClick={handleShowInstructions} variant="outline" size="sm">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Show Console Instructions
                    </Button>
                  </div>

                  {/* Security Notes */}
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Security Notes:</strong>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Only ONE admin user is allowed per system</li>
                        <li>Admin promotion cannot be done through the web interface</li>
                        <li>All admin operations are logged and auditable</li>
                        <li>Use Firebase Functions or server-side tools for production</li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Firebase Config Tab */}
          <TabsContent value="firebase">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Firebase Configuration
                </CardTitle>
                <CardDescription>
                  Check and configure your Firebase connection
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {/* Configuration Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 border rounded">
                    <div className="flex items-center justify-between">
                      <span>Configuration Status</span>
                      {getStatusBadge(firebaseStatus.configured, "Complete", "Incomplete")}
                    </div>
                  </div>
                  <div className="p-3 border rounded">
                    <div className="flex items-center justify-between">
                      <span>Connection Status</span>
                      {getStatusBadge(firebaseStatus.available, "Connected", "Disconnected")}
                    </div>
                  </div>
                </div>

                {/* Missing Variables */}
                {firebaseStatus.missingVars.length > 0 && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Missing Environment Variables:</strong>
                      <ul className="list-disc list-inside mt-2">
                        {firebaseStatus.missingVars.map((varName) => (
                          <li key={varName}><code className="bg-gray-100 px-1 rounded">{varName}</code></li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Setup Instructions */}
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Firebase Setup Steps:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Create a Firebase project at <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Firebase Console</a></li>
                    <li>Enable Authentication and Firestore Database</li>
                    <li>Copy <code className="bg-gray-100 px-1 rounded">.env.example</code> to <code className="bg-gray-100 px-1 rounded">.env</code></li>
                    <li>Fill in Firebase config values from Project Settings</li>
                    <li>Restart your development server</li>
                  </ol>
                </div>

                <Button onClick={checkFirebaseStatus} variant="outline">
                  <Database className="h-4 w-4 mr-2" />
                  Refresh Status
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Troubleshoot Tab */}
          <TabsContent value="troubleshoot">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Common Issues & Solutions</CardTitle>
                  <CardDescription>
                    Troubleshoot common admin setup problems
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  {/* Issue 1: 404 Error */}
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">❌ Getting 404 Error on Admin Pages</h4>
                    <p className="text-sm mb-2"><strong>Cause:</strong> Not logged in or missing admin privileges</p>
                    <p className="text-sm"><strong>Solution:</strong> Ensure you're logged in and have admin role in Firestore</p>
                  </div>

                  {/* Issue 2: Firebase Not Configured */}
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">❌ Firebase Not Configured</h4>
                    <p className="text-sm mb-2"><strong>Cause:</strong> Missing environment variables</p>
                    <p className="text-sm"><strong>Solution:</strong> Set up <code className="bg-gray-100 px-1 rounded">.env</code> file with Firebase config</p>
                  </div>

                  {/* Issue 3: Can't Promote to Admin */}
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">❌ Cannot Promote to Admin</h4>
                    <p className="text-sm mb-2"><strong>Cause:</strong> Security restrictions prevent web-based promotion</p>
                    <p className="text-sm"><strong>Solution:</strong> Use Firebase Console to manually set admin role</p>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-4">
                    <Button onClick={() => navigate('/admin-debug')} variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Detailed Diagnostics
                    </Button>
                    <Button onClick={() => window.open('https://console.firebase.google.com', '_blank')} variant="outline">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open Firebase Console
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminSetupPage;
