import { doc, setDoc, getDoc, updateDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/config/firebase';

export interface AdminUser {
  uid: string;
  email: string;
  displayName: string | null;
  role: 'admin';
  createdAt: string;
  lastSync: string;
  syncStatus: 'local' | 'cloud' | 'synced';
}

/**
 * Admin Sync Utility - Manages admin users between local storage and Firebase
 * Provides seamless transition from local development to cloud production
 */
export class AdminSyncManager {
  private static readonly LOCAL_ADMINS_KEY = 'localAdminUsers';
  private static readonly ADMIN_PROFILES_KEY = 'adminProfiles';

  /**
   * Get all local admin users from localStorage
   */
  static getLocalAdmins(): string[] {
    try {
      return JSON.parse(localStorage.getItem(this.LOCAL_ADMINS_KEY) || '[]');
    } catch {
      return [];
    }
  }

  /**
   * Get admin profiles from localStorage
   */
  static getLocalAdminProfiles(): AdminUser[] {
    try {
      return JSON.parse(localStorage.getItem(this.ADMIN_PROFILES_KEY) || '[]');
    } catch {
      return [];
    }
  }

  /**
   * Add admin user to local storage
   */
  static addLocalAdmin(email: string, userProfile?: Partial<AdminUser>): void {
    const localAdmins = this.getLocalAdmins();
    if (!localAdmins.includes(email)) {
      localAdmins.push(email);
      localStorage.setItem(this.LOCAL_ADMINS_KEY, JSON.stringify(localAdmins));
    }

    // Store detailed profile if provided
    if (userProfile) {
      const profiles = this.getLocalAdminProfiles();
      const existingIndex = profiles.findIndex(p => p.email === email);
      
      const adminProfile: AdminUser = {
        uid: userProfile.uid || '',
        email,
        displayName: userProfile.displayName || null,
        role: 'admin',
        createdAt: userProfile.createdAt || new Date().toISOString(),
        lastSync: new Date().toISOString(),
        syncStatus: 'local'
      };

      if (existingIndex >= 0) {
        profiles[existingIndex] = adminProfile;
      } else {
        profiles.push(adminProfile);
      }

      localStorage.setItem(this.ADMIN_PROFILES_KEY, JSON.stringify(profiles));
    }
  }

  /**
   * Remove admin user from local storage
   */
  static removeLocalAdmin(email: string): void {
    const localAdmins = this.getLocalAdmins().filter(admin => admin !== email);
    localStorage.setItem(this.LOCAL_ADMINS_KEY, JSON.stringify(localAdmins));

    const profiles = this.getLocalAdminProfiles().filter(p => p.email !== email);
    localStorage.setItem(this.ADMIN_PROFILES_KEY, JSON.stringify(profiles));
  }

  /**
   * Check if user is admin (local or cloud)
   */
  static async isAdmin(email: string, uid?: string): Promise<boolean> {
    // Check local admins first
    const localAdmins = this.getLocalAdmins();
    if (localAdmins.includes(email)) {
      return true;
    }

    // Check cloud Firebase if available and UID provided
    if (uid) {
      try {
        const userDoc = await getDoc(doc(db, 'users', uid));
        if (userDoc.exists() && userDoc.data().role === 'admin') {
          return true;
        }
      } catch (error) {
        console.warn('Firebase not available for admin check:', error);
      }
    }

    return false;
  }

  /**
   * Sync local admin users to Firebase
   */
  static async syncLocalToCloud(): Promise<{
    success: boolean;
    synced: number;
    errors: string[];
  }> {
    const result = {
      success: true,
      synced: 0,
      errors: [] as string[]
    };

    try {
      const localProfiles = this.getLocalAdminProfiles();
      
      for (const profile of localProfiles) {
        if (profile.syncStatus === 'local' && profile.uid) {
          try {
            const userDocRef = doc(db, 'users', profile.uid);
            
            await setDoc(userDocRef, {
              uid: profile.uid,
              email: profile.email,
              displayName: profile.displayName,
              role: 'admin',
              createdAt: profile.createdAt,
              lastSync: new Date().toISOString(),
              syncedFromLocal: true
            }, { merge: true });

            // Update local profile sync status
            profile.syncStatus = 'synced';
            profile.lastSync = new Date().toISOString();
            
            result.synced++;
          } catch (error) {
            const errorMsg = `Failed to sync ${profile.email}: ${error}`;
            result.errors.push(errorMsg);
            console.error(errorMsg);
          }
        }
      }

      // Update local storage with sync status
      localStorage.setItem(this.ADMIN_PROFILES_KEY, JSON.stringify(localProfiles));

    } catch (error) {
      result.success = false;
      result.errors.push(`Sync operation failed: ${error}`);
    }

    return result;
  }

  /**
   * Sync cloud admin users to local
   */
  static async syncCloudToLocal(): Promise<{
    success: boolean;
    synced: number;
    errors: string[];
  }> {
    const result = {
      success: true,
      synced: 0,
      errors: [] as string[]
    };

    try {
      // Query all admin users from Firebase
      const usersRef = collection(db, 'users');
      const adminQuery = query(usersRef, where('role', '==', 'admin'));
      const querySnapshot = await getDocs(adminQuery);

      const localAdmins = this.getLocalAdmins();
      const localProfiles = this.getLocalAdminProfiles();

      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        
        if (userData.email && !localAdmins.includes(userData.email)) {
          // Add to local admins
          localAdmins.push(userData.email);
          
          // Add to local profiles
          const adminProfile: AdminUser = {
            uid: userData.uid || doc.id,
            email: userData.email,
            displayName: userData.displayName || null,
            role: 'admin',
            createdAt: userData.createdAt || new Date().toISOString(),
            lastSync: new Date().toISOString(),
            syncStatus: 'synced'
          };
          
          localProfiles.push(adminProfile);
          result.synced++;
        }
      });

      // Update local storage
      localStorage.setItem(this.LOCAL_ADMINS_KEY, JSON.stringify(localAdmins));
      localStorage.setItem(this.ADMIN_PROFILES_KEY, JSON.stringify(localProfiles));

    } catch (error) {
      result.success = false;
      result.errors.push(`Cloud sync failed: ${error}`);
    }

    return result;
  }

  /**
   * Perform bidirectional sync
   */
  static async performFullSync(): Promise<{
    success: boolean;
    localToCloud: number;
    cloudToLocal: number;
    errors: string[];
  }> {
    const result = {
      success: true,
      localToCloud: 0,
      cloudToLocal: 0,
      errors: [] as string[]
    };

    try {
      // Sync local to cloud first
      const localSync = await this.syncLocalToCloud();
      result.localToCloud = localSync.synced;
      result.errors.push(...localSync.errors);

      // Then sync cloud to local
      const cloudSync = await this.syncCloudToLocal();
      result.cloudToLocal = cloudSync.synced;
      result.errors.push(...cloudSync.errors);

      result.success = localSync.success && cloudSync.success;

    } catch (error) {
      result.success = false;
      result.errors.push(`Full sync failed: ${error}`);
    }

    return result;
  }

  /**
   * Get sync status information
   */
  static getSyncStatus(): {
    localAdmins: number;
    localProfiles: number;
    needsSync: number;
    lastSyncAttempt?: string;
  } {
    const localAdmins = this.getLocalAdmins();
    const localProfiles = this.getLocalAdminProfiles();
    const needsSync = localProfiles.filter(p => p.syncStatus === 'local').length;

    return {
      localAdmins: localAdmins.length,
      localProfiles: localProfiles.length,
      needsSync,
      lastSyncAttempt: localStorage.getItem('lastSyncAttempt') || undefined
    };
  }

  /**
   * Clear all local admin data (use with caution)
   */
  static clearLocalData(): void {
    localStorage.removeItem(this.LOCAL_ADMINS_KEY);
    localStorage.removeItem(this.ADMIN_PROFILES_KEY);
    localStorage.removeItem('lastSyncAttempt');
  }

  /**
   * Export admin data for backup
   */
  static exportAdminData(): {
    admins: string[];
    profiles: AdminUser[];
    exportDate: string;
  } {
    return {
      admins: this.getLocalAdmins(),
      profiles: this.getLocalAdminProfiles(),
      exportDate: new Date().toISOString()
    };
  }

  /**
   * Import admin data from backup
   */
  static importAdminData(data: {
    admins: string[];
    profiles: AdminUser[];
  }): void {
    localStorage.setItem(this.LOCAL_ADMINS_KEY, JSON.stringify(data.admins));
    localStorage.setItem(this.ADMIN_PROFILES_KEY, JSON.stringify(data.profiles));
  }
}

export default AdminSyncManager;
