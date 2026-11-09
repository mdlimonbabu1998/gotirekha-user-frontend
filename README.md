# Gotirekha User Frontend

A React-based fleet-management interface for vehicle dashboards, live maps, trip history, reports, alarms, geofences, user and vehicle records, and operations management.

The interface uses sample data. Backend/API integration is not configured.

## Requirements

- Node.js 20.19+ or 22.12+
- npm

## Getting started

```bash
npm ci
npm run dev
```

Open the local URL printed by Vite. Tailwind CSS is loaded from its CDN, and map tiles require an internet connection.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check and create a production build in `dist/` |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview the production build locally |

## Project structure

```text
src/
  components/   Alarm and vehicle-operations screens
  App.tsx       Main application and view selection
  Dashboard.jsx Fleet dashboard
  LiveMap.jsx   Live vehicle map
  main.tsx      React entry point
```
