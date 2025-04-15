
import { useState } from 'react';
import { UserType } from '@/types';
import { toast } from '@/components/ui/sonner';

interface UseLocationServiceProps {
  userId: string;
  onLocationUpdate: (location: UserType['location']) => void;
}

export const useLocationService = ({ userId, onLocationUpdate }: UseLocationServiceProps) => {
  const requestUserLocation = async (): Promise<void> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        toast.error("Your browser doesn't support geolocation. Some features may be limited.");
        resolve();
        return;
      }

      const locationOptions: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      };

      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          const location = {
            latitude,
            longitude,
            address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
          };
          
          onLocationUpdate(location);
          toast.success("Location updated successfully");
          
          navigator.geolocation.clearWatch(watchId);
          resolve();
        },
        (error) => {
          let errorMessage = "Unable to get your location.";
          
          switch(error.code) {
            case GeolocationPositionError.PERMISSION_DENIED:
              errorMessage = "Please enable location permissions to see nearby items.";
              break;
            case GeolocationPositionError.POSITION_UNAVAILABLE:
              errorMessage = "Location information is unavailable. Please try again.";
              break;
            case GeolocationPositionError.TIMEOUT:
              errorMessage = "Location request timed out. Please check your connection.";
              break;
          }
          
          toast.error(errorMessage);
          resolve();
        },
        locationOptions
      );
    });
  };

  return { requestUserLocation };
};
