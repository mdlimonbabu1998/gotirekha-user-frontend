import { useState } from "react";
import AlarmSettings from "../features/alarms/AlarmSettings";
import AlarmsHistory from "../features/alarms/AlarmsHistory";
import Dashboard from "../features/dashboard/Dashboard";
import PaperInformation from "../features/documents/PaperInformation";
import ExpensesModule from "../features/expenses/ExpensesModule";
import FuelManagement from "../features/fuel/FuelManagement";
import GeofencesModule from "../features/geofences/GeofencesModule";
import HistoryPlayback from "../features/history/HistoryPlayback";
import LiveMap from "../features/live-map/LiveMap";
import VehicleMaintenance from "../features/maintenance/VehicleMaintenance";
import ReportsModule from "../features/reports/ReportsModule";
import SubUserList from "../features/users/SubUserList";
import VehicleList from "../features/vehicles/VehicleList";
import Sidebar from "../shared/layout/Sidebar";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="vts-app-wrapper flex h-screen w-screen overflow-hidden bg-gray-50">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 h-full min-h-0 overflow-y-auto flex flex-col">
        {/* Dashboard View */}
        {activeTab === "dashboard" && <Dashboard />}

        {/* Live Track Map View */}
        {activeTab === "live-track" && <LiveMap />}

        {/* History Playback View */}
        {activeTab === "history" && <HistoryPlayback />}

        {/* Reports View */}
        {activeTab === "reports" && <ReportsModule />}

        {/* Alarm History Log View */}
        {activeTab === "alarms" && <AlarmsHistory />}

        {/* Alarm Settings / Preferences View */}
        {["settings", "alarm-settings"].includes(activeTab) && (
          <AlarmSettings />
        )}

        {/* Geofences View */}
        {activeTab === "geofences" && <GeofencesModule />}

        {/* Sub User List View */}
        {["sub-user-list", "sub-users", "subuserlist"].includes(activeTab) && (
          <SubUserList />
        )}

        {/* Vehicle List View */}
        {["vehicle-list", "vehicles", "vehiclelist"].includes(activeTab) && (
          <VehicleList />
        )}

        {/* Paper Information View */}
        {[
          "paper-information",
          "paperinformation",
          "papers",
          "paper-info",
        ].includes(activeTab) && <PaperInformation />}

        {/* Vehicle Maintenance View */}
        {["vehicle-maintenance", "vehiclemaintenance", "maintenance"].includes(
          activeTab,
        ) && <VehicleMaintenance />}

        {/* Vehicle Expenses View */}
        {["expenses", "expense", "vehicle-expenses"].includes(activeTab) && (
          <ExpensesModule />
        )}

        {/* Fuel Management View */}
        {["fuel-management", "fuelmanagement", "fuel"].includes(activeTab) && (
          <FuelManagement />
        )}

        {/* Fallback View for any unmapped tabs */}
        {![
          "dashboard",
          "live-track",
          "history",
          "reports",
          "settings",
          "alarms",
          "alarm-settings",
          "geofences",
          "sub-user-list",
          "sub-users",
          "subuserlist",
          "vehicle-list",
          "vehicles",
          "vehiclelist",
          "paper-information",
          "paperinformation",
          "papers",
          "paper-info",
          "vehicle-maintenance",
          "vehiclemaintenance",
          "maintenance",
          "expenses",
          "expense",
          "vehicle-expenses",
          "fuel-management",
          "fuelmanagement",
          "fuel",
        ].includes(activeTab) && (
          <div className="p-8">
            <h1 className="text-xl font-bold text-gray-800 capitalize">
              {activeTab ? activeTab.replace("-", " ") : "Dashboard"} View
            </h1>
          </div>
        )}
      </main>
    </div>
  );
}
