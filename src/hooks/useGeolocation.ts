import { useEffect, useState } from "react";
import type { Coordinate } from "@/api/types";

interface GeoLocationState {
  coordinates: Coordinate | null;
  error: string | null;
  isLoading: boolean;
}

export function useGeoLocation() {
  // state for location
  const [location, setLocation] = useState<GeoLocationState>({
    coordinates: null,
    error: null,
    isLoading: true,
  });

  // function to get location data from browser
  const getLocation = () => {
    // check if geolocation is supported by browser
    if (!navigator.geolocation) {
      setLocation({
        coordinates: null,
        error: "Geolocation is not supported by this browser",
        isLoading: false,
      });
    }

    navigator.geolocation.getCurrentPosition(
      // get current position of user
      (position) => {
        setLocation({
          coordinates: {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          },
          error: null,
          isLoading: false,
        });
      },
      // handle error
      (error) => {
        // handle different error codes
        let errorMessage: string;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Location access denied. Please enable location access.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
          default:
            errorMessage = "An error occurred while getting your location.";
            break;
        }

        setLocation({
          coordinates: null,
          error: errorMessage,
          isLoading: false,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

  // get location on mount
  useEffect(() => {
    getLocation();
  }, []);

  // return location data and getLocation function
  return { ...location, getLocation };
}
