
import React, { createContext, useState, useContext, useEffect } from 'react';
import { onAuthStateChanged, auth } from '@/config/firebase';
import { authService } from '@/services/authService';
import { useLocationService } from '@/hooks/useLocationService';
import { UserType } from '@/types';

interface AuthContextType {
  user: UserType | null;
  loading: boolean;
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

  const updateUserLocation = (location: UserType['location']) => {
    if (user) {
      const updatedUser = { ...user, location };
      setUser(updatedUser);
      localStorage.setItem('bloomUser', JSON.stringify(updatedUser));
    }
  };

  const { requestUserLocation } = useLocationService({
    userId: user?.id || '',
    onLocationUpdate: updateUserLocation,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        const appUser: UserType = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          photoURL: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}`,
          location: null,
        };
        
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
        
        if (!appUser.location) {
          requestUserLocation();
        }
      } else {
        setUser(null);
        localStorage.removeItem('bloomUser');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user?.id) {
      requestUserLocation();

      const intervalId = setInterval(() => {
        requestUserLocation();
      }, 5 * 60 * 1000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [user?.id]);

  const signInWithEmailAndPassword = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      await authService.signIn(email, password);
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmailAndPassword = async (email: string, password: string, name: string): Promise<void> => {
    try {
      setLoading(true);
      await authService.signUp(email, password);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signInWithEmailAndPassword, 
      signUpWithEmailAndPassword, 
      signOut: authService.signOut, 
      updateUserLocation 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
