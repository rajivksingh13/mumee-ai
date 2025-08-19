import { initializeApp, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// Support both VITE_ prefixed (for local development) and non-prefixed (for production) environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || import.meta.env.FIREBASE_API_KEY || "AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || import.meta.env.FIREBASE_AUTH_DOMAIN || "mumee-ai.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || import.meta.env.FIREBASE_PROJECT_ID || "mumee-ai",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || import.meta.env.FIREBASE_STORAGE_BUCKET || "mumee-ai.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || import.meta.env.FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || import.meta.env.FIREBASE_APP_ID || "1:123456789012:web:abcdefghijklmnop",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || import.meta.env.FIREBASE_DATABASE_URL || "https://mumee-ai-default-rtdb.firebaseio.com"
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