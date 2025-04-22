
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../services/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // For demo purposes, we'll set up a mock auth state
    // In a real app, this would connect to Firebase Auth
    const mockUser = {
      uid: 'admin123',
      email: 'admin@safezone.app',
      displayName: 'Admin User',
      emailVerified: true
    } as User;
    
    // Simulate auth state change after 1 second
    const timer = setTimeout(() => {
      setLoading(false);
      // Start with no user logged in
      setCurrentUser(null);
    }, 1000);
    
    return () => clearTimeout(timer);
    
    /* 
    // Uncomment this when connecting to real Firebase
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if(user) {
        // Check if user has admin role - this is a simplified example
        // In real app, you'd check user claims or a separate admin collection
        checkUserRole(user.uid).then(isAdmin => setIsAdmin(isAdmin));
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return unsubscribe;
    */
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      // For demo, simulate login
      if (email === 'admin@safezone.app' && password === 'admin123') {
        const mockUser = {
          uid: 'admin123',
          email: 'admin@safezone.app',
          displayName: 'Admin User',
          emailVerified: true
        } as User;
        
        setCurrentUser(mockUser);
        setIsAdmin(true);
        toast({
          title: "Login successful",
          description: "Welcome to SafeZone Admin Dashboard",
        });
      } else {
        toast({
          title: "Login failed",
          description: "Invalid credentials. Try admin@safezone.app / admin123",
          variant: "destructive"
        });
      }
      
      /* 
      // Uncomment this when connecting to real Firebase
      await signInWithEmailAndPassword(auth, email, password);
      */
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      // For demo, just clear the current user
      setCurrentUser(null);
      setIsAdmin(false);
      
      /* 
      // Uncomment this when connecting to real Firebase
      await signOut(auth);
      */
      
      toast({
        title: "Logged out successfully",
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Mock function to check if user is admin
  const checkUserRole = async (uid: string): Promise<boolean> => {
    // In a real app, you would check Firestore or Firebase Auth custom claims
    return uid === 'admin123';
  };

  const value = {
    currentUser,
    loading,
    login,
    logout,
    isAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
