import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  User as FirebaseUser,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { databaseService } from './databaseService';
import { Timestamp } from 'firebase/firestore';

export interface AuthError {
  code: string;
  message: string;
}

export const register = async (email: string, password: string, displayName: string): Promise<FirebaseUser> => {
  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update display name
    await updateProfile(user, { displayName });

    // Create user record in Firestore
    await databaseService.createUser({
      uid: user.uid,
      email: user.email!,
      displayName: displayName,
      photoURL: user.photoURL || undefined,
      profile: {
        firstName: displayName.split(' ')[0] || '',
        lastName: displayName.split(' ').slice(1).join(' ') || '',
      },
      preferences: {
        emailNotifications: true,
        marketingEmails: false,
        newsletter: false,
      },
      stats: {
        totalEnrollments: 0,
        completedWorkshops: 0,
        certificatesEarned: 0,
        lastActive: Timestamp.now(),
      }
    });

    console.log('✅ User created successfully in both Auth and Firestore');
    return user;
  } catch (error: any) {
    console.error('❌ Registration failed:', error);
    throw error;
  }
};

export const login = async (email: string, password: string): Promise<FirebaseUser> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Check if user exists in Firestore, if not create them
    const existingUser = await databaseService.getUser(user.uid);
    if (!existingUser) {
      console.log('⚠️ User exists in Auth but not in Firestore, creating user record...');
      await databaseService.createUser({
        uid: user.uid,
        email: user.email!,
        displayName: user.displayName || user.email!.split('@')[0],
        photoURL: user.photoURL || undefined,
        profile: {
          firstName: user.displayName?.split(' ')[0] || '',
          lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
        },
        preferences: {
          emailNotifications: true,
          marketingEmails: false,
          newsletter: false,
        },
        stats: {
          totalEnrollments: 0,
          completedWorkshops: 0,
          certificatesEarned: 0,
          lastActive: Timestamp.now(),
        } as any
      });
    } else {
      // Update last active
      await databaseService.updateUser(user.uid, {
        stats: {
          totalEnrollments: existingUser.stats?.totalEnrollments || 0,
          completedWorkshops: existingUser.stats?.completedWorkshops || 0,
          certificatesEarned: existingUser.stats?.certificatesEarned || 0,
          lastActive: Timestamp.now(),
        }
      });
    }

    console.log('✅ User logged in successfully');
    return user;
  } catch (error: any) {
    console.error('❌ Login failed:', error);
    throw error;
  }
};

export const signInWithGoogle = async (): Promise<FirebaseUser> => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    // Check if user exists in Firestore, if not create them
    const existingUser = await databaseService.getUser(user.uid);
    if (!existingUser) {
      console.log('⚠️ Google user exists in Auth but not in Firestore, creating user record...');
      await databaseService.createUser({
        uid: user.uid,
        email: user.email!,
        displayName: user.displayName || user.email!.split('@')[0],
        photoURL: user.photoURL || undefined,
        profile: {
          firstName: user.displayName?.split(' ')[0] || '',
          lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
        },
        preferences: {
          emailNotifications: true,
          marketingEmails: false,
          newsletter: false,
        },
        stats: {
          totalEnrollments: 0,
          completedWorkshops: 0,
          certificatesEarned: 0,
          lastActive: Timestamp.now(),
        } as any
      });
    } else {
      // Update last active
      await databaseService.updateUser(user.uid, {
        stats: {
          totalEnrollments: existingUser.stats?.totalEnrollments || 0,
          completedWorkshops: existingUser.stats?.completedWorkshops || 0,
          certificatesEarned: existingUser.stats?.certificatesEarned || 0,
          lastActive: Timestamp.now(),
        }
      });
    }

    console.log('✅ Google user logged in successfully');
    return user;
  } catch (error: any) {
    console.error('❌ Google login failed:', error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
    console.log('✅ User logged out successfully');
  } catch (error: any) {
    console.error('❌ Logout failed:', error);
    throw error;
  }
};

export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log('✅ Password reset email sent successfully');
  } catch (error: any) {
    console.error('❌ Password reset failed:', error);
    throw error;
  }
}; 