
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  signOut as firebaseSignOut,
  auth
} from '@/config/firebase';
import { toast } from '@/components/ui/sonner';

export const authService = {
  signIn: async (email: string, password: string): Promise<void> => {
    try {
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
    }
  },

  signUp: async (email: string, password: string): Promise<void> => {
    try {
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
    }
  },

  signOut: async (): Promise<void> => {
    try {
      await firebaseSignOut(auth);
      toast.info("Signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out. Please try again.");
      throw error;
    }
  }
};
