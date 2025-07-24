import type { ForecastData } from "@/api/types";
import { Card, CardContent, CardHeader } from "./ui/card";
import {
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  LineChart,
  Tooltip,
} from "recharts";
import { format } from "date-fns";

interface HourlyTempProps {
  data: ForecastData;
}
export default function HourlyTemp({ data }: HourlyTempProps) {
  const chartData = data.list.slice(0, 8).map((item) => ({
    time: format(new Date(item.dt * 1000), "h a"),
    temp: Math.round(item.main.temp),
    feels_like: Math.round(item.main.feels_like),
  }));
  return (
    <Card className="flex flex-1 ">
      <CardHeader>Today's Temperature</CardHeader>
      <CardContent>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                fontSize={12}
                stroke="#888888"
                tickMargin={20}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                fontSize={12}
                stroke="#888888"
                tickFormatter={(value) => `${value}°`}
                domain={["dataMin", "dataMax"]}
                tickMargin={20}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="p-2 rounded-lg border bg-background shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          {/* temp */}
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Tempreature
                            </span>
                            <span className="font-bold">
                              {payload[0].value}°
                            </span>
                          </div>
                          {/* feels like */}
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Feels Like
                            </span>
                            <span className="font-bold">
                              {payload[1].value}°
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="temp"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="feels_like"
                stroke="#64748b"
                strokeWidth={2}
                dot={false}
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
