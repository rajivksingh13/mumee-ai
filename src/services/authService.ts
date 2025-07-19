import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { ref, set } from 'firebase/database';
import { database } from '../config/firebase';

/**
 * Register a new user with email and password
 * @param email User's email
 * @param password User's password
 * @param displayName User's display name
 * @param accountType User's account type (individual, business, enterprise, or admin)
 * @returns User credential
 */
export const registerWithEmail = async (
  email: string, 
  password: string, 
  displayName: string,
  accountType: 'individual' | 'business' | 'enterprise' | 'admin'
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user record in Firebase Realtime Database
    const userRef = ref(database, `users/${user.uid}`);
    await set(userRef, {
      email: user.email,
      displayName: displayName,
      accountType: accountType,
      createdAt: Date.now(),
      lastLogin: Date.now()
    });

    return user;
  } catch (error) {
    console.error('Error in registerWithEmail:', error);
    throw error;
  }
};

/**
 * Sign in with email and password
 * @param email User's email
 * @param password User's password
 * @returns User credential
 */
export const loginWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update last login time
    const userRef = ref(database, `users/email/${user.uid}/lastLogin`);
    await set(userRef, new Date().toISOString());

    return user;
  } catch (error) {
    console.error('Error in loginWithEmail:', error);
    throw error;
  }
};

/**
 * Sign in with Google
 * @returns User credential
 */
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    // Create or update user record in Firebase Realtime Database
    const userRef = ref(database, `users/email/${user.uid}`);
    await set(userRef, {
      email: user.email,
      displayName: user.displayName,
      lastLogin: new Date().toISOString()
    });

    return user;
  } catch (error) {
    console.error('Error in signInWithGoogle:', error);
    throw error;
  }
};

/**
 * Sign out the current user
 * @returns Promise that resolves when the user is signed out
 */
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error in logout:', error);
    throw error;
  }
};

/**
 * Send password reset email
 * @param email User's email
 * @returns Promise that resolves when the email is sent
 */
export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error in resetPassword:', error);
    throw error;
  }
}; 