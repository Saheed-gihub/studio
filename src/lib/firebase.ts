import { initializeApp, getApp, deleteApp, FirebaseApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

let app: FirebaseApp;

export const initializeDb = (databaseURL: string) => {
  try {
    app = getApp('iot-sensor-app');
    deleteApp(app).then(() => {
        app = initializeApp({ databaseURL }, 'iot-sensor-app');
    });
  } catch (e) {
    app = initializeApp({ databaseURL }, 'iot-sensor-app');
  }

  return getDatabase(app);
};
