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
  RotateCcw, 
  Cloud, 
  HardDrive, 
  Users, 
  CheckCircle, 
  AlertCircle, 
  Download, 
  Upload,
  RefreshCw,
  Database,
  Wifi,
  WifiOff
} from "lucide-react";
import AdminSyncManager, { AdminUser } from "@/utils/adminSync";
import { checkFirebaseConfig, isFirebaseAvailable } from "@/utils/firebaseChecker";

const AdminSync = () => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState(AdminSyncManager.getSyncStatus());
  const [localProfiles, setLocalProfiles] = useState<AdminUser[]>([]);
  const [firebaseStatus, setFirebaseStatus] = useState({ configured: false, available: false });
  const [syncResults, setSyncResults] = useState<{
    localToCloud?: number;
    cloudToLocal?: number;
    errors?: string[];
  }>({});

  useEffect(() => {
    loadData();
    checkFirebaseStatus();
  }, []);

  const loadData = () => {
    setSyncStatus(AdminSyncManager.getSyncStatus());
    setLocalProfiles(AdminSyncManager.getLocalAdminProfiles());
  };

  const checkFirebaseStatus = async () => {
    const config = checkFirebaseConfig();
    const available = await isFirebaseAvailable();
    setFirebaseStatus({
      configured: config.isConfigured,
      available
    });
  };

  const handleSyncToCloud = async () => {
    if (!firebaseStatus.available) {
      toast({
        title: "Firebase Not Available",
        description: "Cannot sync to cloud. Firebase is not configured or available.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await AdminSyncManager.syncLocalToCloud();
      setSyncResults({ localToCloud: result.synced, errors: result.errors });
      
      if (result.success) {
        toast({
          title: "Sync Successful",
          description: `${result.synced} admin users synced to cloud`,
        });
      } else {
        toast({
          title: "Sync Completed with Errors",
          description: `${result.synced} synced, ${result.errors.length} errors`,
          variant: "destructive",
        });
      }
      
      loadData();
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "Failed to sync admin users to cloud",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncFromCloud = async () => {
    if (!firebaseStatus.available) {
      toast({
        title: "Firebase Not Available",
        description: "Cannot sync from cloud. Firebase is not configured or available.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await AdminSyncManager.syncCloudToLocal();
      setSyncResults({ cloudToLocal: result.synced, errors: result.errors });
      
      if (result.success) {
        toast({
          title: "Sync Successful",
          description: `${result.synced} admin users synced from cloud`,
        });
      } else {
        toast({
          title: "Sync Completed with Errors",
          description: `${result.synced} synced, ${result.errors.length} errors`,
          variant: "destructive",
        });
      }
      
      loadData();
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "Failed to sync admin users from cloud",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFullSync = async () => {
    if (!firebaseStatus.available) {
      toast({
        title: "Firebase Not Available",
        description: "Cannot perform full sync. Firebase is not configured or available.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await AdminSyncManager.performFullSync();
      setSyncResults({
        localToCloud: result.localToCloud,
        cloudToLocal: result.cloudToLocal,
        errors: result.errors
      });
      
      if (result.success) {
        toast({
          title: "Full Sync Successful",
          description: `${result.localToCloud} to cloud, ${result.cloudToLocal} from cloud`,
        });
      } else {
        toast({
          title: "Sync Completed with Errors",
          description: `Sync completed but encountered ${result.errors.length} errors`,
          variant: "destructive",
        });
      }
      
      loadData();
    } catch (error) {
      toast({
        title: "Full Sync Failed",
        description: "Failed to perform full synchronization",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = () => {
    const data = AdminSyncManager.exportAdminData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `admin-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Data Exported",
      description: "Admin data has been exported to file",
    });
  };

  const handleClearLocal = () => {
    if (confirm('Are you sure you want to clear all local admin data? This cannot be undone.')) {
      AdminSyncManager.clearLocalData();
      loadData();
      toast({
        title: "Local Data Cleared",
        description: "All local admin data has been removed",
      });
    }
  };

  // Check if user has admin access
  if (userProfile?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Access denied. Admin privileges required.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin-dashboard')}
            className="p-0 h-auto"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-heading font-bold">Admin Sync Manager</h1>
            <p className="text-muted-foreground">Manage admin users between local and cloud storage</p>
          </div>
        </div>

        {/* Firebase Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Firebase Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {firebaseStatus.available ? (
                    <Wifi className="h-4 w-4 text-green-500" />
                  ) : (
                    <WifiOff className="h-4 w-4 text-orange-500" />
                  )}
                  <span className={firebaseStatus.available ? "text-green-600" : "text-orange-600"}>
                    {firebaseStatus.available ? "Connected" : "Offline Mode"}
                  </span>
                </div>
                <Badge variant={firebaseStatus.configured ? "default" : "destructive"}>
                  {firebaseStatus.configured ? "Configured" : "Not Configured"}
                </Badge>
              </div>
              <Button variant="outline" size="sm" onClick={checkFirebaseStatus}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sync">Sync Operations</TabsTrigger>
            <TabsTrigger value="profiles">Admin Profiles</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Local Stats */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Local Admins</CardTitle>
                  <HardDrive className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{syncStatus.localAdmins}</div>
                  <p className="text-xs text-muted-foreground">
                    {syncStatus.localProfiles} detailed profiles
                  </p>
                </CardContent>
              </Card>

              {/* Sync Status */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Needs Sync</CardTitle>
                  <RotateCcw className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{syncStatus.needsSync}</div>
                  <p className="text-xs text-muted-foreground">
                    Local-only profiles
                  </p>
                </CardContent>
              </Card>

              {/* Firebase Status */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Cloud Status</CardTitle>
                  <Cloud className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {firebaseStatus.available ? "Online" : "Offline"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {firebaseStatus.configured ? "Configured" : "Not configured"}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Sync Results */}
            {(syncResults.localToCloud !== undefined || syncResults.cloudToLocal !== undefined) && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Last Sync Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {syncResults.localToCloud !== undefined && (
                      <p className="text-sm">
                        <CheckCircle className="h-4 w-4 inline mr-2 text-green-500" />
                        {syncResults.localToCloud} admin users synced to cloud
                      </p>
                    )}
                    {syncResults.cloudToLocal !== undefined && (
                      <p className="text-sm">
                        <CheckCircle className="h-4 w-4 inline mr-2 text-green-500" />
                        {syncResults.cloudToLocal} admin users synced from cloud
                      </p>
                    )}
                    {syncResults.errors && syncResults.errors.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-destructive">Errors:</p>
                        {syncResults.errors.map((error, index) => (
                          <p key={index} className="text-xs text-muted-foreground ml-4">
                            • {error}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="sync">
            <div className="space-y-6">
              {!firebaseStatus.available && (
                <Alert>
                  <WifiOff className="h-4 w-4" />
                  <AlertDescription>
                    Firebase is not available. Sync operations require a working Firebase connection.
                    Check your configuration and internet connection.
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Sync to Cloud
                    </CardTitle>
                    <CardDescription>
                      Upload local admin users to Firebase
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={handleSyncToCloud}
                      disabled={isLoading || !firebaseStatus.available}
                      className="w-full"
                    >
                      {isLoading ? "Syncing..." : "Sync to Cloud"}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Sync from Cloud
                    </CardTitle>
                    <CardDescription>
                      Download admin users from Firebase
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={handleSyncFromCloud}
                      disabled={isLoading || !firebaseStatus.available}
                      className="w-full"
                    >
                      {isLoading ? "Syncing..." : "Sync from Cloud"}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <RotateCcw className="h-4 w-4" />
                      Full Sync
                    </CardTitle>
                    <CardDescription>
                      Bidirectional synchronization
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={handleFullSync}
                      disabled={isLoading || !firebaseStatus.available}
                      className="w-full"
                      variant="default"
                    >
                      {isLoading ? "Syncing..." : "Full Sync"}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="profiles">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Local Admin Profiles
                </CardTitle>
                <CardDescription>
                  Manage admin user profiles stored locally
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {localProfiles.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No admin profiles found locally
                    </p>
                  ) : (
                    localProfiles.map((profile) => (
                      <div key={profile.uid} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{profile.displayName || 'No name'}</p>
                          <p className="text-sm text-muted-foreground">{profile.email}</p>
                          <p className="text-xs text-muted-foreground">
                            Created: {new Date(profile.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={
                            profile.syncStatus === 'synced' ? 'default' :
                            profile.syncStatus === 'local' ? 'secondary' : 'outline'
                          }>
                            {profile.syncStatus}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Data Management</CardTitle>
                  <CardDescription>
                    Export, import, or clear admin data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4">
                    <Button onClick={handleExportData} variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                    <Button onClick={handleClearLocal} variant="destructive">
                      Clear Local Data
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sync Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p><strong>Local Admins:</strong> {syncStatus.localAdmins}</p>
                    <p><strong>Local Profiles:</strong> {syncStatus.localProfiles}</p>
                    <p><strong>Needs Sync:</strong> {syncStatus.needsSync}</p>
                    {syncStatus.lastSyncAttempt && (
                      <p><strong>Last Sync:</strong> {new Date(syncStatus.lastSyncAttempt).toLocaleString()}</p>
                    )}
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

export default AdminSync;
