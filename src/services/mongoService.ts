
import { Plant, Community, Order, UserType } from '@/types';

// API base URL - this should point to your deployed backend
const API_BASE_URL = "https://your-backend-api.com/api";

export const mongoService = {
  // Plants
  async getPlants(userLocation: { latitude: number; longitude: number } | null): Promise<Plant[]> {
    try {
      // Call backend API instead of MongoDB directly
      const response = await fetch(`${API_BASE_URL}/plants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userLocation }),
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching plants: ${response.status}`);
      }
      
      const data = await response.json();
      return data.plants;
    } catch (error) {
      console.error('Error fetching plants:', error);
      return [];
    }
  },

  async addPlant(plantData: Omit<Plant, 'id' | 'userId' | 'sellerName' | 'sellerPhotoURL' | 'createdAt' | 'location' | 'currency'>, user: UserType): Promise<Plant | null> {
    try {
      // Call backend API with plant data and user info
      const response = await fetch(`${API_BASE_URL}/plants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getAuthToken()}`, // You'll need to implement this function
        },
        body: JSON.stringify({
          plantData,
          user,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error adding plant: ${response.status}`);
      }
      
      const data = await response.json();
      return data.plant;
    } catch (error) {
      console.error('Error adding plant:', error);
      return null;
    }
  },

  // Communities
  async getCommunities(userLocation: { latitude: number; longitude: number } | null): Promise<Community[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/communities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userLocation }),
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching communities: ${response.status}`);
      }
      
      const data = await response.json();
      return data.communities;
    } catch (error) {
      console.error('Error fetching communities:', error);
      return [];
    }
  },

  async createCommunity(communityData: Omit<Community, 'id' | 'creatorId' | 'members' | 'createdAt' | 'location'>, user: UserType): Promise<Community | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/communities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getAuthToken()}`,
        },
        body: JSON.stringify({
          communityData,
          user,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error creating community: ${response.status}`);
      }
      
      const data = await response.json();
      return data.community;
    } catch (error) {
      console.error('Error creating community:', error);
      return null;
    }
  },

  async joinCommunity(communityId: string, userId: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/communities/${communityId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getAuthToken()}`,
        },
        body: JSON.stringify({ userId }),
      });
      
      if (!response.ok) {
        throw new Error(`Error joining community: ${response.status}`);
      }
      
      return true;
    } catch (error) {
      console.error('Error joining community:', error);
      return false;
    }
  },

  async leaveCommunity(communityId: string, userId: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/communities/${communityId}/leave`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getAuthToken()}`,
        },
        body: JSON.stringify({ userId }),
      });
      
      if (!response.ok) {
        throw new Error(`Error leaving community: ${response.status}`);
      }
      
      return true;
    } catch (error) {
      console.error('Error leaving community:', error);
      return false;
    }
  },

  // Orders
  async getUserOrders(userId: string): Promise<Order[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/user/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getAuthToken()}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching user orders: ${response.status}`);
      }
      
      const data = await response.json();
      return data.orders;
    } catch (error) {
      console.error('Error fetching user orders:', error);
      return [];
    }
  },

  async createOrder(orderData: Omit<Order, 'id' | 'createdAt'>): Promise<Order | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getAuthToken()}`,
        },
        body: JSON.stringify({ orderData }),
      });
      
      if (!response.ok) {
        throw new Error(`Error creating order: ${response.status}`);
      }
      
      const data = await response.json();
      return data.order;
    } catch (error) {
      console.error('Error creating order:', error);
      return null;
    }
  }
};

// Helper function to get Firebase auth token
const getAuthToken = async (): Promise<string> => {
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
