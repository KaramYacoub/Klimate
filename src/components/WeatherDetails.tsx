import type { WeatherData } from "@/api/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Compass, Gauge, Sunrise, Sunset } from "lucide-react";
import { format } from "date-fns";

interface WeatherDetailsProps {
  data: WeatherData;
}

export default function WeatherDetails({ data }: WeatherDetailsProps) {
  const { wind, main, sys } = data;

  const formatTime = (timestamp: number): string => {
    return format(new Date(timestamp * 1000), "h:mm a");
  };

  const getWindDirection = (deg: number): string => {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index = Math.round(((deg %= 360) < 0 ? deg + 360 : deg) / 45) % 8;
    return directions[index];
  };

  const details = [
    {
      title: "Sunrise",
      value: formatTime(sys.sunrise),
      icon: Sunrise,
      color: "text-orange-500",
    },
    {
      title: "Sunset",
      value: formatTime(sys.sunset),
      icon: Sunset,
      color: "text-blue-500",
    },
    {
      title: "Wind",
      value: `${getWindDirection(wind.deg)} (${wind.speed}°)`,
      icon: Compass,
      color: "text-green-500",
    },
    {
      title: "Pressure",
      value: `${main.pressure} hPa`,
      icon: Gauge,
      color: "text-purple-500",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weather Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 sm:grid-cols-2">
          {details.map((detail) => (
            <div key={detail.title} className="flex items-center gap-3 rounded-lg border p-4">
              <detail.icon className={`size-5 ${detail.color}`} />
              <div className="flex flex-col">
                <span className="text-sm font-medium leading-none">{detail.title}</span>
                <span className="text-sm text-muted-foreground">
                  {detail.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
