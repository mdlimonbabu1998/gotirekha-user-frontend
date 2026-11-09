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

| Command           | Description                                         |
| ----------------- | --------------------------------------------------- |
| `npm run dev`     | Start the Vite development server                   |
| `npm run build`   | Type-check and create a production build in `dist/` |
| `npm run lint`    | Run ESLint                                          |
| `npm run preview` | Preview the production build locally                |

## Project structure

```text
src/
  app/                    Application shell, entry point, and global styles
  features/
    alarms/               Alarm history and settings
    dashboard/            Fleet dashboard
    documents/             Vehicle documents
    expenses/              Expense management
    fuel/                  Fuel management
    geofences/             Geofence management
    history/               Trip playback
    live-map/              Live vehicle map
    maintenance/           Vehicle maintenance
    reports/               Fleet reports
    users/                 Sub-user management
    vehicles/              Vehicle management
  shared/
    layout/                App navigation and shared layout
```
