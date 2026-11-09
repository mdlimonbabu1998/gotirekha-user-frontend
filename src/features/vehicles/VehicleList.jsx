import {
  Battery,
  Filter,
  MapPin,
  MoreVertical,
  Navigation,
  Search,
  Truck,
} from "lucide-react";
import { useState } from "react";

export default function VehicleList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Sample vehicle data aligned with your fleet management requirements
  const [vehicles] = useState([
    {
      id: 1,
      name: "Toyota Hiace",
      plateNumber: "DHK-11-2344",
      deviceImei: "358902081234567",
      driverName: "Rahim Uddin",
      driverPhone: "+880 1819-445566",
      status: "Running",
      speed: "55 km/h",
      location: "Gulshan-2, Dhaka",
      fuelLevel: "78%",
      lastUpdate: "Just now",
    },
    {
      id: 2,
      name: "Tata Pickup",
      plateNumber: "CTG-12-9812",
      deviceImei: "358902089876543",
      driverName: "Karim Mia",
      driverPhone: "+880 1711-297914",
      status: "Idle",
      speed: "0 km/h",
      location: "Agrabad, Chattogram",
      fuelLevel: "45%",
      lastUpdate: "2 mins ago",
    },
    {
      id: 3,
      name: "Mitsubishi Canter",
      plateNumber: "SYL-22-4411",
      deviceImei: "358902084567891",
      driverName: "Tanvir Ahmed",
      driverPhone: "+880 1922-334455",
      status: "Offline",
      speed: "-",
      location: "Sylhet Bypass",
      fuelLevel: "12%",
      lastUpdate: "2 hours ago",
    },
    {
      id: 4,
      name: "Hino Truck 3-Ton",
      plateNumber: "RAJ-31-5567",
      deviceImei: "358902087654321",
      driverName: "Selim Hossain",
      driverPhone: "+880 1552-889900",
      status: "Running",
      speed: "62 km/h",
      location: "Bonpara Highway, Rajshahi",
      fuelLevel: "90%",
      lastUpdate: "1 min ago",
    },
  ]);

  // Filter vehicles based on search input and status filter dropdown
  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.driverName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      v.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex-1 p-6 bg-gray-50 overflow-y-auto h-full w-full space-y-6">
      {/* Header Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Vehicle List</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Monitor all registered fleet units, live telemetry statuses, and
            driver assignments.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-2">
            <Truck size={15} /> Add New Vehicle
          </button>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search vehicle, plate, or driver..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={15} className="text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="running">Running</option>
            <option value="idle">Idle</option>
            <option value="offline">Offline</option>
          </select>
        </div>
      </div>

      {/* Vehicle Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-[11px] font-bold text-gray-500 bg-gray-50/50">
                <th className="py-3 px-4">Vehicle Details</th>
                <th className="py-3 px-4">Driver Info</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Current Location & Speed</th>
                <th className="py-3 px-4">Fuel</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
              {filteredVehicles.length > 0 ? (
                filteredVehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50/80 transition-all">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-gray-800">
                        {v.name}
                      </div>
                      <div className="text-[11px] text-blue-600 font-mono mt-0.5">
                        {v.plateNumber}
                      </div>
                      <div className="text-[10px] text-gray-400 font-mono">
                        IMEI: {v.deviceImei}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-800">
                        {v.driverName}
                      </div>
                      <div className="text-[11px] text-gray-500 mt-0.5">
                        {v.driverPhone}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                          v.status === "Running"
                            ? "bg-emerald-50 text-emerald-600"
                            : v.status === "Idle"
                              ? "bg-amber-50 text-amber-600"
                              : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            v.status === "Running"
                              ? "bg-emerald-500"
                              : v.status === "Idle"
                                ? "bg-amber-500"
                                : "bg-gray-400"
                          }`}
                        ></span>
                        {v.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 text-gray-800 font-medium">
                        <MapPin
                          size={13}
                          className="text-gray-400 flex-shrink-0"
                        />
                        <span className="truncate max-w-[200px]">
                          {v.location}
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-500 font-mono mt-0.5">
                        Speed: {v.speed}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 font-medium text-gray-700">
                        <Battery size={14} className="text-blue-500" />
                        <span>{v.fuelLevel}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          title="Track Live"
                          className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-all"
                        >
                          <Navigation size={14} />
                        </button>
                        <button
                          title="Options"
                          className="p-1.5 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                        >
                          <MoreVertical size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-400">
                    No vehicles found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
