'use client';

import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import type { SensorData } from '@/lib/types';
import { Card } from '@/components/ui/card';

interface MoistureChartProps {
  data: SensorData[];
}

export function MoistureChart({ data }: MoistureChartProps) {
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
  };

  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
          <XAxis
            dataKey="datetime"
            tickFormatter={(value) => new Date(value).toLocaleTimeString()}
            tickLine={false}
            axisLine={false}
            fontSize={12}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}%`}
            domain={[0, 100]}
          />
          <Tooltip
            content={<ChartTooltipContent
                formatter={(value) => [`${value}%`, 'Moisture']}
                labelFormatter={(label, payload) => {
                    return payload && payload.length > 0 ? new Date(payload[0].payload.datetime).toLocaleString() : label;
                }}
                wrapperStyle={{ zIndex: 1000 }}
                contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                }}
            />}
            cursor={{ fill: "hsl(var(--accent) / 0.2)" }}
          />
          <Bar dataKey="soil_moisture_percent" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
