'use client';

import { Line, LineChart, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ChartContainer, ChartTooltipContent, ChartLegendContent } from '@/components/ui/chart';
import type { SensorData } from '@/lib/types';

interface TempHumidityChartProps {
  data: SensorData[];
}

export function TempHumidityChart({ data }: TempHumidityChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-[250px] w-full flex items-center justify-center">
        <p className="text-muted-foreground">Waiting for data...</p>
      </div>
    );
  }
  
  const chartConfig = {
    temperature: {
      label: 'Temperature (°C)',
      color: 'hsl(var(--chart-2))',
    },
    humidity: {
      label: 'Humidity (%)',
      color: 'hsl(var(--chart-3))',
    },
  };

  return (
    <div className="h-[250px] w-full">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
          <XAxis
            dataKey="datetime"
            tickFormatter={(value) => new Date(value).toLocaleTimeString()}
            tickLine={false}
            axisLine={false}
            fontSize={12}
          />
          <YAxis
            yAxisId="left"
            stroke="var(--color-temperature)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}°C`}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="var(--color-humidity)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            content={<ChartTooltipContent
                labelFormatter={(label, payload) => {
                    return payload && payload.length > 0 ? new Date(payload[0].payload.datetime).toLocaleString() : label;
                }}
                wrapperStyle={{ zIndex: 1000 }}
                contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                }}
                cursor={{ stroke: 'hsl(var(--accent))', strokeWidth: 2, strokeDasharray: '3 3' }}
            />}
          />
          <Legend content={<ChartLegendContent />} />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="temperature"
            stroke="var(--color-temperature)"
            strokeWidth={2}
            dot={false}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="humidity"
            stroke="var(--color-humidity)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
}
