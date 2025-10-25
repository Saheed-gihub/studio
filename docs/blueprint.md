# **App Name**: IOT Sensor Detector

## Core Features:

- Firebase Configuration: Accepts Firebase Realtime Database URL to connect to the database and persists to local storage. Connection status indicator displays connection status.
- Real-time Chart Updates: Displays live charts of soil moisture percentage and temperature/humidity over time. The number of readings can be configured to limit the amount displayed on each chart.
- Latest Readings Display: Shows the current readings (temperature, humidity, soil moisture) in stat cards.
- Data Table Display: Scrollable table showing all readings in datetime, temperature, humidity, soil_moisture_percent, soil_moisture_raw.
- CSV Export: Exports all data as a CSV file. Uses timestamp, datetime, temperature, humidity, soil_moisture_percent, and soil_moisture_raw as headers. Saves in sensor_data_YYYYMMDD_HHMMSS.csv format.
- Date Range Filter: Filter readings displayed between a selectable date range. User must enter two valid dates.
- Database reset: Remove all sensor data. Confirm before proceeding.
- Thread Analysis Graph: Graph to display thread analysis data.

## Style Guidelines:

- Primary color: Purple (#800080) for a sophisticated and modern feel.
- Secondary color: Blue (#0000FF) for a cool and calming effect.
- Accent color: Yellow (#FFFF00) to highlight important actions and data points.
- Temperature Threshold: Change color based on temperature threshold.
- Body text: 'Inter' (sans-serif) for a modern, clean, and readable interface. Headline: 'Space Grotesk' (sans-serif) is used for a modern technical look.
- Simple line icons to represent data types and actions.
- Circular card layout for displaying data and navigation elements.
- Card-based layout using CSS Grid for responsive design.
- Smooth transitions for loading data and updating charts.