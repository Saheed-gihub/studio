'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Thermometer, Droplets, Leaf } from 'lucide-react';
import type { SensorData } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface LatestReadingsProps {
  latestReading: SensorData | null;
}

export function LatestReadings({ latestReading }: LatestReadingsProps) {
  const getTempColor = (temp: number) => {
    if (temp < 10) return 'bg-blue-200 text-blue-800';
    if (temp > 30) return 'bg-red-200 text-red-800';
    return 'bg-green-200 text-green-800';
  };
  
  if (!latestReading) {
    return (
      <div className="grid gap-8 md:grid-cols-3">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
    );
  }

  const tempColorClass = getTempColor(latestReading.temperature);

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <Card className={cn("rounded-3xl border-2 transition-colors", tempColorClass.replace(/bg-([a-z]+)-200/g, 'border-$1-300'))}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Temperature</CardTitle>
          <Thermometer className="h-5 w-5" />
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">{latestReading.temperature.toFixed(1)}°C</div>
          <p className="text-xs">{latestReading.datetime}</p>
        </CardContent>
      </Card>
      <Card className="rounded-3xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Humidity</CardTitle>
          <Droplets className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">{latestReading.humidity.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">Relative Humidity</p>
        </CardContent>
      </Card>
      <Card className="rounded-3xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Soil Moisture</CardTitle>
          <Leaf className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">{latestReading.soil_moisture_percent.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">Raw: {latestReading.soil_moisture_raw}</p>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <Card className="rounded-3xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-5" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-10 w-32 mb-2" />
        <Skeleton className="h-4 w-48" />
      </CardContent>
    </Card>
  );
}
