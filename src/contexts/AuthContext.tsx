
import React, { createContext, useState, useContext, useEffect } from 'react';
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
  signInWithGoogle: () => void;
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
    // Check if user is stored in localStorage on mount
    const storedUser = localStorage.getItem('bloomUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signInWithGoogle = async () => {
    try {
      // In a real app, this would connect to Google Auth
      // For our demo, we'll create a mock user
      const mockUser: UserType = {
        id: 'user_' + Math.random().toString(36).substring(2, 9),
        email: 'user@example.com',
        name: 'Demo User',
        photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + Math.random(),
        location: null,
      };
      
      setUser(mockUser);
      localStorage.setItem('bloomUser', JSON.stringify(mockUser));
      
      // Request location once signed in
      requestUserLocation(mockUser.id);
      
      toast.success("Successfully signed in!");
    } catch (error) {
      console.error("Error signing in:", error);
      toast.error("Failed to sign in. Please try again.");
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('bloomUser');
    toast.info("Signed out successfully");
  };

  const requestUserLocation = async (userId: string) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          updateUserLocation({ latitude, longitude });
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Unable to get your location. Some features may be limited.");
        }
      );
    }
  };

  const updateUserLocation = (location: UserType['location']) => {
    if (user) {
      const updatedUser = { ...user, location };
      setUser(updatedUser);
      localStorage.setItem('bloomUser', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut, updateUserLocation }}>
      {children}
    </AuthContext.Provider>
  );
};
