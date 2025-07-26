import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup,
  sendPasswordResetEmail
  // sendEmailVerification (removed)
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

    // No email verification step

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
  } catch (error: any) {
    let message = 'Failed to create account.';
    if (error.code === 'auth/email-already-in-use') message = 'Email is already in use.';
    else if (error.code === 'auth/invalid-email') message = 'Invalid email address.';
    else if (error.code === 'auth/weak-password') message = 'Password is too weak.';
    throw new Error(message);
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

    // Update last login time (correct path)
    const userRef = ref(database, `users/${user.uid}/lastLogin`);
    await set(userRef, new Date().toISOString());

    // Optionally, check if email is verified
    // if (!user.emailVerified) throw new Error('Please verify your email before logging in.');

    return user;
  } catch (error: any) {
    let message = 'Failed to sign in.';
    if (error.code === 'auth/user-not-found') message = 'No account found with this email.';
    else if (error.code === 'auth/wrong-password') message = 'Incorrect password.';
    else if (error.code === 'auth/invalid-email') message = 'Invalid email address.';
    else if (error.code === 'auth/user-disabled') message = 'This account has been disabled.';
    throw new Error(message);
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
    const userRef = ref(database, `users/${user.uid}`);
    await set(userRef, {
      email: user.email,
      displayName: user.displayName,
      lastLogin: new Date().toISOString()
    });

    return user;
  } catch (error: any) {
    let message = 'Failed to sign in with Google.';
    if (error.code === 'auth/popup-closed-by-user') message = 'Google sign-in was cancelled.';
    throw new Error(message);
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
  } catch (error: any) {
    let message = 'Failed to send password reset email.';
    if (error.code === 'auth/user-not-found') message = 'No account found with this email.';
    else if (error.code === 'auth/invalid-email') message = 'Invalid email address.';
    throw new Error(message);
  }
}; 