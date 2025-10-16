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
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';

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
  loginWithGoogle: () => Promise<void>;
  isAdmin: () => boolean;
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
      // Log error only in development mode
      if (import.meta.env.DEV) {
        console.error('Error saving user profile:', error);
      }
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
      // Log error only in development mode
      if (import.meta.env.DEV) {
        console.error('Error fetching user profile:', error);
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
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    await saveUserProfile(userCredential.user);
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
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};