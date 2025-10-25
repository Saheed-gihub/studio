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

    const sensorDataRef = ref(db, 'sensor_data');
    const listener = onValue(
      sensorDataRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const rawData = snapshot.val();
          const dataArray: SensorData[] = Object.values(rawData);
          dataArray.sort((a, b) => b.timestamp - a.timestamp);
          setData(dataArray);
          setLatestReading(dataArray[0] || null);
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
    const sensorDataRef = ref(db, 'sensor_data');
    await set(sensorDataRef, null);
  }, [db]);

  return { data, latestReading, status, dbUrl, setDbUrl, resetData, db };
};
