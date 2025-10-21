import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';

/**
 * SECURE ADMIN INITIALIZATION UTILITY
 * 
 * This utility should ONLY be used by system administrators
 * through secure server-side processes or Firebase console.
 * 
 * DO NOT expose these functions to client-side UI components.
 */

export interface AdminInitConfig {
  uid: string;
  email: string;
  displayName: string;
}

/**
 * Initialize the first admin user (should only be called once during setup)
 * This function should be called from a secure server environment or Firebase Functions
 */
export const initializeFirstAdmin = async (config: AdminInitConfig): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    // Check if any admin already exists
    const usersRef = collection(db, 'users');
    const adminQuery = query(usersRef, where('role', '==', 'admin'));
    const existingAdmins = await getDocs(adminQuery);
    
    if (!existingAdmins.empty) {
      return {
        success: false,
        error: 'Admin user already exists. Only one admin is allowed.'
      };
    }
    
    // Create the first admin user
    const userDocRef = doc(db, 'users', config.uid);
    await setDoc(userDocRef, {
      uid: config.uid,
      email: config.email,
      displayName: config.displayName,
      role: 'admin',
      createdAt: new Date().toISOString(),
      isFirstAdmin: true,
      createdBy: 'system_initialization'
    });
    
    console.log(`First admin user initialized: ${config.email}`);
    return { success: true };
    
  } catch (error) {
    console.error('Error initializing first admin:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Check if the system has been initialized with an admin
 */
export const hasAdminUser = async (): Promise<boolean> => {
  try {
    const usersRef = collection(db, 'users');
    const adminQuery = query(usersRef, where('role', '==', 'admin'));
    const adminSnapshot = await getDocs(adminQuery);
    
    return !adminSnapshot.empty;
  } catch (error) {
    console.error('Error checking for admin users:', error);
    return false;
  }
};

/**
 * Get the first admin user info (for system verification)
 */
export const getFirstAdmin = async (): Promise<AdminInitConfig | null> => {
  try {
    const usersRef = collection(db, 'users');
    const adminQuery = query(usersRef, where('role', '==', 'admin'), where('isFirstAdmin', '==', true));
    const adminSnapshot = await getDocs(adminQuery);
    
    if (adminSnapshot.empty) {
      return null;
    }
    
    const adminDoc = adminSnapshot.docs[0];
    const data = adminDoc.data();
    
    return {
      uid: data.uid,
      email: data.email,
      displayName: data.displayName
    };
  } catch (error) {
    console.error('Error getting first admin:', error);
    return null;
  }
};

/**
 * DEVELOPMENT ONLY: Instructions for setting up the first admin
 * This should be removed in production
 */
export const getAdminSetupInstructions = (): string => {
  return `
🔐 SECURE ADMIN SETUP INSTRUCTIONS

For security reasons, admin users cannot be created through the web interface.
Choose one of these secure methods:

METHOD 1: Firebase Console (Recommended)
1. Go to Firebase Console → Firestore Database
2. Navigate to the 'users' collection
3. Find your user document (created after signup)
4. Edit the document and change 'role' field from 'user' to 'admin'
5. Add field 'isFirstAdmin': true
6. Save changes

METHOD 2: Firebase Functions (Production)
1. Deploy a Firebase Function with admin privileges
2. Use the initializeFirstAdmin() function from this utility
3. Call the function with proper authentication

METHOD 3: Server-Side Script
1. Use Firebase Admin SDK on your server
2. Import this utility and call initializeFirstAdmin()
3. Ensure proper security measures are in place

⚠️  SECURITY NOTES:
- Only ONE admin user is allowed per system
- Admin promotion cannot be done through the web UI
- All admin operations are logged and auditable
- Never expose admin creation functions to client-side code

Current Status: ${hasAdminUser() ? 'Admin user exists' : 'No admin user found'}
`;
};

/**
 * Validate admin permissions before sensitive operations
 */
export const validateAdminPermissions = async (uid: string): Promise<boolean> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (!userDoc.exists()) {
      return false;
    }
    
    const userData = userDoc.data();
    return userData.role === 'admin';
  } catch (error) {
    console.error('Error validating admin permissions:', error);
    return false;
  }
};
