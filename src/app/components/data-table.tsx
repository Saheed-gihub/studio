'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { SensorData } from '@/lib/types';

interface DataTableProps {
  data: SensorData[];
}

export function DataTable({ data }: DataTableProps) {
  return (
    <ScrollArea className="h-[400px] w-full rounded-md border">
      <Table>
        <TableHeader className="sticky top-0 bg-card">
          <TableRow>
            <TableHead>Date & Time</TableHead>
            <TableHead className="text-right">Temperature</TableHead>
            <TableHead className="text-right">Humidity</TableHead>
            <TableHead className="text-right">Moisture (%)</TableHead>
            <TableHead className="text-right">Moisture (Raw)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((reading) => (
              <TableRow key={reading.timestamp}>
                <TableCell className="font-medium">{new Date(reading.datetime).toLocaleString()}</TableCell>
                <TableCell className="text-right">{reading.temperature.toFixed(1)}°C</TableCell>
                <TableCell className="text-right">{reading.humidity.toFixed(1)}%</TableCell>
                <TableCell className="text-right">{reading.soil_moisture_percent.toFixed(1)}%</TableCell>
                <TableCell className="text-right">{reading.soil_moisture_raw}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No readings found. Check your database connection or filter settings.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
