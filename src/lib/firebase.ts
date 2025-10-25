import { initializeApp, getApp, deleteApp, FirebaseApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { firebaseConfig } from '@/firebase/config';

let app: FirebaseApp;

export const initializeDb = () => {
  try {
    app = getApp('iot-sensor-app');
  } catch (e) {
    app = initializeApp(firebaseConfig, 'iot-sensor-app');
  }

  return getDatabase(app);
};
