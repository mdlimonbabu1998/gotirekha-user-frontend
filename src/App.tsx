import { useState } from 'react'
import Dashboard from './Dashboard'
import GeofencesModule from './GeofencesModule'
import HistoryPlayback from './HistoryPlayback'
import LiveMap from './LiveMap'
import ReportsModule from './ReportsModule'
import Sidebar from './Sidebar'
import VehicleList from './VehicleList'

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <div className="vts-app-wrapper flex h-screen w-screen overflow-hidden bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 h-full min-h-0 overflow-y-auto flex flex-col">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'live-track' && <LiveMap />}
        {activeTab === 'history' && <HistoryPlayback />}
        {activeTab === 'reports' && <ReportsModule />}
        {activeTab === 'geofences' && <GeofencesModule />}
        {activeTab === 'vehicle-list' && <VehicleList />}
        {!['dashboard', 'live-track', 'history', 'reports', 'geofences', 'vehicle-list'].includes(activeTab) && (
          <div className="p-8">
            <h1 className="text-xl font-bold text-gray-800 capitalize">
              {activeTab.replaceAll('-', ' ')} View
            </h1>
          </div>
        )}
      </main>
    </div>
  )
}
