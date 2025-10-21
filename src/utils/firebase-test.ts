import { auth, db } from '@/config/firebase';
import { connectAuthEmulator } from 'firebase/auth';
import { connectFirestoreEmulator } from 'firebase/firestore';

export const testFirebaseConnection = () => {
  console.log('Firebase Auth:', auth);
  console.log('Firebase Firestore:', db);
  console.log('Firebase Config:', {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? 'Set' : 'Missing',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? 'Set' : 'Missing',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ? 'Set' : 'Missing',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ? 'Set' : 'Missing',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ? 'Set' : 'Missing',
    appId: import.meta.env.VITE_FIREBASE_APP_ID ? 'Set' : 'Missing'
  });
};

// Call this in development to check Firebase connection
if (import.meta.env.DEV) {
  testFirebaseConnection();
}
