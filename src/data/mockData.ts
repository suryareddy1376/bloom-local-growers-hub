
import { Plant, Community, Order } from "@/types";

// Calculate distance between two points using Haversine formula
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Helper to generate random coordinates near a base location
const nearbyLocation = (baseLat: number, baseLng: number) => {
  const radius = 5; // ~5km radius
  const lat = baseLat + (Math.random() - 0.5) * (radius / 111);
  const lng = baseLng + (Math.random() - 0.5) * (radius / (111 * Math.cos(baseLat * Math.PI / 180)));
  
  return {
    latitude: lat,
    longitude: lng,
    address: `${lat.toFixed(2)}, ${lng.toFixed(2)}` // Simplified address
  };
};

// Generate mock plants data with proper location
export const generateMockPlants = (userLocation: { latitude: number; longitude: number } | null): Plant[] => {
  if (!userLocation) return [];

  // Generate 10 mock plants around user's location
  return Array.from({ length: 10 }, (_, index) => {
    const location = nearbyLocation(userLocation.latitude, userLocation.longitude);
    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      location.latitude,
      location.longitude
    );

    return {
      id: `plant_${index}`,
      userId: `user_${index}`,
      sellerName: `Seller ${index}`,
      sellerPhotoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${index}`,
      title: `Plant ${index}`,
      description: `Beautiful plant within ${distance.toFixed(1)}km of your location`,
      price: Math.floor(Math.random() * 1000) + 100,
      currency: '₹',
      image: 'https://images.unsplash.com/photo-1585090190508-ea73efcdcb69',
      growthConditions: 'Moderate sunlight, regular watering',
      paymentMethods: ['COD', 'Pickup'],
      location,
      createdAt: new Date().toISOString(),
    };
  });
};

// Generate mock communities data with proper location
export const generateMockCommunities = (userLocation: { latitude: number; longitude: number } | null): Community[] => {
  if (!userLocation) return [];

  // Generate 5 mock communities around user's location
  return Array.from({ length: 5 }, (_, index) => {
    const location = nearbyLocation(userLocation.latitude, userLocation.longitude);
    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      location.latitude,
      location.longitude
    );

    return {
      id: `comm_${index}`,
      creatorId: `user_${index}`,
      name: `Local Plant Community ${index}`,
      type: index % 2 === 0 ? 'Permanent' : 'Temporary',
      purpose: `Supporting local plant enthusiasts within ${distance.toFixed(1)}km`,
      bio: `A community for plant lovers in your area. Share tips, trade plants, and meet fellow enthusiasts!`,
      members: [`user_${index}`],
      location,
      createdAt: new Date().toISOString(),
    };
  });
};

// Empty orders array for real data
export const generateMockOrders = (userId: string): Order[] => {
  return [];
};
