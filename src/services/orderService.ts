
import { Order } from '@/types';
import { API_BASE_URL, getAuthToken } from './config';

export const orderService = {
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
  },
};

