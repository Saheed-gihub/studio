'use client';

import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { useSensorData } from '@/lib/hooks/use-sensor-data';
import type { SensorData } from '@/lib/types';
import { AppHeader } from './header';
import { LatestReadings } from './latest-readings';
import { CombinedChart } from './charts/combined-chart';
import { ThreadAnalysisChart } from './charts/thread-analysis-chart';
import { DataTable } from './data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
  const { data, latestReading, status, dbUrl, setDbUrl, resetData } = useSensorData();
  const { toast } = useToast();

  const [readingsCount, setReadingsCount] = useState<string>('50');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const filteredData = useMemo(() => {
    let filtered = data;
    if (dateRange?.from) {
      filtered = filtered.filter(d => new Date(d.datetime) >= dateRange.from!);
    }
    if (dateRange?.to) {
      // Add one day to 'to' date to include the whole day
      const toDate = new Date(dateRange.to);
      toDate.setDate(toDate.getDate() + 1);
      filtered = filtered.filter(d => new Date(d.datetime) < toDate);
    }
    return filtered;
  }, [data, dateRange]);

  const chartData = useMemo(() => {
    const count = parseInt(readingsCount, 10);
    return filteredData.slice(0, count).reverse(); // reverse for chronological order in charts
  }, [filteredData, readingsCount]);

  const handleReset = async () => {
    try {
      await resetData();
      toast({
        title: "Success",
        description: "All sensor data has been deleted.",
        variant: "default",
      });
    } catch (error) {
      console.error("Failed to reset data:", error);
      toast({
        title: "Error",
        description: "Failed to reset database. Check console for details.",
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    if (filteredData.length === 0) {
      toast({ title: "No data to export", variant: "destructive" });
      return;
    }
    const headers = 'timestamp,datetime,temperature,humidity,soil_moisture_percent,soil_moisture_raw';
    const csvContent = [
      headers,
      ...filteredData.map(d => 
        [d.timestamp, `"${d.datetime}"`, d.temperature, d.humidity, d.soil_moisture_percent, d.soil_moisture_raw].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
    link.setAttribute('download', `sensor_data_${timestamp}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Success", description: "Data exported to CSV." });
  };

  return (
    <div className="w-full">
      <AppHeader
        status={status}
        dbUrl={dbUrl}
        setDbUrl={setDbUrl}
        onReset={handleReset}
        onExport={handleExport}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />
      <div className="mt-8 grid gap-8">
        <LatestReadings latestReading={latestReading} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <Card className="rounded-3xl lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-headline">Sensor Readings</CardTitle>
              <ChartControls count={readingsCount} setCount={setReadingsCount} />
            </CardHeader>
            <CardContent>
              <CombinedChart data={chartData} />
            </CardContent>
          </Card>
          
          <Card className="rounded-3xl lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-headline">All Readings</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable data={filteredData} />
            </CardContent>
          </Card>

           <Card className="rounded-3xl lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-headline">Threat Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ThreadAnalysisChart />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ChartControls({ count, setCount }: { count: string, setCount: (value: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Readings:</span>
      <Select value={count} onValueChange={setCount}>
        <SelectTrigger className="w-24 h-9">
          <SelectValue placeholder="Count" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="25">25</SelectItem>
          <SelectItem value="50">50</SelectItem>
          <SelectItem value="100">100</SelectItem>
          <SelectItem value="200">200</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
