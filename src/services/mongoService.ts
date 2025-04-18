
import { Plant, Community, Order, UserType } from '@/types';

// MongoDB Atlas connection string - using ENV var would be better for production
const MONGODB_URI = "YOUR_MONGODB_CONNECTION_STRING";
const DB_NAME = "bio_planters";

// Collections
enum Collections {
  PLANTS = "plants",
  COMMUNITIES = "communities",
  ORDERS = "orders",
  USERS = "users"
}

// This service uses a simplified approach for demo purposes
// In production, you should use a backend API to connect to MongoDB
export const mongoService = {
  // Plants
  async getPlants(userLocation: { latitude: number; longitude: number } | null): Promise<Plant[]> {
    try {
      // In a real implementation, this would make an API call to your backend
      // which would then query MongoDB
      console.log('Fetching plants from MongoDB with user location:', userLocation);
      
      // For demo, return empty array - this should be replaced with actual API call
      return [];
    } catch (error) {
      console.error('Error fetching plants:', error);
      return [];
    }
  },

  async addPlant(plantData: Omit<Plant, 'id' | 'userId' | 'sellerName' | 'sellerPhotoURL' | 'createdAt' | 'location' | 'currency'>, user: UserType): Promise<Plant | null> {
    try {
      // In a real implementation, this would make an API call to your backend
      console.log('Adding plant to MongoDB:', plantData);
      
      // For demo, return mocked response - replace with actual API call
      const newPlant: Plant = {
        id: 'plant_' + Math.random().toString(36).substring(2, 9),
        userId: user.id,
        sellerName: user.name,
        sellerPhotoURL: user.photoURL,
        location: user.location || { latitude: 0, longitude: 0 },
        createdAt: new Date().toISOString(),
        currency: '₹',
        ...plantData,
      };
      
      return newPlant;
    } catch (error) {
      console.error('Error adding plant:', error);
      return null;
    }
  },

  // Communities
  async getCommunities(userLocation: { latitude: number; longitude: number } | null): Promise<Community[]> {
    try {
      console.log('Fetching communities from MongoDB with user location:', userLocation);
      
      // For demo, return empty array - replace with actual API call
      return [];
    } catch (error) {
      console.error('Error fetching communities:', error);
      return [];
    }
  },

  async createCommunity(communityData: Omit<Community, 'id' | 'creatorId' | 'members' | 'createdAt' | 'location'>, user: UserType): Promise<Community | null> {
    try {
      console.log('Creating community in MongoDB:', communityData);
      
      // For demo, return mocked response - replace with actual API call
      const newCommunity: Community = {
        id: 'comm_' + Math.random().toString(36).substring(2, 9),
        creatorId: user.id,
        members: [user.id],
        location: user.location || { latitude: 0, longitude: 0 },
        createdAt: new Date().toISOString(),
        ...communityData,
      };
      
      return newCommunity;
    } catch (error) {
      console.error('Error creating community:', error);
      return null;
    }
  },

  async joinCommunity(communityId: string, userId: string): Promise<boolean> {
    try {
      console.log('Joining community in MongoDB:', communityId, userId);
      return true;
    } catch (error) {
      console.error('Error joining community:', error);
      return false;
    }
  },

  async leaveCommunity(communityId: string, userId: string): Promise<boolean> {
    try {
      console.log('Leaving community in MongoDB:', communityId, userId);
      return true;
    } catch (error) {
      console.error('Error leaving community:', error);
      return false;
    }
  },

  // Orders
  async getUserOrders(userId: string): Promise<Order[]> {
    try {
      console.log('Fetching user orders from MongoDB:', userId);
      return [];
    } catch (error) {
      console.error('Error fetching user orders:', error);
      return [];
    }
  },

  async createOrder(orderData: Omit<Order, 'id' | 'createdAt'>): Promise<Order | null> {
    try {
      console.log('Creating order in MongoDB:', orderData);
      
      const newOrder: Order = {
        id: 'order_' + Math.random().toString(36).substring(2, 9),
        createdAt: new Date().toISOString(),
        ...orderData,
      };
      
      return newOrder;
    } catch (error) {
      console.error('Error creating order:', error);
      return null;
    }
  }
};
