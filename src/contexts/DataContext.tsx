
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Plant, Community, Order, PaymentMethod } from '@/types';
import { mongoService } from '@/services/mongoService';
import { toast } from '@/components/ui/sonner';
import { generateMockPlants, generateMockCommunities, generateMockOrders } from '@/data/mockData';

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
  const [isConnected, setIsConnected] = useState(false);

  // Load data when user or their location changes
  useEffect(() => {
    const fetchData = async () => {
      if (user && user.location) {
        // Set loading state
        setIsConnected(false);
        
        try {
          // Fetch data from MongoDB
          const [plantsData, communitiesData, ordersData] = await Promise.all([
            mongoService.getPlants(user.location),
            mongoService.getCommunities(user.location),
            mongoService.getUserOrders(user.id)
          ]);
          
          // If we have no data yet, use mock data for demonstration purposes
          // In production, remove this fallback to mock data
          const finalPlants = plantsData.length > 0 ? plantsData : generateMockPlants(user.location);
          const finalCommunities = communitiesData.length > 0 ? communitiesData : generateMockCommunities(user.location);
          const finalOrders = ordersData.length > 0 ? ordersData : generateMockOrders(user.id);
          
          setPlants(finalPlants);
          setCommunities(finalCommunities);
          setUserOrders(finalOrders);
          setIsConnected(true);
          
          if (finalPlants.length > 0) {
            toast.success(`Found ${finalPlants.length} plants near you!`);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          
          // Fallback to mock data in case of error
          const mockPlants = generateMockPlants(user.location);
          const mockCommunities = generateMockCommunities(user.location);
          const mockOrders = generateMockOrders(user.id);
          
          setPlants(mockPlants);
          setCommunities(mockCommunities);
          setUserOrders(mockOrders);
          
          toast.error("Failed to connect to database. Using mock data for demonstration.");
        }
      } else {
        // Clear data when user is not logged in or has no location
        setPlants([]);
        setCommunities([]);
        setUserOrders([]);
      }
    };
    
    fetchData();
  }, [user, user?.location]);

  // Add a new plant listing
  const addPlant = async (plantData: Omit<Plant, 'id' | 'userId' | 'sellerName' | 'sellerPhotoURL' | 'createdAt' | 'location' | 'currency'>) => {
    if (!user || !user.location) {
      toast.error("Unable to add plant. Make sure location services are enabled.");
      return;
    }

    try {
      const newPlant = await mongoService.addPlant(plantData, user);
      
      if (newPlant) {
        setPlants(prevPlants => [newPlant, ...prevPlants]);
        toast.success("Plant listed successfully!");
      } else {
        throw new Error("Failed to add plant");
      }
    } catch (error) {
      console.error("Error adding plant:", error);
      toast.error("Failed to add plant. Please try again.");
      
      // Fallback for demonstration purposes
      const mockPlant: Plant = {
        id: 'plant_' + Math.random().toString(36).substring(2, 9),
        userId: user.id,
        sellerName: user.name,
        sellerPhotoURL: user.photoURL,
        location: user.location,
        createdAt: new Date().toISOString(),
        currency: '₹',
        ...plantData,
      };
      
      setPlants(prevPlants => [mockPlant, ...prevPlants]);
    }
  };

  // Create a new community
  const createCommunity = async (communityData: Omit<Community, 'id' | 'creatorId' | 'members' | 'createdAt' | 'location'>) => {
    if (!user || !user.location) {
      toast.error("Unable to create community. Make sure location services are enabled.");
      return;
    }

    try {
      const newCommunity = await mongoService.createCommunity(communityData, user);
      
      if (newCommunity) {
        setCommunities(prevCommunities => [newCommunity, ...prevCommunities]);
        toast.success("Community created successfully!");
      } else {
        throw new Error("Failed to create community");
      }
    } catch (error) {
      console.error("Error creating community:", error);
      toast.error("Failed to create community. Please try again.");
      
      // Fallback for demonstration purposes
      const mockCommunity: Community = {
        id: 'comm_' + Math.random().toString(36).substring(2, 9),
        creatorId: user.id,
        members: [user.id],
        location: user.location,
        createdAt: new Date().toISOString(),
        ...communityData,
      };
      
      setCommunities(prevCommunities => [mockCommunity, ...prevCommunities]);
    }
  };

  // Join a community
  const joinCommunity = async (communityId: string) => {
    if (!user) return;

    try {
      const success = await mongoService.joinCommunity(communityId, user.id);
      
      if (success) {
        setCommunities(prevCommunities => 
          prevCommunities.map(community => 
            community.id === communityId && !community.members.includes(user.id)
              ? { ...community, members: [...community.members, user.id] }
              : community
          )
        );
        toast.success("Joined community successfully!");
      } else {
        throw new Error("Failed to join community");
      }
    } catch (error) {
      console.error("Error joining community:", error);
      toast.error("Failed to join community. Please try again.");
      
      // Fallback for demonstration
      setCommunities(prevCommunities => 
        prevCommunities.map(community => 
          community.id === communityId && !community.members.includes(user.id)
            ? { ...community, members: [...community.members, user.id] }
            : community
        )
      );
    }
  };

  // Leave a community
  const leaveCommunity = async (communityId: string) => {
    if (!user) return;

    try {
      const success = await mongoService.leaveCommunity(communityId, user.id);
      
      if (success) {
        setCommunities(prevCommunities => 
          prevCommunities.map(community => 
            community.id === communityId
              ? { ...community, members: community.members.filter(id => id !== user.id) }
              : community
          )
        );
        toast.info("Left community");
      } else {
        throw new Error("Failed to leave community");
      }
    } catch (error) {
      console.error("Error leaving community:", error);
      toast.error("Failed to leave community. Please try again.");
      
      // Fallback for demonstration
      setCommunities(prevCommunities => 
        prevCommunities.map(community => 
          community.id === communityId
            ? { ...community, members: community.members.filter(id => id !== user.id) }
            : community
        )
      );
    }
  };

  // Create a new order
  const createOrder = async (plantId: string, paymentMethod: PaymentMethod, address?: string) => {
    if (!user) return;

    const plant = plants.find(p => p.id === plantId);
    if (!plant) {
      toast.error("Plant not found");
      return;
    }

    const orderData: Omit<Order, 'id' | 'createdAt'> = {
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
    };

    try {
      const newOrder = await mongoService.createOrder(orderData);
      
      if (newOrder) {
        setUserOrders(prevOrders => [newOrder, ...prevOrders]);
        toast.success("Order placed successfully!");
      } else {
        throw new Error("Failed to create order");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to place order. Please try again.");
      
      // Fallback for demonstration
      const mockOrder: Order = {
        id: 'order_' + Math.random().toString(36).substring(2, 9),
        createdAt: new Date().toISOString(),
        ...orderData,
      };
      
      setUserOrders(prevOrders => [mockOrder, ...prevOrders]);
    }
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
