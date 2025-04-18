
// Update this to your deployed backend API URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Helper function to get Firebase auth token
export const getAuthToken = async (): Promise<string> => {
  try {
    // Get the current user from Firebase
    const { auth } = await import('@/config/firebase');
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Get the ID token
    const token = await user.getIdToken();
    return token;
  } catch (error) {
    console.error('Error getting auth token:', error);
    throw error;
  }
};
