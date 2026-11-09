import {
  Calendar,
  ChevronDown,
  FileText,
  Plus,
  Search,
  Tag,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function ExpensesModule() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
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

  // State for managing Category options dynamically
  const [categories, setCategories] = useState([
    "Fuel",
    "Toll & Parking",
    "Repair & Parts",
    "Driver Allowance",
    "Maintenance",
  ]);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [customCategory, setCustomCategory] = useState("");

  // Sample vehicle expenses dataset
  const [expensesList, setExpensesList] = useState([
    {
      id: 1,
      vehicleName: "Toyota Hiace",
      plateNumber: "DHK-11-2344",
      category: "Fuel",
      unitQty: 35,
      unitPrice: 130,
      amount: 4550,
      date: "2026-10-21",
      description: "Octane refill at City Filling Station",
      recordedBy: "Md. Limon Babu",
    },
    {
      id: 2,
      vehicleName: "Tata Pickup",
      plateNumber: "CTG-12-9812",
      category: "Toll & Parking",
      unitQty: 1,
      unitPrice: 650,
      amount: 650,
      date: "2026-10-22",
      description: "Mayor Hanif Flyover & VIP Road parking",
      recordedBy: "Karim Mia",
    },
    {
      id: 3,
      vehicleName: "Mitsubishi Canter",
      plateNumber: "SYL-22-4411",
      category: "Repair & Parts",
      unitQty: 2,
      unitPrice: 1400,
      amount: 2800,
      date: "2026-10-20",
      description: "Headlight bulb replacement and wiper change",
      recordedBy: "Tanvir Ahmed",
    },
    {
      id: 4,
      vehicleName: "Hino Truck 3-Ton",
      plateNumber: "RAJ-31-5567",
      category: "Driver Allowance",
      unitQty: 1,
      unitPrice: 1500,
      amount: 1500,
      date: "2026-10-19",
      description: "Inter-district haul food & overnight allowance",
      recordedBy: "Rahim Uddin",
    },
  ]);

  // Form state for adding new expense record
  const [newExpense, setNewExpense] = useState({
    vehicleName: "Toyota Hiace",
    plateNumber: "DHK-11-2344",
    category: "Fuel",
    unitQty: "",
    unitPrice: "",
    date: "",
    description: "",
    recordedBy: "Md. Limon Babu",
  });

  // Auto-calculated Total Amount (BDT)
  const calculatedTotalAmount =
    (parseFloat(newExpense.unitQty) || 0) *
    (parseFloat(newExpense.unitPrice) || 0);

  // Extract unique vehicles list for the main table filter dropdown
  const uniqueVehicles = Array.from(
    new Set(expensesList.map((e) => e.vehicleName)),
  );

  // Filter vehicles inside the modal dropdown search
  const filteredModalVehicles = accountVehicles.filter(
    (v) =>
      v.name.toLowerCase().includes(vehicleSearchQuery.toLowerCase()) ||
      v.plate.toLowerCase().includes(vehicleSearchQuery.toLowerCase()),
  );

  // Handle adding new custom category
  const handleAddCustomCategory = (e) => {
    e.preventDefault();
    if (customCategory.trim() && !categories.includes(customCategory.trim())) {
      const updatedCategories = [...categories, customCategory.trim()];
      setCategories(updatedCategories);
      setNewExpense({ ...newExpense, category: customCategory.trim() });
      setCustomCategory("");
      setIsAddCategoryModalOpen(false);
    }
  };

  // Handle adding new expense record
  const handleAddExpense = (e) => {
    e.preventDefault();
    const createdExpense = {
      id: expensesList.length + 1,
      vehicleName: newExpense.vehicleName,
      plateNumber: newExpense.plateNumber,
      category: newExpense.category,
      unitQty: parseFloat(newExpense.unitQty) || 0,
      unitPrice: parseFloat(newExpense.unitPrice) || 0,
      amount: calculatedTotalAmount,
      date: newExpense.date,
      description: newExpense.description,
      recordedBy: newExpense.recordedBy,
    };
    setExpensesList([createdExpense, ...expensesList]);
    setIsAddModalOpen(false);
    setNewExpense({
      vehicleName: "Toyota Hiace",
      plateNumber: "DHK-11-2344",
      category: categories[0] || "Fuel",
      unitQty: "",
      unitPrice: "",
      date: "",
      description: "",
      recordedBy: "Md. Limon Babu",
    });
  };

  // Filter expenses based on search input, category, vehicle, and date range
  const filteredExpenses = expensesList.filter((exp) => {
    const matchesSearch =
      exp.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.recordedBy.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" ||
      exp.category.toLowerCase().replace(/\s+/g, "") ===
        categoryFilter.toLowerCase();
    const matchesVehicle =
      vehicleFilter === "all" || exp.vehicleName === vehicleFilter;

    // Date range filter logic
    let matchesDate = true;
    if (startDate && exp.date < startDate) matchesDate = false;
    if (endDate && exp.date > endDate) matchesDate = false;

    return matchesSearch && matchesCategory && matchesVehicle && matchesDate;
  });

  // Calculate total displayed expenses cost sum based on filtered records
  const totalCostSum = filteredExpenses.reduce(
    (acc, curr) => acc + (curr.amount || 0),
    0,
  );

  return (
    <div className="flex-1 p-6 bg-gray-50 overflow-y-auto h-full w-full space-y-6">
      {/* Header Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Vehicle Expenses</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Track daily operational costs including fuel refills, tolls,
            parking, and driver allowances.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-2"
        >
          <Plus size={16} /> Add Expense Record
        </button>
      </div>

      {/* Overview Summary Widget Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">
              TOTAL RECORDED EXPENSES
            </div>
            <div className="text-2xl font-bold text-blue-600 mt-1">
              {totalCostSum.toLocaleString()} BDT
            </div>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center w-11 h-11">
            <span className="text-xl font-extrabold leading-none">৳</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">
              TOTAL TRANSACTIONS
            </div>
            <div className="text-2xl font-bold text-gray-800 mt-1">
              {filteredExpenses.length} Entries
            </div>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <FileText size={22} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">
              ACTIVE VEHICLES LOGGED
            </div>
            <div className="text-2xl font-bold text-amber-600 mt-1">
              {uniqueVehicles.length} Units
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
            placeholder="Search description, recorder..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Filters Group: Vehicle, Category, Start Date, End Date */}
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

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:border-blue-500 flex-1 sm:flex-none"
          >
            <option value="all">All Categories</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat.toLowerCase().replace(/\s+/g, "")}>
                {cat}
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
            categoryFilter !== "all" ||
            vehicleFilter !== "all" ||
            startDate ||
            endDate) && (
            <button
              onClick={() => {
                setSearchTerm("");
                setCategoryFilter("all");
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

      {/* Expenses Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-[11px] font-bold text-gray-500 bg-gray-50/50">
                <th className="py-3 px-4">Vehicle Details</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Unit Qty</th>
                <th className="py-3 px-4">Unit Price</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((exp) => (
                  <tr
                    key={exp.id}
                    className="hover:bg-gray-50/80 transition-all"
                  >
                    <td className="py-3 px-4">
                      <div className="font-semibold text-gray-800">
                        {exp.vehicleName}
                      </div>
                      <div className="text-[11px] text-blue-600 font-mono mt-0.5">
                        {exp.plateNumber}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 inline-flex items-center gap-1">
                        {exp.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-gray-800">
                      {exp.unitQty}
                    </td>
                    <td className="py-3 px-4 font-mono text-gray-800">
                      ৳{exp.unitPrice}
                    </td>
                    <td className="py-3 px-4 text-gray-600 font-mono">
                      {exp.date}
                    </td>
                    <td className="py-3 px-4 text-gray-800 font-medium max-w-xs truncate">
                      {exp.description}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-gray-800">
                      {exp.amount.toLocaleString()} BDT
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() =>
                          alert(
                            `Viewing expense details for ${exp.vehicleName} - ${exp.amount} BDT`,
                          )
                        }
                        className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-[11px] font-semibold transition-all"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-gray-400">
                    No expense records found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-800">
                Add Expense Record
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-4">
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
                    {newExpense.vehicleName
                      ? `${newExpense.vehicleName} (${newExpense.plateNumber})`
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
                              setNewExpense({
                                ...newExpense,
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
                      Category / Type
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsAddCategoryModalOpen(true)}
                      className="text-[11px] text-blue-600 font-bold hover:text-blue-700 flex items-center gap-0.5"
                    >
                      <Plus size={12} /> Add
                    </button>
                  </div>
                  <select
                    value={newExpense.category}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, category: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    {categories.map((cat, idx) => (
                      <option key={idx} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Expense Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newExpense.date}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, date: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Unit Qty
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="e.g. 35"
                    value={newExpense.unitQty}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, unitQty: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Unit Price (BDT)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="e.g. 130"
                    value={newExpense.unitPrice}
                    onChange={(e) =>
                      setNewExpense({
                        ...newExpense,
                        unitPrice: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Total Amount
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={
                      calculatedTotalAmount
                        ? `${calculatedTotalAmount.toLocaleString()} BDT`
                        : "0 BDT"
                    }
                    className="w-full px-3 py-2 text-xs bg-gray-100 border border-gray-200 rounded-lg font-bold text-blue-600 focus:outline-none cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Description / Notes
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fuel refill at filling station"
                  value={newExpense.description}
                  onChange={(e) =>
                    setNewExpense({
                      ...newExpense,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
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
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Custom Category Nested Modal */}
      {isAddCategoryModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h4 className="text-sm font-bold text-gray-800">
                Add New Category
              </h4>
              <button
                onClick={() => setIsAddCategoryModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleAddCustomCategory} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tyres / Battery Replacement"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddCategoryModalOpen(false)}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg"
                >
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
