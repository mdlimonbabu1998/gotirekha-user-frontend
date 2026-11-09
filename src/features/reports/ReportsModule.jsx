import {
  Calendar,
  Download,
  FileSpreadsheet,
  FileText,
  Search,
  Truck,
} from "lucide-react";
import { useState } from "react";

export default function ReportsModule() {
  // Form filter states
  const [selectedVehicle, setSelectedVehicle] = useState("v1");
  const [reportType, setReportType] = useState("trip"); // 'trip' | 'distance' | 'engine'
  const [startDate, setStartDate] = useState("2026-10-18T00:00");
  const [endDate, setEndDate] = useState("2026-10-18T23:59");
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportData, setReportData] = useState(null);

  // Mock vehicle list
  const vehicles = [
    { id: "v1", name: "DHAKA-METRO-G-11-2233" },
    { id: "v2", name: "DHAKA-METRO-HA-15-9012" },
    { id: "v3", name: "CHATTO-METRO-KA-09-4455" },
  ];

  // Handler to simulate generating report data
  const handleGenerateReport = (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setTimeout(() => {
      setReportData({
        vehicleName:
          vehicles.find((v) => v.id === selectedVehicle)?.name ||
          "DHAKA-METRO-G-11-2233",
        generatedAt: new Date().toLocaleString(),
        totalDistance: "89.62 KM",
        totalDuration: "4 hrs 12 mins",
        maxSpeed: "68 KM/H",
        idleTime: "35 mins",
        engineOnCount: "6 Times",
        trips: [
          {
            id: 1,
            startLocation: "Uttara Sector 7, Dhaka",
            endLocation: "Gulshan-2, Dhaka",
            startTime: "09:00 AM",
            endTime: "09:45 AM",
            distance: "12.4 KM",
            maxSpeed: "55 KM/H",
            status: "Completed",
          },
          {
            id: 2,
            startLocation: "Gulshan-2, Dhaka",
            endLocation: "Motijheel C/A, Dhaka",
            startTime: "10:30 AM",
            endTime: "11:20 AM",
            distance: "18.1 KM",
            maxSpeed: "68 KM/H",
            status: "Completed",
          },
          {
            id: 3,
            startLocation: "Motijheel C/A, Dhaka",
            endLocation: "Banani Chairman Bari",
            startTime: "02:00 PM",
            endTime: "02:50 PM",
            distance: "15.3 KM",
            maxSpeed: "60 KM/H",
            status: "Completed",
          },
          {
            id: 4,
            startLocation: "Banani Chairman Bari",
            endLocation: "Uttara Sector 7, Dhaka",
            startTime: "04:10 PM",
            endTime: "05:00 PM",
            distance: "13.8 KM",
            maxSpeed: "52 KM/H",
            status: "Completed",
          },
        ],
        stops: [
          {
            location: "Gulshan-2 (Client Office)",
            arrival: "09:45 AM",
            departure: "10:30 AM",
            duration: "45 mins",
            engine: "OFF",
          },
          {
            location: "Motijheel (Bank Branch)",
            arrival: "11:20 AM",
            departure: "02:00 PM",
            duration: "2 hrs 40 mins",
            engine: "OFF",
          },
          {
            location: "Banani (Warehouse)",
            arrival: "02:50 PM",
            departure: "04:10 PM",
            duration: "1 hr 20 mins",
            engine: "IDLE",
          },
        ],
      });
      setIsGenerating(false);
    }, 600);
  };

  return (
    <div className="flex flex-col h-full w-full bg-gray-50 overflow-y-auto font-sans p-8 space-y-6">
      {/* Header & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
            <FileText className="text-blue-600" size={24} />
            <span>Advanced Fleet Reports Module</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Generate granular travel distance, trip logs, route-with-stops, and
            engine status analytics.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            disabled={!reportData}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              reportData
                ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            <FileSpreadsheet size={16} />
            <span>Export Excel</span>
          </button>
          <button
            disabled={!reportData}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              reportData
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Download size={16} />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Filter Configuration Panel */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <form
          onSubmit={handleGenerateReport}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
        >
          {/* Vehicle Select */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-bold text-gray-500 flex items-center space-x-1">
              <Truck size={14} className="text-blue-600" />
              <span>SELECT VEHICLE</span>
            </label>
            <select
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>

          {/* Report Type */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-bold text-gray-500 flex items-center space-x-1">
              <FileText size={14} className="text-blue-600" />
              <span>REPORT TYPE</span>
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="trip">Trip & Route Summary</option>
              <option value="distance">Travel Distance Report</option>
              <option value="engine">Engine & Idle Status</option>
            </select>
          </div>

          {/* Date Ranges */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-bold text-gray-500 flex items-center space-x-1">
              <Calendar size={14} className="text-blue-600" />
              <span>START & END DATES</span>
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-2 py-2 text-xs bg-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center space-x-2 transition-all shadow-sm"
            >
              {isGenerating ? (
                <span className="animate-pulse">Generating...</span>
              ) : (
                <>
                  <Search size={16} />
                  <span>Run Report</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Report Results Section */}
      {reportData ? (
        <div className="space-y-6">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <span className="text-[11px] font-bold text-gray-400 uppercase">
                Total Distance
              </span>
              <p className="text-2xl font-black text-blue-600 mt-1">
                {reportData.totalDistance}
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <span className="text-[11px] font-bold text-gray-400 uppercase">
                Trip Duration
              </span>
              <p className="text-2xl font-black text-emerald-600 mt-1">
                {reportData.totalDuration}
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <span className="text-[11px] font-bold text-gray-400 uppercase">
                Max Speed Recorded
              </span>
              <p className="text-2xl font-black text-amber-500 mt-1">
                {reportData.maxSpeed}
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <span className="text-[11px] font-bold text-gray-400 uppercase">
                Engine Idle Time
              </span>
              <p className="text-2xl font-black text-purple-600 mt-1">
                {reportData.idleTime}
              </p>
            </div>
          </div>

          {/* Detailed Trip Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="font-bold text-gray-800 text-sm">
                  Trip Details & Route Segments
                </h3>
                <p className="text-xs text-gray-400">
                  {reportData.vehicleName} • Generated at{" "}
                  {reportData.generatedAt}
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-100">
                {reportData.trips.length} Trips Recorded
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-[11px] font-bold text-gray-500 uppercase">
                    <th className="px-6 py-3">#</th>
                    <th className="px-6 py-3">Start Location</th>
                    <th className="px-6 py-3">End Location</th>
                    <th className="px-6 py-3">Time Window</th>
                    <th className="px-6 py-3">Distance</th>
                    <th className="px-6 py-3">Max Speed</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-xs text-gray-700">
                  {reportData.trips.map((trip) => (
                    <tr
                      key={trip.id}
                      className="hover:bg-gray-50/80 transition-colors"
                    >
                      <td className="px-6 py-3 font-semibold text-gray-900">
                        0{trip.id}
                      </td>
                      <td className="px-6 py-3 font-medium text-gray-800">
                        {trip.startLocation}
                      </td>
                      <td className="px-6 py-3 font-medium text-gray-800">
                        {trip.endLocation}
                      </td>
                      <td className="px-6 py-3 text-gray-500">
                        {trip.startTime} - {trip.endTime}
                      </td>
                      <td className="px-6 py-3 font-bold text-blue-600">
                        {trip.distance}
                      </td>
                      <td className="px-6 py-3 font-semibold text-emerald-600">
                        {trip.maxSpeed}
                      </td>
                      <td className="px-6 py-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                          {trip.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Stops & Idle Locations Summary */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
              <h3 className="font-bold text-gray-800 text-sm">
                Stops & Parking Log
              </h3>
              <p className="text-xs text-gray-400">
                Locations where the vehicle stopped or idled for more than 5
                minutes
              </p>
            </div>

            <div className="divide-y divide-gray-200">
              {reportData.stops.map((stop, idx) => (
                <div
                  key={idx}
                  className="px-6 py-4 flex items-center justify-between text-xs hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-sm">
                        {stop.location}
                      </p>
                      <p className="text-gray-400 mt-0.5">
                        Arrival: {stop.arrival} | Departure: {stop.departure}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="font-bold text-gray-700">
                      Duration: {stop.duration}
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${stop.engine === "OFF" ? "bg-red-50 text-red-600 border border-red-100" : "bg-amber-50 text-amber-600 border border-amber-100"}`}
                    >
                      ENGINE {stop.engine}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-16 text-center space-y-3 shadow-sm">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
            <FileText size={24} />
          </div>
          <h3 className="font-bold text-gray-800 text-base">
            No Report Generated Yet
          </h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            Select a target vehicle, specify your desired date range, and click
            **Run Report** above to compile travel distances, trip logs, and
            engine status analytics.
          </p>
        </div>
      )}
    </div>
  );
}
