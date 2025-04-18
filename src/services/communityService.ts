
import { Community, UserType } from '@/types';
import { API_BASE_URL, getAuthToken } from './config';

export const communityService = {
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
};

