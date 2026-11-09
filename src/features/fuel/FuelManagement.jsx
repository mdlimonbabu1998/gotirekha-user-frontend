import {
  Calendar,
  ChevronDown,
  Fuel,
  Plus,
  Search,
  Tag,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function FuelManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [fuelTypeFilter, setFuelTypeFilter] = useState("all");
  const [vehicleFilter, setVehicleFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // List of vehicles associated with the logged-in account
  const [accountVehicles] = useState([
    { id: 1, name: "Toyota Hiace", plate: "DHK-11-2344" },
    { id: 2, name: "Tata Pickup", plate: "CTG-12-9812" },
    { id: 3, name: "Mitsubishi Canter", plate: "SYL-22-4411" },
    { id: 4, name: "Hino Truck 3-Ton", plate: "RAJ-31-5567" },
  ]);

  // Custom Dropdown State for Vehicle Selection inside Modal
  const [isVehicleDropdownOpen, setIsVehicleDropdownOpen] = useState(false);
  const [vehicleSearchQuery, setVehicleSearchQuery] = useState("");
  const vehicleDropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        vehicleDropdownRef.current &&
        !vehicleDropdownRef.current.contains(event.target)
      ) {
        setIsVehicleDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // State for managing Fuel Type options
  const [fuelTypes, setFuelTypes] = useState([
    "Octane",
    "Diesel",
    "Petrol",
    "CNG",
    "LPG",
  ]);
  const [isAddTypeModalOpen, setIsAddTypeModalOpen] = useState(false);
  const [customFuelType, setCustomFuelType] = useState("");

  // Sample vehicle fuel management dataset
  const [fuelList, setFuelList] = useState([
    {
      id: 1,
      vehicleName: "Toyota Hiace",
      plateNumber: "DHK-11-2344",
      fuelType: "Octane",
      liters: 45.0,
      pricePerLiter: 130,
      cost: 5850,
      station: "City Filling Station, Dhaka",
      date: "2026-10-22",
      recordedBy: "Md. Limon Babu",
    },
    {
      id: 2,
      vehicleName: "Tata Pickup",
      plateNumber: "CTG-12-9812",
      fuelType: "Diesel",
      liters: 60.0,
      pricePerLiter: 108,
      cost: 6480,
      station: "Padma Oil Pump, Chittagong",
      date: "2026-10-21",
      recordedBy: "Karim Mia",
    },
    {
      id: 3,
      vehicleName: "Mitsubishi Canter",
      plateNumber: "SYL-22-4411",
      fuelType: "Diesel",
      liters: 80.0,
      pricePerLiter: 108,
      cost: 8640,
      station: "Meghna Petroleum, Sylhet",
      date: "2026-10-20",
      recordedBy: "Tanvir Ahmed",
    },
    {
      id: 4,
      vehicleName: "Hino Truck 3-Ton",
      plateNumber: "RAJ-31-5567",
      fuelType: "Diesel",
      liters: 120.0,
      pricePerLiter: 108,
      cost: 12960,
      station: "Jamuna Oil Hub, Rajshahi",
      date: "2026-10-18",
      recordedBy: "Rahim Uddin",
    },
  ]);

  // Form state for adding new fuel record
  const [newFuel, setNewFuel] = useState({
    vehicleName: "Toyota Hiace",
    plateNumber: "DHK-11-2344",
    fuelType: "Octane",
    liters: "",
    pricePerLiter: "",
    station: "",
    date: "",
    recordedBy: "Md. Limon Babu",
  });

  // Auto-calculated Total Cost
  const calculatedTotalCost =
    (parseFloat(newFuel.liters) || 0) *
    (parseFloat(newFuel.pricePerLiter) || 0);

  // Extract unique vehicles list for the vehicle filter dropdown
  const uniqueVehicles = Array.from(
    new Set(fuelList.map((f) => f.vehicleName)),
  );

  // Filter vehicles inside the modal dropdown search
  const filteredModalVehicles = accountVehicles.filter(
    (v) =>
      v.name.toLowerCase().includes(vehicleSearchQuery.toLowerCase()) ||
      v.plate.toLowerCase().includes(vehicleSearchQuery.toLowerCase()),
  );

  // Handle adding new custom fuel type
  const handleAddCustomFuelType = (e) => {
    e.preventDefault();
    if (customFuelType.trim() && !fuelTypes.includes(customFuelType.trim())) {
      const updatedTypes = [...fuelTypes, customFuelType.trim()];
      setFuelTypes(updatedTypes);
      setNewFuel({ ...newFuel, fuelType: customFuelType.trim() });
      setCustomFuelType("");
      setIsAddTypeModalOpen(false);
    }
  };

  // Handle adding new fuel log record
  const handleAddFuel = (e) => {
    e.preventDefault();
    const createdRecord = {
      id: fuelList.length + 1,
      vehicleName: newFuel.vehicleName,
      plateNumber: newFuel.plateNumber,
      fuelType: newFuel.fuelType,
      liters: parseFloat(newFuel.liters) || 0,
      pricePerLiter: parseFloat(newFuel.pricePerLiter) || 0,
      cost: calculatedTotalCost,
      station: newFuel.station,
      date: newFuel.date,
      recordedBy: newFuel.recordedBy,
    };
    setFuelList([createdRecord, ...fuelList]);
    setIsAddModalOpen(false);
    setNewFuel({
      vehicleName: "Toyota Hiace",
      plateNumber: "DHK-11-2344",
      fuelType: fuelTypes[0] || "Octane",
      liters: "",
      pricePerLiter: "",
      station: "",
      date: "",
      recordedBy: "Md. Limon Babu",
    });
  };

  // Filter fuel logs based on search input, fuel type, vehicle, and date range
  const filteredFuelList = fuelList.filter((f) => {
    const matchesSearch =
      f.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.station.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.recordedBy.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFuelType =
      fuelTypeFilter === "all" ||
      f.fuelType.toLowerCase() === fuelTypeFilter.toLowerCase();
    const matchesVehicle =
      vehicleFilter === "all" || f.vehicleName === vehicleFilter;

    // Date range filter logic
    let matchesDate = true;
    if (startDate && f.date < startDate) matchesDate = false;
    if (endDate && f.date > endDate) matchesDate = false;

    return matchesSearch && matchesFuelType && matchesVehicle && matchesDate;
  });

  // Calculate totals based on filtered records
  const totalFuelCost = filteredFuelList.reduce(
    (acc, curr) => acc + (curr.cost || 0),
    0,
  );
  const totalLiters = filteredFuelList.reduce(
    (acc, curr) => acc + (curr.liters || 0),
    0,
  );

  return (
    <div className="flex-1 p-6 bg-gray-50 overflow-y-auto h-full w-full space-y-6">
      {/* Header Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Fuel Management</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Monitor fuel consumption, price per liter, station refills, and
            expenditure.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-2"
        >
          <Plus size={16} /> Add Fuel Log
        </button>
      </div>

      {/* Overview Summary Widget Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">
              TOTAL FUEL EXPENDITURE
            </div>
            <div className="text-2xl font-bold text-blue-600 mt-1">
              {totalFuelCost.toLocaleString()} BDT
            </div>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center w-11 h-11">
            <span className="text-xl font-extrabold leading-none">৳</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">
              TOTAL FUEL CONSUMED
            </div>
            <div className="text-2xl font-bold text-gray-800 mt-1">
              {totalLiters.toFixed(1)} Liters
            </div>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Fuel size={22} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">
              TOTAL REFILL LOGS
            </div>
            <div className="text-2xl font-bold text-amber-600 mt-1">
              {filteredFuelList.length} Entries
            </div>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Tag size={22} />
          </div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search station, recorder..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Filters Group: Vehicle, Fuel Type, Start Date, End Date */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Vehicle Filter */}
          <select
            value={vehicleFilter}
            onChange={(e) => setVehicleFilter(e.target.value)}
            className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:border-blue-500 flex-1 sm:flex-none"
          >
            <option value="all">All Vehicles</option>
            {uniqueVehicles.map((vName, idx) => (
              <option key={idx} value={vName}>
                {vName}
              </option>
            ))}
          </select>

          {/* Fuel Type Filter */}
          <select
            value={fuelTypeFilter}
            onChange={(e) => setFuelTypeFilter(e.target.value)}
            className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:border-blue-500 flex-1 sm:flex-none"
          >
            <option value="all">All Fuel Types</option>
            {fuelTypes.map((type, idx) => (
              <option key={idx} value={type.toLowerCase()}>
                {type}
              </option>
            ))}
          </select>

          {/* Date From Filter */}
          <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5">
            <Calendar size={14} className="text-gray-400" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="text-xs bg-transparent focus:outline-none text-gray-700"
            />
          </div>

          <span className="text-xs text-gray-400">to</span>

          {/* Date To Filter */}
          <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5">
            <Calendar size={14} className="text-gray-400" />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="text-xs bg-transparent focus:outline-none text-gray-700"
            />
          </div>

          {/* Reset Filters Button */}
          {(searchTerm ||
            fuelTypeFilter !== "all" ||
            vehicleFilter !== "all" ||
            startDate ||
            endDate) && (
            <button
              onClick={() => {
                setSearchTerm("");
                setFuelTypeFilter("all");
                setVehicleFilter("all");
                setStartDate("");
                setEndDate("");
              }}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold px-2 py-1"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Fuel Management Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-[11px] font-bold text-gray-500 bg-gray-50/50">
                <th className="py-3 px-4">Vehicle Details</th>
                <th className="py-3 px-4">Fuel Type</th>
                <th className="py-3 px-4">Liters</th>
                <th className="py-3 px-4">Fuel Price (BDT/L)</th>
                <th className="py-3 px-4">Filling Station</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Total Cost</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
              {filteredFuelList.length > 0 ? (
                filteredFuelList.map((f) => (
                  <tr key={f.id} className="hover:bg-gray-50/80 transition-all">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-gray-800">
                        {f.vehicleName}
                      </div>
                      <div className="text-[11px] text-blue-600 font-mono mt-0.5">
                        {f.plateNumber}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 inline-flex items-center gap-1">
                        {f.fuelType}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-gray-800">
                      {f.liters} L
                    </td>
                    <td className="py-3 px-4 font-mono text-emerald-600 font-semibold">
                      ৳{f.pricePerLiter} / L
                    </td>
                    <td className="py-3 px-4 text-gray-600 max-w-xs truncate">
                      {f.station}
                    </td>
                    <td className="py-3 px-4 text-gray-600 font-mono">
                      {f.date}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-gray-800">
                      {f.cost.toLocaleString()} BDT
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() =>
                          alert(
                            `Viewing fuel log receipt for ${f.vehicleName} (${f.liters} L)`,
                          )
                        }
                        className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-[11px] font-semibold transition-all"
                      >
                        Receipt
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-gray-400">
                    No fuel log records found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Fuel Log Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-800">
                Add Fuel Log Record
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddFuel} className="space-y-4">
              {/* Vehicle Name & Plate Dropdown with Search */}
              <div className="relative" ref={vehicleDropdownRef}>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Vehicle Name & Plate
                </label>
                <div
                  onClick={() =>
                    setIsVehicleDropdownOpen(!isVehicleDropdownOpen)
                  }
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg cursor-pointer flex items-center justify-between text-gray-800 font-medium"
                >
                  <span>
                    {newFuel.vehicleName
                      ? `${newFuel.vehicleName} (${newFuel.plateNumber})`
                      : "Select vehicle..."}
                  </span>
                  <ChevronDown size={14} className="text-gray-400" />
                </div>

                {isVehicleDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-2 space-y-2">
                    {/* Search Box inside Dropdown */}
                    <div className="relative">
                      <Search
                        className="absolute left-2.5 top-2 text-gray-400"
                        size={14}
                      />
                      <input
                        type="text"
                        placeholder="Search vehicle..."
                        value={vehicleSearchQuery}
                        onChange={(e) => setVehicleSearchQuery(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-blue-500"
                        autoFocus
                      />
                    </div>

                    {/* Vehicle List */}
                    <div className="max-h-40 overflow-y-auto space-y-1">
                      {filteredModalVehicles.length > 0 ? (
                        filteredModalVehicles.map((v) => (
                          <div
                            key={v.id}
                            onClick={() => {
                              setNewFuel({
                                ...newFuel,
                                vehicleName: v.name,
                                plateNumber: v.plate,
                              });
                              setIsVehicleDropdownOpen(false);
                              setVehicleSearchQuery("");
                            }}
                            className="px-3 py-2 text-xs hover:bg-blue-50 hover:text-blue-600 rounded-md cursor-pointer flex items-center justify-between"
                          >
                            <span className="font-semibold">{v.name}</span>
                            <span className="text-[11px] text-gray-400 font-mono">
                              {v.plate}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="py-3 text-center text-xs text-gray-400">
                          No vehicles found.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-gray-700">
                      Fuel Type
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsAddTypeModalOpen(true)}
                      className="text-[11px] text-blue-600 font-bold hover:text-blue-700 flex items-center gap-0.5"
                    >
                      <Plus size={12} /> Add
                    </button>
                  </div>
                  <select
                    value={newFuel.fuelType}
                    onChange={(e) =>
                      setNewFuel({ ...newFuel, fuelType: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    {fuelTypes.map((type, idx) => (
                      <option key={idx} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Liters Filled
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="e.g. 45.0"
                    value={newFuel.liters}
                    onChange={(e) =>
                      setNewFuel({ ...newFuel, liters: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Fuel Price (per Liter in BDT)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="e.g. 130"
                    value={newFuel.pricePerLiter}
                    onChange={(e) =>
                      setNewFuel({ ...newFuel, pricePerLiter: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Total Cost (BDT)
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={
                      calculatedTotalCost
                        ? `${calculatedTotalCost.toLocaleString()} BDT`
                        : "0 BDT"
                    }
                    className="w-full px-3 py-2 text-xs bg-gray-100 border border-gray-200 rounded-lg font-bold text-blue-600 focus:outline-none cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Filling Station Name & Location
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. City Filling Station, Dhaka"
                  value={newFuel.station}
                  onChange={(e) =>
                    setNewFuel({ ...newFuel, station: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Refill Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newFuel.date}
                    onChange={(e) =>
                      setNewFuel({ ...newFuel, date: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Recorded By
                  </label>
                  <input
                    type="text"
                    required
                    value={newFuel.recordedBy}
                    onChange={(e) =>
                      setNewFuel({ ...newFuel, recordedBy: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-all"
                >
                  Save Fuel Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Custom Fuel Type Nested Modal */}
      {isAddTypeModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h4 className="text-sm font-bold text-gray-800">
                Add New Fuel Type
              </h4>
              <button
                onClick={() => setIsAddTypeModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleAddCustomFuelType} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Fuel Type Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Electric / Bio-Diesel"
                  value={customFuelType}
                  onChange={(e) => setCustomFuelType(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddTypeModalOpen(false)}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg"
                >
                  Add Type
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
