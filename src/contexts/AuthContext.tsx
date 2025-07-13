import React, { createContext, useContext, useState } from 'react';
import { User, Profile } from '../types';
interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isCounselor: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data
const mockUser: User = {
  id: '1',
  email: 'e.jones@example.com',
};

const mockProfile: Profile = {
  id: '1',
  role: 'counselor',
  first_name: 'Eleanor',
  last_name: 'Jones',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock authentication
      if (email === 'admin@example.com' && password === 'admin') {
        setUser({ id: '2', email });
        setProfile({
          id: '2',
          role: 'admin',
          first_name: 'Admin',
          last_name: 'User',
        });
      } else if (email === 'counselor@example.com' && password === 'counselor') {
        setUser(mockUser);
        setProfile(mockProfile);
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.log(error);
      throw new Error('Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setUser(null);
    setProfile(null);
  };

  const value = {
    user,
    profile,
    isLoading,
    signIn,
    signOut,
    isAdmin: profile?.role === 'admin',
    isCounselor: profile?.role === 'counselor',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
