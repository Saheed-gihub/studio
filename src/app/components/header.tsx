'use client';

import React from 'react';
import { Database, Wifi, WifiOff, Trash2, Download, Calendar as CalendarIcon, Settings } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { FirebaseConfigDialog } from './firebase-config-dialog';
import { cn } from '@/lib/utils';

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

interface AppHeaderProps {
  status: ConnectionStatus;
  dbUrl: string | null;
  setDbUrl: (url: string) => void;
  onReset: () => void;
  onExport: () => void;
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
}

export function AppHeader({ status, dbUrl, setDbUrl, onReset, onExport, dateRange, setDateRange }: AppHeaderProps) {
  const statusConfig = {
    disconnected: { icon: <WifiOff className="text-muted-foreground" />, text: 'Disconnected', color: 'bg-muted' },
    connecting: { icon: <Wifi className="text-blue-500 animate-pulse" />, text: 'Connecting', color: 'bg-blue-500' },
    connected: { icon: <Wifi className="text-green-500" />, text: 'Connected', color: 'bg-green-500' },
    error: { icon: <WifiOff className="text-red-500" />, text: 'Error', color: 'bg-red-500' },
  };

  return (
    <header className="w-full">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary rounded-2xl text-primary-foreground">
             <Database size={28} />
          </div>
          <h1 className="text-3xl md:text-4xl font-headline tracking-tight">IOT Sensor Detector</h1>
        </div>
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-card px-3 py-2 rounded-lg border">
              <div className={`w-3 h-3 rounded-full ${statusConfig[status].color}`} />
              <span>{statusConfig[status].text}</span>
            </div>
          </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
          <FirebaseConfigDialog dbUrl={dbUrl} setDbUrl={setDbUrl}>
            <Button variant="outline"><Settings className="mr-2 h-4 w-4" />Connection</Button>
          </FirebaseConfigDialog>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[300px] justify-start text-left font-normal",
                  !dateRange && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          
          <Button variant="secondary" onClick={onExport}><Download className="mr-2 h-4 w-4" />Export CSV</Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive"><Trash2 className="mr-2 h-4 w-4" />Reset Data</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete all sensor data from your Firebase Realtime Database.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onReset}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
    </header>
  );
}
