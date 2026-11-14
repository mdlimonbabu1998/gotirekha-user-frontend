import {
  ChevronRight,
  Eye,
  Gauge,
  MapPin,
  Power,
  Search,
  User,
} from "lucide-react";
import { useState } from "react";

const toLocalDateTimeValue = (date) => {
  const pad = (value) => String(value).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export default function AlarmsHistory() {
  const [alarms] = useState([
    {
      id: 1,
      type: "engine_off",
      message: "DM-GA-16-1604 FIELDER 1 has turned off it's engine.",
      vehicleName: "DM-GA-16-1604 FIELDER 1",
      dateTime: "6:34 PM, November 4 2026",
      timestamp: "2026-11-04T18:34",
      severity: "Low",
    },
    {
      id: 2,
      type: "engine_on",
      message: "DM-GA-16-1604 FIELDER 1 has turned on it's engine.",
      vehicleName: "DM-GA-16-1604 FIELDER 1",
      dateTime: "6:24 PM, November 4 2026",
      timestamp: "2026-11-04T18:24",
      severity: "Low",
    },
    {
      id: 3,
      type: "engine_off",
      message: "DM-GA-16-1604 FIELDER 1 has turned off it's engine.",
      vehicleName: "DM-GA-16-1604 FIELDER 1",
      dateTime: "6:22 PM, November 4 2026",
      timestamp: "2026-11-04T18:22",
      severity: "Low",
    },
    {
      id: 4,
      type: "engine_off",
      message: "DM-GHA-18-2265 HRV has turned off it's engine.",
      vehicleName: "DM-GHA-18-2265 HRV",
      dateTime: "6:21 PM, November 4 2026",
      timestamp: "2026-11-04T18:21",
      severity: "Low",
    },
    {
      id: 5,
      type: "overspeed",
      message: "DM-GHA-18-2265 HRV has crossed 82.00 Km/h",
      vehicleName: "DM-GHA-18-2265 HRV",
      dateTime: "6:11 PM, November 4 2026",
      timestamp: "2026-11-04T18:11",
      severity: "High",
    },
  ]);

  const [alarmTypeFilter, setAlarmTypeFilter] = useState("Engine On/Off");
  const [vehicleFilter, setVehicleFilter] = useState("All Vehicles");
  const [initialDateRange] = useState(() => {
    const now = new Date();
    const ninetyDaysAgo = new Date(now);
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    return {
      minDate: toLocalDateTimeValue(ninetyDaysAgo),
      maxDate: toLocalDateTimeValue(now),
      fromDate: toLocalDateTimeValue(ninetyDaysAgo),
      toDate: toLocalDateTimeValue(now),
    };
  });
  const [fromDate, setFromDate] = useState(initialDateRange.fromDate);
  const [toDate, setToDate] = useState(initialDateRange.toDate);
  const [appliedFilters, setAppliedFilters] = useState({
    alarmType: "Engine On/Off",
    vehicle: "All Vehicles",
    fromDate: initialDateRange.fromDate,
    toDate: initialDateRange.toDate,
  });
  const [filterError, setFilterError] = useState("");

  const filteredAlarms = alarms.filter((alarm) => {
    const matchesAlarmType =
      appliedFilters.alarmType === "Engine On/Off"
        ? alarm.type === "engine_on" || alarm.type === "engine_off"
        : appliedFilters.alarmType === "Overspeed"
          ? alarm.type === "overspeed"
          : alarm.type === "geofence";
    const matchesVehicle =
      appliedFilters.vehicle === "All Vehicles" ||
      alarm.vehicleName === appliedFilters.vehicle;

    return (
      matchesAlarmType &&
      matchesVehicle &&
      alarm.timestamp >= appliedFilters.fromDate &&
      alarm.timestamp <= appliedFilters.toDate
    );
  });

  const searchAlarms = () => {
    if (!fromDate || !toDate) {
      setFilterError("Select both a start and end date and time.");
      return;
    }

    if (fromDate < initialDateRange.minDate || fromDate > initialDateRange.maxDate) {
      setFilterError("Start date must be within the last 90 days.");
      return;
    }

    if (toDate > initialDateRange.maxDate) {
      setFilterError("End date and time cannot be in the future.");
      return;
    }

    if (fromDate > toDate) {
      setFilterError("From date and time must be before To date and time.");
      return;
    }

    setFilterError("");
    setAppliedFilters({
      alarmType: alarmTypeFilter,
      vehicle: vehicleFilter,
      fromDate,
      toDate,
    });
  };

  return (
    <div className="flex flex-col h-full w-full bg-gray-100 overflow-y-auto font-sans p-6 space-y-6">
      <h1 className="text-xl font-bold text-gray-800">Alarms</h1>

      {/* TOP FILTER BAR */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
          <div className="flex w-full min-w-0 flex-col space-y-1 lg:col-span-2">
            <label className="text-center text-[11px] font-semibold text-gray-400">
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

          <div className="flex w-full min-w-0 flex-col space-y-1 lg:col-span-2">
            <label className="text-center text-[11px] font-semibold text-gray-400">
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
              <option value="DM-GHA-18-2265 HRV">DM-GHA-18-2265 HRV</option>
            </select>
          </div>

          <div className="flex w-full min-w-0 flex-col space-y-1 lg:col-span-3">
            <label className="text-center text-[11px] font-semibold text-gray-400">
              From Date & Time
            </label>
            <input
              type="datetime-local"
              step="60"
              min={initialDateRange.minDate}
              max={initialDateRange.maxDate}
              value={fromDate}
              onChange={(e) => {
                const nextFromDate = e.target.value;
                setFromDate(nextFromDate);
                if (nextFromDate > toDate) setToDate(nextFromDate);
                setFilterError("");
              }}
              className="w-full min-w-0 border border-gray-300 rounded-lg px-3 py-2 text-xs font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex w-full min-w-0 flex-col space-y-1 lg:col-span-3">
            <label className="text-center text-[11px] font-semibold text-gray-400">
              To Date & Time
            </label>
            <input
              type="datetime-local"
              step="60"
              min={fromDate}
              max={initialDateRange.maxDate}
              value={toDate}
              onChange={(e) => {
                setToDate(e.target.value);
                setFilterError("");
              }}
              className="w-full min-w-0 border border-gray-300 rounded-lg px-3 py-2 text-xs font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="button"
            onClick={searchAlarms}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:col-span-2 lg:col-span-2"
          >
            <Search size={14} />
            Search
          </button>
        </div>
          {filterError && (
            <p role="alert" className="mt-2 text-xs font-medium text-red-600">
              {filterError}
            </p>
          )}
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
              {filteredAlarms.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500">
                    No alarms found for the selected filters.
                  </td>
                </tr>
              ) : (
                filteredAlarms.map((item) => (
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
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div>
            {filteredAlarms.length > 0
              ? `Showing 1-${filteredAlarms.length} of ${filteredAlarms.length} alarms.`
              : "Showing 0 alarms."}
          </div>
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
