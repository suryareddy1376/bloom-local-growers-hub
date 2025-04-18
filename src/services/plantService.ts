
import { Plant, UserType } from '@/types';
import { API_BASE_URL, getAuthToken } from './config';

export const plantService = {
  async getPlants(userLocation: { latitude: number; longitude: number } | null): Promise<Plant[]> {
    try {
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
      const response = await fetch(`${API_BASE_URL}/plants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getAuthToken()}`,
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
};

