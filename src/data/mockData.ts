
import { Plant, Community, Order } from "@/types";

// Helper to generate random coordinates near a base location
const nearbyLocation = (baseLat: number, baseLng: number) => {
  // Random offset within ~5km
  const latOffset = (Math.random() - 0.5) * 0.05;
  const lngOffset = (Math.random() - 0.5) * 0.05;
  
  return {
    latitude: baseLat + latOffset,
    longitude: baseLng + lngOffset,
  };
};

// Empty plants array for real data
export const generateMockPlants = (userLocation: { latitude: number, longitude: number } | null): Plant[] => {
  return [];
};

// Empty communities array for real data
export const generateMockCommunities = (userLocation: { latitude: number, longitude: number } | null): Community[] => {
  return [];
};

// Empty orders array for real data
export const generateMockOrders = (userId: string): Order[] => {
  return [];
};
