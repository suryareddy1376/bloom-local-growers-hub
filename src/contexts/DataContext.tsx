
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Plant, Community, Order, PaymentMethod } from '@/types';
import { generateMockPlants, generateMockCommunities, generateMockOrders, calculateDistance } from '@/data/mockData';
import { toast } from '@/components/ui/sonner';

interface DataContextType {
  plants: Plant[];
  communities: Community[];
  userOrders: Order[];
  addPlant: (plantData: Omit<Plant, 'id' | 'userId' | 'sellerName' | 'sellerPhotoURL' | 'createdAt' | 'location' | 'currency'>) => void;
  createCommunity: (communityData: Omit<Community, 'id' | 'creatorId' | 'members' | 'createdAt' | 'location'>) => void;
  joinCommunity: (communityId: string) => void;
  leaveCommunity: (communityId: string) => void;
  createOrder: (plantId: string, paymentMethod: PaymentMethod, address?: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [userOrders, setUserOrders] = useState<Order[]>([]);

  // Load data when user or their location changes
  useEffect(() => {
    if (user && user.location) {
      // Generate mock data based on user's location
      const nearbyPlants = generateMockPlants(user.location);
      const nearbyCommunities = generateMockCommunities(user.location);
      
      // Sort by distance (closest first)
      const sortByDistance = (a: { location: typeof user.location }, b: { location: typeof user.location }) => {
        if (!user.location) return 0;
        const distanceA = calculateDistance(
          user.location.latitude,
          user.location.longitude,
          a.location.latitude,
          a.location.longitude
        );
        const distanceB = calculateDistance(
          user.location.latitude,
          user.location.longitude,
          b.location.latitude,
          b.location.longitude
        );
        return distanceA - distanceB;
      };

      setPlants(nearbyPlants.sort(sortByDistance));
      setCommunities(nearbyCommunities.sort(sortByDistance));
      setUserOrders(generateMockOrders(user.id));
      
      // Show success message only if we have data
      if (nearbyPlants.length > 0) {
        toast.success(`Found ${nearbyPlants.length} plants near you!`);
      }
    } else {
      // Clear data when user is not logged in or has no location
      setPlants([]);
      setCommunities([]);
      setUserOrders([]);
    }
  }, [user, user?.location]);

  // Add a new plant listing
  const addPlant = (plantData: Omit<Plant, 'id' | 'userId' | 'sellerName' | 'sellerPhotoURL' | 'createdAt' | 'location' | 'currency'>) => {
    if (!user || !user.location) {
      toast.error("Unable to add plant. Make sure location services are enabled.");
      return;
    }

    const newPlant: Plant = {
      id: 'plant_' + Math.random().toString(36).substring(2, 9),
      userId: user.id,
      sellerName: user.name,
      sellerPhotoURL: user.photoURL,
      location: user.location,
      createdAt: new Date().toISOString(),
      currency: '₹', // Set default currency to Indian Rupee
      ...plantData,
    };

    setPlants(prevPlants => [newPlant, ...prevPlants]);
    toast.success("Plant listed successfully!");
  };

  // Create a new community
  const createCommunity = (communityData: Omit<Community, 'id' | 'creatorId' | 'members' | 'createdAt' | 'location'>) => {
    if (!user || !user.location) {
      toast.error("Unable to create community. Make sure location services are enabled.");
      return;
    }

    const newCommunity: Community = {
      id: 'comm_' + Math.random().toString(36).substring(2, 9),
      creatorId: user.id,
      members: [user.id],
      location: user.location,
      createdAt: new Date().toISOString(),
      ...communityData,
    };

    setCommunities(prevCommunities => [newCommunity, ...prevCommunities]);
    toast.success("Community created successfully!");
  };

  // Join a community
  const joinCommunity = (communityId: string) => {
    if (!user) return;

    setCommunities(prevCommunities => 
      prevCommunities.map(community => 
        community.id === communityId && !community.members.includes(user.id)
          ? { ...community, members: [...community.members, user.id] }
          : community
      )
    );
    toast.success("Joined community successfully!");
  };

  // Leave a community
  const leaveCommunity = (communityId: string) => {
    if (!user) return;

    setCommunities(prevCommunities => 
      prevCommunities.map(community => 
        community.id === communityId
          ? { ...community, members: community.members.filter(id => id !== user.id) }
          : community
      )
    );
    toast.info("Left community");
  };

  // Create a new order
  const createOrder = (plantId: string, paymentMethod: PaymentMethod, address?: string) => {
    if (!user) return;

    const plant = plants.find(p => p.id === plantId);
    if (!plant) {
      toast.error("Plant not found");
      return;
    }

    const newOrder: Order = {
      id: 'order_' + Math.random().toString(36).substring(2, 9),
      userId: user.id,
      plantId: plant.id,
      plantTitle: plant.title,
      plantImage: plant.image,
      sellerName: plant.sellerName,
      sellerId: plant.userId,
      price: plant.price,
      currency: plant.currency,
      paymentMethod,
      status: 'pending',
      address,
      createdAt: new Date().toISOString(),
    };

    setUserOrders(prevOrders => [newOrder, ...prevOrders]);
    toast.success("Order placed successfully!");
  };

  return (
    <DataContext.Provider 
      value={{ 
        plants, 
        communities, 
        userOrders, 
        addPlant, 
        createCommunity, 
        joinCommunity, 
        leaveCommunity, 
        createOrder 
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
