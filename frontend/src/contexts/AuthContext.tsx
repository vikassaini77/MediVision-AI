import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type UserRole = 'radiologist' | 'physician' | 'researcher' | 'admin';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  createdAt: string;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: string;
}

interface AuthContextType {
  user: User | null;
  session: AuthSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string, role: UserRole) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'medvision_auth';
const USERS_KEY = 'medvision_users';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Get stored users (for mock auth)
const getStoredUsers = (): Record<string, { password: string; user: User }> => {
  try {
    const stored = localStorage.getItem(USERS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

// Save users
const saveUsers = (users: Record<string, { password: string; user: User }>) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load session from storage on mount
  useEffect(() => {
    const loadSession = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsedSession: AuthSession = JSON.parse(stored);
          const expiresAt = new Date(parsedSession.expiresAt);
          
          if (expiresAt > new Date()) {
            setSession(parsedSession);
            setUser(parsedSession.user);
          } else {
            localStorage.removeItem(STORAGE_KEY);
          }
        }
      } catch (error) {
        localStorage.removeItem(STORAGE_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, []);

  const signIn = useCallback(async (email: string, password: string, rememberMe = false): Promise<{ error: string | null }> => {
    setIsLoading(true);
    
    try {
      await delay(1000); // Simulate API call
      
      const users = getStoredUsers();
      const storedUser = users[email.toLowerCase()];
      
      if (!storedUser) {
        return { error: 'Invalid email or password. Please check your credentials and try again.' };
      }
      
      if (storedUser.password !== password) {
        return { error: 'Invalid email or password. Please check your credentials and try again.' };
      }
      
      const newSession: AuthSession = {
        user: storedUser.user,
        token: `mock_token_${Date.now()}`,
        expiresAt: new Date(Date.now() + (rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000)).toISOString(),
      };
      
      setSession(newSession);
      setUser(storedUser.user);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
      
      return { error: null };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, fullName: string, role: UserRole): Promise<{ error: string | null }> => {
    setIsLoading(true);
    
    try {
      await delay(1200); // Simulate API call
      
      const users = getStoredUsers();
      
      if (users[email.toLowerCase()]) {
        return { error: 'An account with this email already exists. Please sign in instead.' };
      }
      
      const newUser: User = {
        id: `user_${Date.now()}`,
        email: email.toLowerCase(),
        fullName,
        role,
        createdAt: new Date().toISOString(),
      };
      
      users[email.toLowerCase()] = { password, user: newUser };
      saveUsers(users);
      
      // Auto sign in after registration
      const newSession: AuthSession = {
        user: newUser,
        token: `mock_token_${Date.now()}`,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      };
      
      setSession(newSession);
      setUser(newUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
      
      return { error: null };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setIsLoading(true);
    await delay(300);
    
    setSession(null);
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    setIsLoading(false);
  }, []);

  const resetPassword = useCallback(async (email: string): Promise<{ error: string | null }> => {
    await delay(800);
    // Always return success for security (don't reveal if email exists)
    return { error: null };
  }, []);

  const updatePassword = useCallback(async (newPassword: string): Promise<{ error: string | null }> => {
    setIsLoading(true);
    
    try {
      await delay(800);
      
      if (!user) {
        return { error: 'No authenticated user found.' };
      }
      
      const users = getStoredUsers();
      if (users[user.email]) {
        users[user.email].password = newPassword;
        saveUsers(users);
      }
      
      return { error: null };
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated: !!session && !!user,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
