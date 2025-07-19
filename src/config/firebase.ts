import { initializeApp, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// Fetch config from your Render backend
const getFirebaseConfig = async () => {
  try {
    const response = await fetch('https://mumee-ai-backend.onrender.com/api/config');
    const config = await response.json();
    return config.firebase;
  } catch (error) {
    console.error('Error fetching config from backend:', error);
    // Fallback to local config if backend is not available
    return {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
      databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL
    };
  }
};

// Initialize Firebase
let app;
try {
  app = getApp();
  console.log('Using existing Firebase app');
} catch {
  // Initialize with fetched config
  getFirebaseConfig().then(firebaseConfig => {
    app = initializeApp(firebaseConfig);
    console.log('Firebase initialized successfully');
  });
}

// Initialize Firebase services
const auth = getAuth(app);
const database = getDatabase(app);

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export { auth, database, googleProvider }; 