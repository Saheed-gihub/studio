'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getDatabase,
  ref,
  onValue,
  off,
  set,
  Database,
} from 'firebase/database';
import type { SensorData } from '@/lib/types';
import { initializeDb } from '@/lib/firebase';

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export const useSensorData = () => {
  const [dbUrl, setDbUrlState] = useState<string | null>(null);
  const [db, setDb] = useState<Database | null>(null);
  const [data, setData] = useState<SensorData[]>([]);
  const [latestReading, setLatestReading] = useState<SensorData | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');

  useEffect(() => {
    const storedDbUrl = localStorage.getItem('firebaseDbUrl');
    if (storedDbUrl) {
      setDbUrlState(storedDbUrl);
    }
  }, []);

  const setDbUrl = useCallback((url: string) => {
    localStorage.setItem('firebaseDbUrl', url);
    setDbUrlState(url);
  }, []);

  useEffect(() => {
    if (!dbUrl) {
      setStatus('disconnected');
      setData([]);
      setLatestReading(null);
      setDb(null);
      return;
    }

    try {
      setStatus('connecting');
      const database = initializeDb(dbUrl);
      setDb(database);
      setStatus('connected');
    } catch (error) {
      console.error('Firebase connection error:', error);
      setStatus('error');
      setDb(null);
    }
  }, [dbUrl]);

  useEffect(() => {
    if (status !== 'connected' || !db) {
      return;
    }

    const sensorDataRef = ref(db, 'sensor_logs');
    const listener = onValue(
      sensorDataRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const rawData = snapshot.val();
          
          let dataArray: (SensorData | null)[];
          if (Array.isArray(rawData)) {
            // Firebase can return arrays with null for deleted items
            dataArray = rawData.filter(item => item); 
          } else if (typeof rawData === 'object' && rawData !== null) {
            dataArray = Object.values(rawData);
          } else {
            dataArray = [rawData];
          }

          const validData = dataArray.filter((d): d is SensorData => d !== null && d !== undefined);

          if(validData.length > 0) {
            validData.sort((a, b) => b.timestamp - a.timestamp);
            setData(validData);
            setLatestReading(validData[0] || null);
          } else {
            setData([]);
            setLatestReading(null);
          }
        } else {
          setData([]);
          setLatestReading(null);
        }
      },
      (error) => {
        console.error('Error fetching data:', error);
        setStatus('error');
      }
    );

    return () => {
      off(sensorDataRef, 'value', listener);
    };
  }, [status, db]);

  const resetData = useCallback(async () => {
    if (!db) return;
    const sensorDataRef = ref(db, 'sensor_logs');
    await set(sensorDataRef, null);
  }, [db]);

  return { data, latestReading, status, dbUrl, setDbUrl, resetData, db };
};
