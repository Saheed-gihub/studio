'use client';

import React, { useMemo } from 'react';
import type { SensorData } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Thermometer, Droplets, Leaf, ArrowUp, ArrowDown, Minus } from 'lucide-react';

interface DataSummaryProps {
  data: SensorData[];
}

interface Stats {
  avg: number;
  min: number;
  max: number;
}

export function DataSummary({ data }: DataSummaryProps) {
  const stats = useMemo(() => {
    if (data.length === 0) {
      return {
        temperature: { avg: 0, min: 0, max: 0 },
        humidity: { avg: 0, min: 0, max: 0 },
        soil_moisture_percent: { avg: 0, min: 0, max: 0 },
      };
    }

    const calculateStats = (key: keyof SensorData): Stats => {
        const values = data.map(d => d[key] as number);
        const sum = values.reduce((a, b) => a + b, 0);
        return {
          avg: sum / values.length,
          min: Math.min(...values),
          max: Math.max(...values),
        };
      };
      
    return {
      temperature: calculateStats('temperature'),
      humidity: calculateStats('humidity'),
      soil_moisture_percent: calculateStats('soil_moisture_percent'),
    };
  }, [data]);

  return (
    <Card className="rounded-3xl lg:col-span-2">
      <CardHeader>
        <CardTitle className="font-headline">Data Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatItem
            icon={<Thermometer className="h-6 w-6 text-red-500" />}
            title="Temperature"
            stats={stats.temperature}
            unit="°C"
          />
          <StatItem
            icon={<Droplets className="h-6 w-6 text-blue-500" />}
            title="Humidity"
            stats={stats.humidity}
            unit="%"
          />
          <StatItem
            icon={<Leaf className="h-6 w-6 text-green-500" />}
            title="Soil Moisture"
            stats={stats.soil_moisture_percent}
            unit="%"
          />
        </div>
      </CardContent>
    </Card>
  );
}

interface StatItemProps {
    icon: React.ReactNode;
    title: string;
    stats: Stats;
    unit: string;
}

function StatItem({ icon, title, stats, unit }: StatItemProps) {
    return (
        <div className="flex flex-col gap-4 p-4 rounded-2xl bg-card border">
            <div className="flex items-center gap-3">
                {icon}
                <h3 className="font-semibold text-lg">{title}</h3>
            </div>
            <div className="text-center">
                <p className="text-sm text-muted-foreground">Average</p>
                <p className="text-2xl font-bold">{stats.avg.toFixed(1)}{unit}</p>
            </div>
            <div className="flex justify-around text-sm">
                <div className="flex items-center gap-1">
                    <ArrowDown className="h-4 w-4 text-muted-foreground" />
                    <span>{stats.min.toFixed(1)}{unit}</span>
                </div>
                <div className="flex items-center gap-1">
                    <ArrowUp className="h-4 w-4 text-muted-foreground" />
                    <span>{stats.max.toFixed(1)}{unit}</span>
                </div>
            </div>
        </div>
    )
}
