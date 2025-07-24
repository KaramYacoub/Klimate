import { useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";
import { Button } from "./ui/button";
import { Clock, Loader2, Search, Star } from "lucide-react";
import { useLocationSearch } from "@/hooks/useWeather";
import { useNavigate } from "react-router-dom";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { format } from "date-fns";
import { useFavorite } from "@/hooks/useFavorite";

export default function CitySearch() {
  const [open, setOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const navigate = useNavigate();

  const { data: locations, isPending } = useLocationSearch(query);
  const { history, addToHistory, clearHistory } = useSearchHistory();

  const { favorites } = useFavorite();

  const handleOpen = (): void => {
    setOpen((open) => !open);
  };

  const handleSelect = (city: string): void => {
    const [lat, lon, name, country] = city.split("|");

    addToHistory.mutate({
      query: query,
      name: name,
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      country: country,
    });

    setOpen(false);
    navigate(`/city/${name}?lat=${lat}&lon=${lon}`);
  };

  return (
    <>
      <Button
        variant="outline"
        className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        onClick={handleOpen}
      >
        <Search className="mr-2 size-4" />
        Search cities...
      </Button>

      <CommandDialog open={open} onOpenChange={handleOpen}>
        <CommandInput
          placeholder="Search cities..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {query.length > 2 && !isPending && (
            <CommandEmpty>No Cities found.</CommandEmpty>
          )}
          {/* Favorites */}
          {favorites.length > 0 && (
            <CommandGroup heading="Favorites">
              {favorites.map((favorite) => (
                <CommandItem
                  key={`${favorite.id}`}
                  value={`${favorite.lat}|${favorite.lon}|${favorite.name}|${favorite.country}|${favorite.state}`}
                  onSelect={() =>
                    handleSelect(
                      `${favorite.lat}|${favorite.lon}|${favorite.name}|${favorite.country}|${favorite.state}`
                    )
                  }
                >
                  <Star className="mr-2 size-4 text-yellow-500" />
                  <span>{favorite.name}</span>
                  {favorite.state && (
                    <span className="text-sm text-muted-foreground">
                      , {favorite.state}
                    </span>
                  )}
                  <span className="text-sm text-muted-foreground">
                    , {favorite.country}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {history.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup>
                <div className="flex items-center justify-between px-2 my-2">
                  <p className="text-xs text-muted-foreground">
                    Recent searches
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => clearHistory.mutate()}
                    className={"float-right"}
                  ></Button>
                </div>

                {history.map((historyItem) => (
                  <CommandItem
                    key={`${historyItem.lat}-${historyItem.lon}`}
                    value={`${historyItem.lat}|${historyItem.lon}|${historyItem.name}|${historyItem.country}|${historyItem.state}`}
                    onSelect={() =>
                      handleSelect(
                        `${historyItem.lat}|${historyItem.lon}|${historyItem.name}|${historyItem.country}|${historyItem.state}`
                      )
                    }
                  >
                    <Clock className="mr-2 size-4" />
                    <span>{historyItem.name}</span>
                    {historyItem.state && (
                      <span className="text-sm text-muted-foreground">
                        , {historyItem.state}
                      </span>
                    )}
                    <span className="text-sm text-muted-foreground">
                      , {historyItem.country}
                    </span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {format(historyItem.searchAt, "MMM d, h:mm a")}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}

          <CommandSeparator />

          {locations && locations.length > 0 && (
            <CommandGroup heading="Suggestions">
              {isPending && (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="size-4 animate-spin" />
                </div>
              )}
              {locations.map((location) => (
                <CommandItem
                  key={`${location.lat}-${location.lon}`}
                  value={`${location.lat}|${location.lon}|${location.name}|${location.country}|${location.state}`}
                  onSelect={() =>
                    handleSelect(
                      `${location.lat}|${location.lon}|${location.name}|${location.country}|${location.state}`
                    )
                  }
                >
                  <Search className="mr-2 size-4" />
                  <span>{location.name}</span>
                  {location.state && (
                    <span className="text-sm text-muted-foreground">
                      , {location.state}
                    </span>
                  )}
                  <span className="text-sm text-muted-foreground">
                    , {location.country}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
