
export interface Plant {
  id: string;
  userId: string;
  sellerName: string;
  sellerPhotoURL: string;
  title: string;
  description: string;
  price: number;
  image: string;
  growthConditions: string;
  paymentMethods: PaymentMethod[];
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  createdAt: string;
}

export type PaymentMethod = 'COD' | 'Pickup';

export interface Order {
  id: string;
  userId: string;
  plantId: string;
  plantTitle: string;
  plantImage: string;
  sellerName: string;
  sellerId: string;
  price: number;
  paymentMethod: PaymentMethod;
  status: 'pending' | 'completed' | 'cancelled';
  address?: string;
  createdAt: string;
}

export interface Community {
  id: string;
  creatorId: string;
  name: string;
  type: 'Temporary' | 'Permanent';
  purpose: string;
  bio: string;
  members: string[];
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  createdAt: string;
}
