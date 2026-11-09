import {
  Calendar,
  ChevronRight,
  Eye,
  Gauge,
  MapPin,
  Power,
  User,
} from "lucide-react";
import { useState } from "react";

export default function AlarmsHistory() {
  const [alarms] = useState([
    {
      id: 1,
      type: "engine_off",
      message: "DM-GA-16-1604 FIELDER 1 has turned off it's engine.",
      vehicleName: "DM-GA-16-1604 FIELDER 1",
      dateTime: "6:34 PM, November 4 2026",
      severity: "Low",
    },
    {
      id: 2,
      type: "engine_on",
      message: "DM-GA-16-1604 FIELDER 1 has turned on it's engine.",
      vehicleName: "DM-GA-16-1604 FIELDER 1",
      dateTime: "6:24 PM, November 4 2026",
      severity: "Low",
    },
    {
      id: 3,
      type: "engine_off",
      message: "DM-GA-16-1604 FIELDER 1 has turned off it's engine.",
      vehicleName: "DM-GA-16-1604 FIELDER 1",
      dateTime: "6:22 PM, November 4 2026",
      severity: "Low",
    },
    {
      id: 4,
      type: "engine_off",
      message: "DM-GHA-18-2265 HRV has turned off it's engine.",
      vehicleName: "DM-GHA-18-2265 HRV",
      dateTime: "6:21 PM, November 4 2026",
      severity: "Low",
    },
    {
      id: 5,
      type: "overspeed",
      message: "DM-GHA-18-2265 HRV has crossed 82.00 Km/h",
      vehicleName: "DM-GHA-18-2265 HRV",
      dateTime: "6:11 PM, November 4 2026",
      severity: "High",
    },
  ]);

  const [alarmTypeFilter, setAlarmTypeFilter] = useState("Engine On/Off");
  const [severityFilter, setSeverityFilter] = useState("All Severity");
  const [vehicleFilter, setVehicleFilter] = useState("All Vehicles");

  return (
    <div className="flex flex-col h-full w-full bg-gray-100 overflow-y-auto font-sans p-6 space-y-6">
      <h1 className="text-xl font-bold text-gray-800">Alarms</h1>

      {/* TOP FILTER BAR */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center">
        <div className="flex flex-col space-y-1">
          <label className="text-[11px] font-semibold text-gray-400">
            Alarm Type
          </label>
          <select
            value={alarmTypeFilter}
            onChange={(e) => setAlarmTypeFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-xs font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Engine On/Off">Engine On/Off</option>
            <option value="Overspeed">Overspeed</option>
            <option value="Geofence">Geofence</option>
          </select>
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-[11px] font-semibold text-gray-400">
            Alarm Severity
          </label>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-xs font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All Severity">All Severity</option>
            <option value="Low">Low</option>
            <option value="High">High</option>
          </select>
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-[11px] font-semibold text-gray-400">
            Vehicles
          </label>
          <select
            value={vehicleFilter}
            onChange={(e) => setVehicleFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-xs font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All Vehicles">All Vehicles</option>
            <option value="DM-GA-16-1604 FIELDER 1">
              DM-GA-16-1604 FIELDER 1
            </option>
          </select>
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-[11px] font-semibold text-gray-400">
            From Date & Time
          </label>
          <div className="relative">
            <input
              type="text"
              readOnly
              value="04/11/2026 12:00 AM"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs font-medium text-gray-700 bg-white focus:outline-none"
            />
            <Calendar
              size={14}
              className="absolute right-3 top-3 text-gray-400 pointer-events-none"
            />
          </div>
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-[11px] font-semibold text-gray-400">
            To Date & Time
          </label>
          <div className="relative">
            <input
              type="text"
              readOnly
              value="04/11/2026 06:44 PM"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs font-medium text-gray-700 bg-white focus:outline-none"
            />
            <Calendar
              size={14}
              className="absolute right-3 top-3 text-gray-400 pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* ALARM LOGS TABLE */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="text-gray-400 border-b border-gray-200 font-semibold text-[11px] bg-gray-50/50">
                <th className="py-3 px-4 w-1/2">Alarm</th>
                <th className="py-3 px-4 w-1/4">Name</th>
                <th className="py-3 px-4 w-1/5">Date & Time</th>
                <th className="py-3 px-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {alarms.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50/80 transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                          item.type === "overspeed"
                            ? "bg-red-100 text-red-600"
                            : "bg-emerald-100 text-emerald-600"
                        }`}
                      >
                        {item.type === "overspeed" ? (
                          <Gauge size={14} />
                        ) : (
                          <Power size={14} />
                        )}
                      </div>
                      <span className="font-semibold text-gray-800 text-xs">
                        {item.message}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-gray-700">
                    {item.vehicleName}
                  </td>
                  <td className="py-3.5 px-4 text-gray-500 font-medium">
                    {item.dateTime}
                  </td>
                  <td className="py-3.5 px-4 text-right pr-6">
                    <div className="flex items-center justify-end space-x-3 text-gray-400">
                      <button
                        onClick={() => alert(`Viewing: ${item.message}`)}
                        className="hover:text-blue-600 transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => alert(`Locating: ${item.vehicleName}`)}
                        className="hover:text-blue-600 transition-colors"
                        title="Locate on Map"
                      >
                        <MapPin size={16} />
                      </button>
                      <button
                        onClick={() =>
                          alert(`Driver Info for: ${item.vehicleName}`)
                        }
                        className="hover:text-blue-600 transition-colors"
                        title="Driver Info"
                      >
                        <User size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div>Showing 1-5, from 73 entries.</div>
          <div className="flex items-center space-x-1">
            <select className="border border-gray-300 rounded-lg px-2 py-1 text-xs bg-white text-gray-700 mr-4 focus:outline-none">
              <option value="10">10</option>
            </select>
            <button className="w-8 h-8 rounded-lg font-bold flex items-center justify-center bg-orange-500 text-white shadow-sm">
              1
            </button>
            <button className="w-8 h-8 rounded-lg font-bold flex items-center justify-center bg-white border border-gray-300 text-gray-700 hover:bg-gray-100">
              2
            </button>
            <button className="w-8 h-8 rounded-lg font-bold flex items-center justify-center bg-white border border-gray-300 text-gray-700 hover:bg-gray-100">
              3
            </button>
            <button className="w-8 h-8 rounded-lg font-bold flex items-center justify-center bg-white border border-gray-300 text-gray-700 hover:bg-gray-100">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
