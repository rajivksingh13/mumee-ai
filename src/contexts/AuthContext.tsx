import { createContext, useContext, useState, ReactNode } from 'react';
import { User as FirebaseUser } from 'firebase/auth';

interface ExtendedUser extends FirebaseUser {
  accountType?: 'individual' | 'business' | 'enterprise' | 'admin';
}

type User = ExtendedUser | null;

interface AuthContextType {
  user: User;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
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