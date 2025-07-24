import { useFavorite } from "@/hooks/useFavorite";
import { useWeatherQuery } from "@/hooks/useWeather";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface FavoriteCityProps {
  id: string;
  name: string;
  lat: number;
  lon: number;
  onRemove: (id: string) => void;
}

export default function FavoriteCity() {
  const { favorites, removeFavorite } = useFavorite();

  if (!favorites.length) return null;
  return (
    <>
      <h1 className="text-xl font-bold tracking-tight">Favorites</h1>
      <ScrollArea className="w-full pb-4">
        <div className="flex gap-4 w-max">
          {" "}
          {/* Added w-max to prevent wrapping */}
          {favorites.map((favorite) => (
            <FavoriteCityTable
              key={favorite.id}
              {...favorite}
              onRemove={() => removeFavorite.mutate(favorite.id)}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </>
  );
}

function FavoriteCityTable({
  id,
  name,
  lat,
  lon,
  onRemove,
}: FavoriteCityProps) {
  const navigate = useNavigate();
  const { data: weather, isPending } = useWeatherQuery({ lat, lon });
  return (
    <div
      onClick={() => navigate(`/city/${name}?lat=${lat}&lon=${lon}`)}
      role="button"
      tabIndex={0}
      className="relative flex min-w-3xs cursor-pointer items-center gap-3 rounded-lg border bg-card p-4 pr-8 shadow-sm transition-all hover:shadow-md"
    >
      <Button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(id);
          toast.error(`${name} removed from favorites`);
        }}
        className="absolute right-1 top-1 size-6 rounded-full p-0 hover:text-destructive-foreground group-hover:opacity-100"
      >
        <X className="size-4" />
      </Button>

      {isPending ? (
        <div className="flex h-8 items-center justify-center">
          <Loader2 className="animate-spin size-4" />
        </div>
      ) : weather ? (
        <>
          <div className="flex items-center gap-2">
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
              className="size-8"
            />
            <div>
              <p className="font-medium">{name}</p>
              <p className="text-xs text-muted-foreground">
                {weather.sys.country}
              </p>
            </div>
          </div>

          <div className="ml-auto mt-2 flex flex-col items-center">
            <p className="text-xl font-bold">
              {Math.round(weather.main.temp)}°
            </p>
            <p className="text-xs capitalize text-muted-foreground">
              {weather.weather[0].description}
            </p>
          </div>
        </>
      ) : null}
    </div>
  );
}
