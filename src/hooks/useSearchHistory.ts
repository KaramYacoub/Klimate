import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalStorage } from "./useLocalStorage";

interface SearchHistory {
  id: string;
  query: string;
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
  searchAt: number;
}

export function useSearchHistory() {
  const [history, setHistory] = useLocalStorage<SearchHistory[]>(
    "search-history",
    []
  );

  const queryClient = useQueryClient();

  const historyQuery = useQuery({
    queryKey: ["search-history"],
    queryFn: async () => history,
    initialData: history,
  });

  const addToHistory = useMutation({
    mutationFn: async (search: Omit<SearchHistory, "id" | "searchAt">) => {
      const newSearch: SearchHistory = {
        ...search,
        id: `${search.lat}-${search.lon}-${Date.now()}`,
        searchAt: Date.now(),
      };

      const filteredHistory = history.filter(
        (item) => !(item.lat === search.lat && item.lon === search.lon)
      );

      const newHistory = [newSearch, ...filteredHistory].slice(0, 10);
      setHistory(newHistory);

      return newHistory;
    },
    onSuccess: () => {
      queryClient.setQueryData(["search-history"], history);
    },
  });

  const clearHistory = useMutation({
    mutationFn: async () => {
      setHistory([]);
    },
    onSuccess: () => {
      queryClient.setQueryData(["search-history"], []);
    },
  });

  return { history: historyQuery.data ?? [], addToHistory, clearHistory };
}
