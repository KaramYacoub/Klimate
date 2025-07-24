import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalStorage } from "./useLocalStorage";

interface FavoriteCity {
  id: string;
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
  addedAt: number;
}

export function useFavorite() {
  const [favorite, setFavorite] = useLocalStorage<FavoriteCity[]>(
    "favorites",
    []
  );

  const queryClient = useQueryClient();

  const favoriteQuery = useQuery({
    queryKey: ["favorite"],
    queryFn: async () => favorite,
    initialData: favorite,
    staleTime: Infinity,
  });

  const addToFavorite = useMutation({
    mutationFn: async (city: Omit<FavoriteCity, "id" | "addedAt">) => {
      const newFavorite: FavoriteCity = {
        ...city,
        id: `${city.lat}-${city.lon}`,
        addedAt: Date.now(),
      };

      const exists = favorite.some((fav) => fav.id === newFavorite.id);
      if (exists) return favorite;

      const newFavorites = [...favorite, newFavorite].slice(0, 10);
      setFavorite(newFavorites);

      return newFavorites;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorite"] });
    },
  });

  const removeFavorite = useMutation({
    mutationFn: async (cityId: string) => {
      const newFavorites = favorite.filter((fav) => fav.id !== cityId);
      setFavorite(newFavorites);
      return newFavorites;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorite"] });
    },
  });

  return {
    favorites: favoriteQuery.data,
    addToFavorite,
    removeFavorite,
    isFavorite: (lat: number, lon: number) =>
      favorite.some((city) => city.lat === lat && city.lon === lon),
  };
}
