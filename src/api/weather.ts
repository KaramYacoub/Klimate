import { API_CONFIG } from "./config";
import type {
  Coordinate,
  ForecastData,
  GeocodingResponse,
  WeatherData,
} from "./types";

/**
 * Create a URL for the given endpoint with the given search parameters.
 */
function createUrl(endpoint: string, params: Record<string, string | number>) {
  const searchParams = new URLSearchParams({
    appid: API_CONFIG.API_KEY,
    ...params,
  });
  return `${endpoint}?${searchParams.toString()}`;
}

/**
 * Fetches data from the given URL and returns it as JSON.
 */
async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json();
}

/**
 * Retrieves the current weather data for a given coordinate.
 */
export async function getCurrentWeather({
  lat,
  lon,
}: Coordinate): Promise<WeatherData> {
  const url = createUrl(`${API_CONFIG.BASE_URL}/weather`, {
    lat: lat.toString(),
    lon: lon.toString(),
    units: API_CONFIG.DEFAULT_PARAMS.units,
  });
  return fetchData<WeatherData>(url);
}

/**
 * Retrieves the 5-day weather forecast for a given coordinate.
 */
export async function getForecast({
  lat,
  lon,
}: Coordinate): Promise<ForecastData> {
  const url = createUrl(`${API_CONFIG.BASE_URL}/forecast`, {
    lat: lat.toString(),
    lon: lon.toString(),
    units: API_CONFIG.DEFAULT_PARAMS.units,
  });
  return fetchData<ForecastData>(url);
}

/**
 * Reverse geocodes the given coordinate and returns the first result.
 */
export async function reverseGeocode({
  lat,
  lon,
}: Coordinate): Promise<GeocodingResponse[]> {
  const url = createUrl(`${API_CONFIG.GEO}/reverse`, {
    lat: lat.toString(),
    lon: lon.toString(),
    limit: 1,
  });
  return fetchData<GeocodingResponse[]>(url);
}

/**
 * Searches for locations matching the given query.
 */
export async function searchLocations(
  query: string
): Promise<GeocodingResponse[]> {
  const url = createUrl(`${API_CONFIG.GEO}/direct`, {
    q: query,
    limit: 5,
  });
  return fetchData<GeocodingResponse[]>(url);
}
