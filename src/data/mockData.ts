
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

// Generate mock plants - in a real app, this would come from a database
export const generateMockPlants = (userLocation: { latitude: number, longitude: number } | null): Plant[] => {
  const baseLocation = userLocation || { latitude: 37.7749, longitude: -122.4194 }; // Default to SF if no user location
  
  const plantData: Plant[] = [
    {
      id: "plant1",
      userId: "user1",
      sellerName: "Maria Garden",
      sellerPhotoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
      title: "Snake Plant",
      description: "Easy-care snake plant in biodegradable pot. Great air purifier and perfect for beginners.",
      price: 25,
      image: "https://images.unsplash.com/photo-1599751449628-8a7270d7e80a?w=800&auto=format&fit=crop",
      growthConditions: "Low light, water every 2-3 weeks, indoor friendly",
      paymentMethods: ["COD", "Pickup"],
      location: { ...nearbyLocation(baseLocation.latitude, baseLocation.longitude), address: "Oakland, CA" },
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "plant2",
      userId: "user2",
      sellerName: "Green Thumb Joe",
      sellerPhotoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Joe",
      title: "Monstera Deliciosa",
      description: "Healthy young Monstera plant in eco-friendly pot. Stunning foliage with iconic split leaves.",
      price: 35,
      image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800&auto=format&fit=crop",
      growthConditions: "Indirect light, water weekly, likes humidity",
      paymentMethods: ["Pickup"],
      location: { ...nearbyLocation(baseLocation.latitude, baseLocation.longitude), address: "Berkeley, CA" },
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "plant3",
      userId: "user3",
      sellerName: "Plant Mama",
      sellerPhotoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      title: "Aloe Vera",
      description: "Medicinal aloe plant in compostable pot. Great for sunburns and kitchen decor.",
      price: 18,
      image: "https://images.unsplash.com/photo-1596547609652-9cf9771a35a3?w=800&auto=format&fit=crop",
      growthConditions: "Bright light, water sparingly, drought-tolerant",
      paymentMethods: ["COD", "Pickup"],
      location: { ...nearbyLocation(baseLocation.latitude, baseLocation.longitude), address: "Richmond, CA" },
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "plant4",
      userId: "user4",
      sellerName: "Botanical Barry",
      sellerPhotoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Barry",
      title: "Fiddle Leaf Fig",
      description: "Trendy fiddle leaf fig in biodegradable container. Makes a statement in any room.",
      price: 45,
      image: "https://images.unsplash.com/photo-1604762525953-f7fbcf61d3be?w=800&auto=format&fit=crop",
      growthConditions: "Bright indirect light, water when top inch of soil is dry",
      paymentMethods: ["Pickup"],
      location: { ...nearbyLocation(baseLocation.latitude, baseLocation.longitude), address: "Alameda, CA" },
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "plant5",
      userId: "user5",
      sellerName: "Succulent Sam",
      sellerPhotoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sam",
      title: "Echeveria Succulent",
      description: "Beautiful rosette-shaped succulent in eco-pot. Low maintenance and drought-tolerant.",
      price: 15,
      image: "https://images.unsplash.com/photo-1528476513691-07e6f563d97f?w=800&auto=format&fit=crop",
      growthConditions: "Full sun to partial shade, water when completely dry",
      paymentMethods: ["COD", "Pickup"],
      location: { ...nearbyLocation(baseLocation.latitude, baseLocation.longitude), address: "San Leandro, CA" },
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
  
  return plantData;
};

// Generate mock communities
export const generateMockCommunities = (userLocation: { latitude: number, longitude: number } | null): Community[] => {
  const baseLocation = userLocation || { latitude: 37.7749, longitude: -122.4194 }; // Default to SF if no user location
  
  return [
    {
      id: "comm1",
      creatorId: "user1",
      name: "Urban Garden Collective",
      type: "Permanent",
      purpose: "Sharing urban gardening tips and plants",
      bio: "A community for city dwellers who love growing plants in small spaces. We share tips, swap plants, and organize monthly meetups.",
      members: ["user1", "user2", "user4"],
      location: { ...nearbyLocation(baseLocation.latitude, baseLocation.longitude), address: "Oakland, CA" },
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "comm2",
      creatorId: "user3",
      name: "Succulent Swap",
      type: "Temporary",
      purpose: "One-time succulent exchange event",
      bio: "Join us for a day of succulent trading! Bring your propagated babies and take home new varieties. Happening next Saturday at the community garden.",
      members: ["user3", "user5"],
      location: { ...nearbyLocation(baseLocation.latitude, baseLocation.longitude), address: "Berkeley, CA" },
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "comm3",
      creatorId: "user2",
      name: "Native Plant Enthusiasts",
      type: "Permanent",
      purpose: "Promoting local biodiversity",
      bio: "We're passionate about native plants and their role in supporting local ecosystems. Our community focuses on education, conservation, and propagation of indigenous plant species.",
      members: ["user2", "user4", "user1"],
      location: { ...nearbyLocation(baseLocation.latitude, baseLocation.longitude), address: "Alameda, CA" },
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
};

// Generate mock orders for the current user
export const generateMockOrders = (userId: string): Order[] => {
  return [
    {
      id: "order1",
      userId: userId,
      plantId: "plant2",
      plantTitle: "Monstera Deliciosa",
      plantImage: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800&auto=format&fit=crop",
      sellerName: "Green Thumb Joe",
      sellerId: "user2",
      price: 35,
      paymentMethod: "Pickup",
      status: "completed",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "order2",
      userId: userId,
      plantId: "plant5",
      plantTitle: "Echeveria Succulent",
      plantImage: "https://images.unsplash.com/photo-1528476513691-07e6f563d97f?w=800&auto=format&fit=crop",
      sellerName: "Succulent Sam",
      sellerId: "user5",
      price: 15,
      paymentMethod: "COD",
      status: "pending",
      address: "123 Main St, San Francisco, CA",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
};
