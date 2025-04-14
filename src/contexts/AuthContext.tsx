
import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from '@/config/firebase';
import { toast } from '@/components/ui/sonner';

// Mock data for the current user
export interface UserType {
  id: string;
  email: string;
  name: string;
  photoURL: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  } | null;
}

interface AuthContextType {
  user: UserType | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmailAndPassword: (email: string, password: string) => Promise<void>;
  signUpWithEmailAndPassword: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => void;
  updateUserLocation: (location: UserType['location']) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        // Convert Firebase user to app user
        const appUser: UserType = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          photoURL: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}`,
          location: null,
        };
        
        // Check if we have location in localStorage
        const storedUser = localStorage.getItem('bloomUser');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser.location) {
              appUser.location = parsedUser.location;
            }
          } catch (error) {
            console.error("Error parsing stored user:", error);
          }
        }
        
        setUser(appUser);
        localStorage.setItem('bloomUser', JSON.stringify(appUser));
        
        // If no location, request it
        if (!appUser.location) {
          requestUserLocation(appUser.id);
        }
      } else {
        setUser(null);
        localStorage.removeItem('bloomUser');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async (): Promise<void> => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success("Successfully signed in!");
    } catch (error) {
      console.error("Error signing in with Google:", error);
      toast.error("Failed to sign in with Google. Please try again.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmailAndPassword = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      await firebaseSignInWithEmailAndPassword(auth, email, password);
      toast.success("Successfully signed in!");
    } catch (error) {
      console.error("Error signing in with email:", error);
      toast.error("Failed to sign in. Please check your credentials and try again.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmailAndPassword = async (email: string, password: string, name: string): Promise<void> => {
    try {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
      // The user will be set via the auth state listener
      toast.success("Account created successfully!");
    } catch (error) {
      console.error("Error signing up:", error);
      toast.error("Failed to create account. The email may already be in use.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      toast.info("Signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out. Please try again.");
    }
  };

  const requestUserLocation = async (userId: string): Promise<void> => {
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            updateUserLocation({ latitude, longitude });
            resolve();
          },
          (error) => {
            console.error("Error getting location:", error);
            toast.error("Unable to get your location. Some features may be limited.");
            resolve(); // Still resolve to continue with sign-in
          },
          { timeout: 10000, enableHighAccuracy: true }
        );
      } else {
        toast.error("Geolocation is not supported by your browser. Some features may be limited.");
        resolve(); // Still resolve to continue with sign-in
      }
    });
  };

  const updateUserLocation = (location: UserType['location']) => {
    if (user) {
      const updatedUser = { ...user, location };
      setUser(updatedUser);
      localStorage.setItem('bloomUser', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signInWithGoogle, 
      signInWithEmailAndPassword, 
      signUpWithEmailAndPassword, 
      signOut, 
      updateUserLocation 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
