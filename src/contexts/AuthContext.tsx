import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';
import AdminSyncManager from '@/utils/adminSync';

interface UserProfile {
  uid: string;
  email: string;
  displayName: string | null;
  role: 'user' | 'admin' | 'artisan';
}

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName: string, role?: 'user' | 'artisan') => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loginWithGoogle: (role?: 'user' | 'artisan') => Promise<void>;
  updateUserRole: (role: 'user' | 'artisan' | 'admin') => Promise<void>;
  isAdmin: () => boolean;
  isArtisan: () => boolean;
  needsProfileCompletion: () => boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Save user profile to Firestore
  const saveUserProfile = async (user: User, role: 'user' | 'admin' | 'artisan' = 'user') => {
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const existingDoc = await getDoc(userDocRef);
      
      const profileData: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName,
        role: existingDoc.exists() ? existingDoc.data().role : role,
      };
      
      await setDoc(userDocRef, profileData, { merge: true });
      setUserProfile(profileData);
    } catch (error) {
      console.warn('Firestore not available, using local profile storage:', error);
      
      // Check localStorage for admin users (fallback mechanism)
      const localAdmins = JSON.parse(localStorage.getItem('localAdminUsers') || '[]');
      const isLocalAdmin = localAdmins.includes(user.email);
      
      // If Firestore fails, still set the profile locally for the session
      const profileData: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName,
        role: isLocalAdmin ? 'admin' : role,
      };
      setUserProfile(profileData);
      
      // Store profile locally as backup
      localStorage.setItem(`userProfile_${user.uid}`, JSON.stringify(profileData));
    }
  };

  // Fetch user profile from Firestore
  const fetchUserProfile = async (uid: string): Promise<UserProfile | null> => {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        return userDoc.data() as UserProfile;
      }
      return null;
    } catch (error) {
      console.warn('Firestore not available, checking local storage:', error);
      
      // Fallback to localStorage if Firestore is not available
      const localProfile = localStorage.getItem(`userProfile_${uid}`);
      if (localProfile) {
        try {
          return JSON.parse(localProfile) as UserProfile;
        } catch (parseError) {
          console.error('Error parsing local profile:', parseError);
        }
      }
      
      return null;
    }
  };

  // Sign up
  const signup = async (email: string, password: string, displayName: string, role: 'user' | 'artisan' = 'user') => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });
    await saveUserProfile(userCredential.user, role);
  };

  // Login
  const login = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    await saveUserProfile(userCredential.user);
  };

  // Google login
  const loginWithGoogle = async (role: 'user' | 'artisan' = 'user') => {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    await saveUserProfile(userCredential.user, role);
  };

  // Update user role (restricted - cannot self-promote to admin)
  const updateUserRole = async (role: 'user' | 'artisan' | 'admin') => {
    if (!currentUser) throw new Error('No user logged in');
    
    // SECURITY: Prevent users from promoting themselves to admin
    if (role === 'admin' && userProfile?.role !== 'admin') {
      throw new Error('Unauthorized: Cannot promote to admin role. Contact system administrator.');
    }
    
    const updatedProfile: UserProfile = {
      uid: currentUser.uid,
      email: currentUser.email || '',
      displayName: currentUser.displayName,
      role,
    };
    
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      await setDoc(userDocRef, updatedProfile, { merge: true });
      setUserProfile(updatedProfile);
    } catch (error) {
      console.warn('Firestore not available, updating locally:', error);
      
      // If Firestore fails, still update the profile locally for the session
      // But still enforce admin role restriction
      if (role === 'admin' && userProfile?.role !== 'admin') {
        throw new Error('Unauthorized: Cannot promote to admin role even in offline mode.');
      }
      
      setUserProfile(updatedProfile);
      localStorage.setItem(`userProfile_${currentUser.uid}`, JSON.stringify(updatedProfile));
      
      console.log('Profile updated locally due to Firestore unavailability');
    }
  };

  // Logout
  const logout = async () => {
    await signOut(auth);
    setUserProfile(null);
  };

  // Reset password
  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  // Check if admin
  const isAdmin = (): boolean => {
    return userProfile?.role === 'admin';
  };

  // Check if artisan
  const isArtisan = (): boolean => {
    return userProfile?.role === 'artisan';
  };

  // Check if user needs to complete profile (for Google login users)
  const needsProfileCompletion = (): boolean => {
    return currentUser && !userProfile?.role ? true : false;
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        const profile = await fetchUserProfile(user.uid);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    login,
    signup,
    logout,
    resetPassword,
    loginWithGoogle,
    updateUserRole,
    isAdmin,
    isArtisan,
    needsProfileCompletion
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};