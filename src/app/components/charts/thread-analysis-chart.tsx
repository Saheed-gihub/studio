'use client';

import Image from 'next/image';
import { Line, LineChart, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { placeholderImages } from '@/lib/placeholder-images.json';

const threatData = [
  { time: '00:00', anomalyScore: 5 },
  { time: '02:00', anomalyScore: 8 },
  { time: '04:00', anomalyScore: 6 },
  { time: '06:00', anomalyScore: 15 },
  { time: '08:00', anomalyScore: 9 },
  { time: '10:00', anomalyScore: 25 },
  { time: '12:00', anomalyScore: 12 },
  { time: '14:00', anomalyScore: 18 },
  { time: '16:00', anomalyScore: 30 },
  { time: '18:00', anomalyScore: 22 },
  { time: '20:00', anomalyScore: 28 },
  { time: '22:00', anomalyScore: 15 },
];

const chartConfig = {
  anomalyScore: {
    label: 'Anomaly Score',
    color: 'hsl(var(--accent))',
  },
};

export function ThreadAnalysisChart() {
  const placeholder = placeholderImages.find(p => p.id === 'threat-analysis-bg');

  return (
    <div className="h-[350px] w-full relative">
      {placeholder && (
        <Image
          src={placeholder.imageUrl}
          alt={placeholder.description}
          fill
          className="object-cover rounded-2xl opacity-10 dark:opacity-5"
          data-ai-hint={placeholder.imageHint}
        />
      )}
      <div className="absolute inset-0">
        <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
            <LineChart data={threatData} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                <XAxis dataKey="time" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                content={<ChartTooltipContent />}
                cursor={{ fill: "hsl(var(--accent) / 0.1)" }}
                />
                <Line type="monotone" dataKey="anomalyScore" stroke="hsl(var(--accent))" strokeWidth={3} />
            </LineChart>
            </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
}
