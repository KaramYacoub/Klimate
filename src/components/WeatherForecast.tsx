import type { ForecastData } from "@/api/types";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ArrowDown, ArrowUp, Droplets, Wind } from "lucide-react";

interface WeatherForecastProps {
  data: ForecastData;
}

export type DailyForecast = {
  date: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  wind: number;
  weather: {
    main: string;
    description: string;
    icon: string;
  };
};

export default function WeatherForecast({ data }: WeatherForecastProps) {
  const dailyForecast = data.list.reduce((acc, forecast) => {
    const date = format(new Date(forecast.dt * 1000), "yyyy-MM-dd");
    if (!acc[date]) {
      acc[date] = {
        temp_min: forecast.main.temp_min,
        temp_max: forecast.main.temp_max,
        humidity: forecast.main.humidity,
        wind: forecast.wind.speed,
        weather: forecast.weather[0],
        date: forecast.dt,
      };
    } else {
      acc[date].temp_min = Math.min(acc[date].temp_min, forecast.main.temp_min);
      acc[date].temp_max = Math.max(acc[date].temp_max, forecast.main.temp_max);
      acc[date].humidity = Math.max(acc[date].humidity, forecast.main.humidity);
      acc[date].wind = Math.max(acc[date].wind, forecast.wind.speed);
    }
    return acc;
  }, {} as Record<string, DailyForecast>);

  const nextDays = Object.values(dailyForecast).slice(0, 6);

  const formatTemp = (temp: number): string => `${Math.round(temp)}°`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>5-Days Forecast</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="grid gap-4 ">
          {nextDays.map((day) => (
            <div
              key={day.date}
              className="grid grid-cols-1 lg:grid-cols-3 items-center gap-4 rounded-lg border p-4 shadow-xl"
            >
              <div>
                <p className="font-medium">
                  {format(new Date(day.date * 1000), "EEE, MMM d")}
                </p>
                <p className="text-sm text-muted-foreground capitalize">
                  {day.weather.description}
                </p>
              </div>

              <div className="flex lg:justify-center gap-4">
                <span className="flex items-center text-blue-500">
                  <ArrowDown className="mr-1 size-4" />
                  {formatTemp(day.temp_min)}
                </span>
                <span className="flex items-center text-red-500">
                  <ArrowUp className="mr-1 size-4" />
                  {formatTemp(day.temp_max)}
                </span>
              </div>

              <div className="flex lg:justify-end gap-4">
                <span className="flex items-center gap-1">
                  <Droplets className="size-4 text-blue-500" />
                  {day.humidity}%
                </span>
                <span className="flex items-center gap-1">
                  <Wind className="size-4 text-blue-500" />
                  {day.wind} m/s
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
