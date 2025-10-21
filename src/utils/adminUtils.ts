import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string | null;
  role: 'user' | 'admin' | 'artisan';
}

/**
 * DEPRECATED: Admin promotion removed for security reasons
 * 
 * Admin users can only be created through secure server-side processes.
 * Use Firebase Console or server-side admin tools instead.
 * 
 * @deprecated Use secure admin initialization methods instead
 */
export const promoteUserToAdmin = async (userId: string): Promise<{success: boolean, error?: string}> => {
  console.warn('promoteUserToAdmin is deprecated and disabled for security reasons');
  return { 
    success: false, 
    error: 'Admin promotion disabled for security. Use Firebase Console or server-side admin tools.' 
  };
};

/**
 * Creates a new admin user profile in Firestore
 * @param userId - The Firebase UID
 * @param email - User's email
 * @param displayName - User's display name
 * @returns Promise<boolean> - Success status
 */
export const createAdminUser = async (
  userId: string, 
  email: string, 
  displayName: string
): Promise<boolean> => {
  try {
    const userDocRef = doc(db, 'users', userId);
    
    const adminProfile: UserProfile = {
      uid: userId,
      email,
      displayName,
      role: 'admin'
    };
    
    await setDoc(userDocRef, adminProfile, { merge: true });
    
    console.log(`Admin user created successfully: ${email}`);
    return true;
  } catch (error) {
    console.error('Error creating admin user:', error);
    return false;
  }
};

/**
 * Gets user profile from Firestore
 * @param userId - The Firebase UID
 * @returns Promise<UserProfile | null>
 */
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

/**
 * Updates user role in Firestore
 * @param userId - The Firebase UID
 * @param newRole - The new role to assign
 * @returns Promise<boolean> - Success status
 */
export const updateUserRole = async (
  userId: string, 
  newRole: 'user' | 'admin' | 'artisan'
): Promise<boolean> => {
  try {
    const userDocRef = doc(db, 'users', userId);
    
    await updateDoc(userDocRef, {
      role: newRole
    });
    
    console.log(`User ${userId} role updated to ${newRole}`);
    return true;
  } catch (error) {
    console.error('Error updating user role:', error);
    return false;
  }
};

/**
 * Lists all users with admin role
 * @returns Promise<UserProfile[]>
 */
export const listAdminUsers = async (): Promise<UserProfile[]> => {
  try {
    // Note: In a real app, you'd use a query to filter by role
    // For now, this is a placeholder that would need proper implementation
    console.log('List admin users - implement with proper Firestore query');
    return [];
  } catch (error) {
    console.error('Error listing admin users:', error);
    return [];
  }
};

// Secure admin setup instructions
export const setupInitialAdmin = async () => {
  console.log(`
🔐 SECURE ADMIN SETUP INSTRUCTIONS

For security reasons, admin users CANNOT be created through the web interface.

SECURE METHOD - Firebase Console:
1. Create a regular account through the signup page first
2. Go to Firebase Console → Firestore Database
3. Navigate to the 'users' collection
4. Find your user document (created after signup)
5. Edit the document and change 'role' field from 'user' to 'admin'
6. Add field 'isFirstAdmin': true (for the first admin only)
7. Save changes and refresh the application

⚠️  SECURITY NOTES:
- Only ONE admin user should exist per system
- Admin promotion through code is disabled for security
- All admin operations should be logged and auditable
- Never expose admin creation functions to client-side code

For production systems, use Firebase Functions or server-side admin tools.
  `);
};
