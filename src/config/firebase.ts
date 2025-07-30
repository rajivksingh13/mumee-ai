import { initializeApp, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// For development, use environment variables. For production, use hardcoded values.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "mumee-ai.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "mumee-ai",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "mumee-ai.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789012:web:abcdefghijklmnop",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://mumee-ai-default-rtdb.firebaseio.com"
};

// Initialize Firebase
let app;
try {
  app = getApp();
  console.log('Using existing Firebase app');
} catch {
  app = initializeApp(firebaseConfig);
  console.log('Firebase initialized successfully');
}

// Initialize Firebase services
const auth = getAuth(app);
const database = getDatabase(app); // Realtime Database (for backward compatibility)
const firestore = getFirestore(app); // Firestore (new database)

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export { auth, database, firestore, googleProvider }; 