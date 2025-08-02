import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as FirebaseUser, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { getDatabaseService } from '../config/database';

interface ExtendedUser extends FirebaseUser {
  accountType?: 'individual' | 'business' | 'enterprise' | 'admin';
}

type User = ExtendedUser | null;

interface AuthContextType {
  user: User;
  setUser: (user: User) => void;
  loading: boolean;
  signOut: () => Promise<void>;
  createUserProfile: (user: FirebaseUser) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  // Create user profile in Firestore
  const createUserProfile = async (firebaseUser: FirebaseUser) => {
    try {
      const db = await getDatabaseService();
      
      // Check if user profile already exists
      const existingUser = await db.getUser(firebaseUser.uid);
      
      if (!existingUser) {
        console.log('🔄 Creating new user profile in Firestore...');
        
        // Create new user profile
        await db.createUser({
          id: firebaseUser.uid, // Add the missing id property
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || '',
          photoURL: firebaseUser.photoURL || '',
          profile: {
            firstName: firebaseUser.displayName?.split(' ')[0] || '',
            lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
            phone: '',
            location: '',
            bio: '',
            skillLevel: 'beginner'
          },
          preferences: {
            emailNotifications: true,
            marketingEmails: true,
            newsletter: true,
            currency: 'INR'
          },
          stats: {
            totalEnrollments: 0,
            completedWorkshops: 0,
            certificatesEarned: 0,
            totalSpent: 0,
            preferredCurrency: 'INR'
          } as any
        });
        
        console.log('✅ User profile created successfully in Firestore');
      } else {
        console.log('ℹ️ User profile already exists in Firestore');
        
        // Update user stats
        await db.updateUser(firebaseUser.uid, {
          stats: {
            totalEnrollments: existingUser.stats?.totalEnrollments || 0,
            completedWorkshops: existingUser.stats?.completedWorkshops || 0,
            certificatesEarned: existingUser.stats?.certificatesEarned || 0,
            totalSpent: existingUser.stats?.totalSpent || 0,
            preferredCurrency: existingUser.stats?.preferredCurrency || 'INR'
          }
        });
      }
    } catch (error) {
      console.error('❌ Error creating/updating user profile:', error);
      
              // Check for specific Firestore errors
        if ((error as any).code === 'permission-denied') {
        console.log('🔒 Firestore security rules are blocking access. Please update rules in Firebase Console.');
              } else if ((error as any).code === 'unavailable' || (error as any).code === 'not-found') {
        console.log('🌐 Firestore is not enabled. Please enable Firestore in Firebase Console.');
              } else if ((error as any).message?.includes('client is offline')) {
        console.log('📡 Network connectivity issue. Please check your internet connection.');
      }
      
      // Don't throw error to avoid breaking authentication flow
      // User can still authenticate even if Firestore is not available
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      console.log('✅ User signed out successfully');
    } catch (error) {
      console.error('❌ Error signing out:', error);
    }
  };

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          console.log('🔐 User authenticated:', firebaseUser.email);
          
          // Create/update user profile in Firestore
          await createUserProfile(firebaseUser);
          
          // Set user in context
          setUser(firebaseUser as ExtendedUser);
        } else {
          console.log('🔓 User signed out');
          setUser(null);
        }
      } catch (error) {
        console.error('❌ Error in auth state change:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, 
      loading, 
      signOut, 
      createUserProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 