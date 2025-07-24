import { type Coordinate } from "@/api/types";
import {
  getCurrentWeather,
  getForecast,
  reverseGeocode,
  searchLocations,
} from "@/api/weather";
import { useQuery } from "@tanstack/react-query";

export function useWeatherQuery(coordinates: Coordinate | null) {
  return useQuery({
    queryKey: ["weather", coordinates ?? { lat: 0, lon: 0 }],
    queryFn: async () => {
      if (coordinates) {
        return await getCurrentWeather(coordinates);
      }
    },
    enabled: !!coordinates,
  });
}

export function useForecastQuery(coordinates: Coordinate | null) {
  return useQuery({
    queryKey: ["forecast", coordinates ?? { lat: 0, lon: 0 }],
    queryFn: async () => {
      if (coordinates) {
        return await getForecast(coordinates);
      }
    },
    enabled: !!coordinates,
  });
}

export function useReverseGeocodedQuery(coordinates: Coordinate | null) {
  return useQuery({
    queryKey: ["location", coordinates ?? { lat: 0, lon: 0 }],
    queryFn: async () => {
      if (coordinates) {
        return await reverseGeocode(coordinates);
      }
    },
    enabled: !!coordinates,
  });
}

export function useLocationSearch(query: string) {
  return useQuery({
    queryKey: ["location-search", query ?? ""],
    queryFn: async () => {
      if (query) {
        return await searchLocations(query);
      }
    },
    enabled: query?.length > 2,
  });
}
