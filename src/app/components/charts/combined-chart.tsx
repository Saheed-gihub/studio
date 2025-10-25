'use client';

import { Bar, Line, ComposedChart, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ChartContainer, ChartTooltipContent, ChartLegendContent } from '@/components/ui/chart';
import type { SensorData } from '@/lib/types';

interface CombinedChartProps {
  data: SensorData[];
}

export function CombinedChart({ data }: CombinedChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-[250px] w-full flex items-center justify-center">
        <p className="text-muted-foreground">Waiting for data...</p>
      </div>
    );
  }
  
  const chartConfig = {
    soil_moisture_percent: {
      label: 'Soil Moisture (%)',
      color: 'hsl(var(--chart-1))',
    },
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
    <div className="h-[350px] w-full">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <ComposedChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
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
            domain={[0, 100]}
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
          <Bar dataKey="soil_moisture_percent" yAxisId="right" fill="var(--color-soil_moisture_percent)" radius={[4, 4, 0, 0]} />
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
        </ComposedChart>
      </ChartContainer>
    </div>
  );
}
