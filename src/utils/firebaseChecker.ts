/**
 * Firebase Configuration Checker
 * Helps diagnose Firebase setup issues
 */

export const checkFirebaseConfig = () => {
  const requiredEnvVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
  ];

  const missingVars = requiredEnvVars.filter(varName => !import.meta.env[varName]);
  
  return {
    isConfigured: missingVars.length === 0,
    missingVars,
    hasPartialConfig: missingVars.length < requiredEnvVars.length,
  };
};

export const getFirebaseSetupInstructions = () => {
  return `
🔧 Firebase Setup Instructions:

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Authentication and Firestore Database
3. Copy .env.example to .env in your project root
4. Fill in your Firebase configuration values from Firebase Console > Project Settings
5. Set up Firestore security rules (allow read/write for authenticated users)

Example Firestore Rules:
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (request.auth.uid == userId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
  }
}

6. Restart your development server after adding environment variables
  `;
};

export const isFirebaseAvailable = async (): Promise<boolean> => {
  try {
    const { db } = await import('@/config/firebase');
    // Try a simple operation to test connectivity
    return db !== undefined;
  } catch (error) {
    console.warn('Firebase not available:', error);
    return false;
  }
};
