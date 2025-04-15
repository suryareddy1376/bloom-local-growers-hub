import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '@/config/firebase';
import { toast } from '@/components/ui/sonner';

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

  const signInWithEmailAndPassword = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      await firebaseSignInWithEmailAndPassword(auth, email, password);
      toast.success("Successfully signed in!");
    } catch (error: any) {
      console.error("Error signing in with email:", error);
      
      if (error.code === 'auth/user-not-found') {
        toast.error("No account exists with this email. Please sign up first.");
      } else if (error.code === 'auth/wrong-password') {
        toast.error("Incorrect password. Please try again.");
      } else if (error.code === 'auth/too-many-requests') {
        toast.error("Too many failed login attempts. Please try again later or reset your password.");
      } else if (error.code === 'auth/invalid-credential') {
        toast.error("Invalid login credentials. Please check your email and password.");
      } else if (error.code === 'auth/operation-not-allowed' || error.code === 'auth/password-login-disabled') {
        toast.error("Email/password login is not enabled for this app. Please contact the app administrator.");
      } else {
        toast.error("Failed to sign in. Please check your credentials and try again.");
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmailAndPassword = async (email: string, password: string, name: string): Promise<void> => {
    try {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success("Account created successfully!");
    } catch (error: any) {
      console.error("Error signing up:", error);
      
      if (error.code === 'auth/email-already-in-use') {
        toast.error("This email is already registered. Please try signing in instead.");
      } else if (error.code === 'auth/invalid-email') {
        toast.error("Invalid email format. Please check your email and try again.");
      } else if (error.code === 'auth/weak-password') {
        toast.error("Password is too weak. Please use a stronger password.");
      } else if (error.code === 'auth/operation-not-allowed') {
        toast.error("Email/password sign-up is not enabled for this app. Please contact the app administrator.");
      } else {
        toast.error("Failed to create account. Please try again later.");
      }
      
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
      if (!navigator.geolocation) {
        toast.error("Your browser doesn't support geolocation. Some features may be limited.");
        resolve();
        return;
      }

      const locationOptions: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      };

      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          const location = {
            latitude,
            longitude,
            address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
          };
          
          updateUserLocation(location);
          toast.success("Location updated successfully");
          
          navigator.geolocation.clearWatch(watchId);
          resolve();
        },
        (error) => {
          let errorMessage = "Unable to get your location.";
          
          switch(error.code) {
            case GeolocationPositionError.PERMISSION_DENIED:
              errorMessage = "Please enable location permissions to see nearby items.";
              break;
            case GeolocationPositionError.POSITION_UNAVAILABLE:
              errorMessage = "Location information is unavailable. Please try again.";
              break;
            case GeolocationPositionError.TIMEOUT:
              errorMessage = "Location request timed out. Please check your connection.";
              break;
          }
          
          toast.error(errorMessage);
          resolve();
        },
        locationOptions
      );
    });
  };

  useEffect(() => {
    if (user?.id) {
      requestUserLocation(user.id);

      const intervalId = setInterval(() => {
        requestUserLocation(user.id);
      }, 5 * 60 * 1000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [user?.id]);

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
      signInWithEmailAndPassword, 
      signUpWithEmailAndPassword, 
      signOut, 
      updateUserLocation 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
