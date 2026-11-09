import { Plus, Search, Wrench, X } from "lucide-react";
import { useState } from "react";

export default function VehicleMaintenance() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  // Sample vehicle maintenance records dataset
  const [maintenanceList, setMaintenanceList] = useState([
    {
      id: 1,
      vehicleName: "Toyota Hiace",
      plateNumber: "DHK-11-2344",
      serviceType: "Engine Oil & Filter Change",
      serviceDate: "2026-10-15",
      mileageDue: "45,000 KM",
      cost: "3,500 BDT",
      status: "Completed",
      mechanic: "Rahim Auto Workshop",
    },
    {
      id: 2,
      vehicleName: "Tata Pickup",
      plateNumber: "CTG-12-9812",
      serviceType: "Brake Pad Replacement",
      serviceDate: "2026-11-02",
      mileageDue: "30,000 KM",
      cost: "4,800 BDT",
      status: "Scheduled",
      mechanic: "Chittagong Service Center",
    },
    {
      id: 3,
      vehicleName: "Mitsubishi Canter",
      plateNumber: "SYL-22-4411",
      serviceType: "General Diagnostics & Tuning",
      serviceDate: "2026-10-20",
      mileageDue: "60,000 KM",
      cost: "6,000 BDT",
      status: "In Progress",
      mechanic: "Sylhet Express Garage",
    },
    {
      id: 4,
      vehicleName: "Hino Truck 3-Ton",
      plateNumber: "RAJ-31-5567",
      serviceType: "Tire Rotation & Alignment",
      serviceDate: "2026-11-10",
      mileageDue: "80,000 KM",
      cost: "2,500 BDT",
      status: "Scheduled",
      mechanic: "Rajshahi Truck Hub",
    },
  ]);

  // Form state for adding new maintenance record
  const [newRecord, setNewRecord] = useState({
    vehicleName: "Toyota Hiace",
    plateNumber: "DHK-11-2344",
    serviceType: "Engine Oil & Filter Change",
    serviceDate: "",
    mileageDue: "",
    cost: "",
    mechanic: "",
  });

  // Handle adding new maintenance record
  const handleAddRecord = (e) => {
    e.preventDefault();
    const createdRecord = {
      id: maintenanceList.length + 1,
      ...newRecord,
      status: "Scheduled",
    };
    setMaintenanceList([createdRecord, ...maintenanceList]);
    setIsAddModalOpen(false);
    setNewRecord({
      vehicleName: "Toyota Hiace",
      plateNumber: "DHK-11-2344",
      serviceType: "Engine Oil & Filter Change",
      serviceDate: "",
      mileageDue: "",
      cost: "",
      mechanic: "",
    });
  };

  // Open Edit Modal with selected record data
  const handleOpenEdit = (record) => {
    setCurrentRecord({ ...record });
    setIsEditModalOpen(true);
  };

  // Handle updating existing maintenance record
  const handleUpdateRecord = (e) => {
    e.preventDefault();
    setMaintenanceList(
      maintenanceList.map((m) =>
        m.id === currentRecord.id ? currentRecord : m,
      ),
    );
    setIsEditModalOpen(false);
    setCurrentRecord(null);
  };

  // Filter maintenance records based on search input and status dropdown
  const filteredMaintenance = maintenanceList.filter((m) => {
    const matchesSearch =
      m.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.mechanic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      m.status.toLowerCase().replace(/\s+/g, "") === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex-1 p-6 bg-gray-50 overflow-y-auto h-full w-full space-y-6">
      {/* Header Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">
            Vehicle Maintenance
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage scheduled servicing, repair logs, garage assignments, and
            maintenance costs.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-2"
        >
          <Plus size={16} /> Add Maintenance Record
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search vehicle, service, or mechanic..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:border-blue-500 w-full sm:w-auto"
          >
            <option value="all">All Statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="inprogress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Maintenance Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-[11px] font-bold text-gray-500 bg-gray-50/50">
                <th className="py-3 px-4">Vehicle Details</th>
                <th className="py-3 px-4">Service Type</th>
                <th className="py-3 px-4">Service Date</th>
                <th className="py-3 px-4">Due Mileage</th>
                <th className="py-3 px-4">Workshop / Mechanic</th>
                <th className="py-3 px-4">Cost</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
              {filteredMaintenance.length > 0 ? (
                filteredMaintenance.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50/80 transition-all">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-gray-800">
                        {m.vehicleName}
                      </div>
                      <div className="text-[11px] text-blue-600 font-mono mt-0.5">
                        {m.plateNumber}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-800 flex items-center gap-1.5 pt-4">
                      <Wrench size={14} className="text-blue-500" />
                      {m.serviceType}
                    </td>
                    <td className="py-3 px-4 text-gray-600 font-mono">
                      {m.serviceDate}
                    </td>
                    <td className="py-3 px-4 text-gray-600 font-mono font-medium">
                      {m.mileageDue}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{m.mechanic}</td>
                    <td className="py-3 px-4 font-mono font-semibold text-gray-800">
                      {m.cost}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                          m.status === "Completed"
                            ? "bg-emerald-50 text-emerald-600"
                            : m.status === "In Progress"
                              ? "bg-amber-50 text-amber-600"
                              : "bg-blue-50 text-blue-600"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            m.status === "Completed"
                              ? "bg-emerald-500"
                              : m.status === "In Progress"
                                ? "bg-amber-500"
                                : "bg-blue-500"
                          }`}
                        ></span>
                        {m.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleOpenEdit(m)}
                        className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-[11px] font-semibold transition-all"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-gray-400">
                    No maintenance records found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Maintenance Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-800">
                Add Maintenance Record
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddRecord} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Vehicle Name & Plate
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Toyota Hiace (DHK-11-2344)"
                  value={newRecord.vehicleName}
                  onChange={(e) =>
                    setNewRecord({ ...newRecord, vehicleName: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Service / Repair Type
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Brake Pad Replacement"
                  value={newRecord.serviceType}
                  onChange={(e) =>
                    setNewRecord({ ...newRecord, serviceType: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Service Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newRecord.serviceDate}
                    onChange={(e) =>
                      setNewRecord({
                        ...newRecord,
                        serviceDate: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Due Mileage
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 50,000 KM"
                    value={newRecord.mileageDue}
                    onChange={(e) =>
                      setNewRecord({ ...newRecord, mileageDue: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Estimated Cost (BDT)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 4,500 BDT"
                    value={newRecord.cost}
                    onChange={(e) =>
                      setNewRecord({ ...newRecord, cost: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Workshop / Mechanic
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. City Garage"
                    value={newRecord.mechanic}
                    onChange={(e) =>
                      setNewRecord({ ...newRecord, mechanic: e.target.value })
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
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Maintenance Modal */}
      {isEditModalOpen && currentRecord && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-800">
                Edit Maintenance Record
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateRecord} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Vehicle Name
                </label>
                <input
                  type="text"
                  required
                  value={currentRecord.vehicleName}
                  onChange={(e) =>
                    setCurrentRecord({
                      ...currentRecord,
                      vehicleName: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Service / Repair Type
                </label>
                <input
                  type="text"
                  required
                  value={currentRecord.serviceType}
                  onChange={(e) =>
                    setCurrentRecord({
                      ...currentRecord,
                      serviceType: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Service Date
                  </label>
                  <input
                    type="date"
                    required
                    value={currentRecord.serviceDate}
                    onChange={(e) =>
                      setCurrentRecord({
                        ...currentRecord,
                        serviceDate: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={currentRecord.status}
                    onChange={(e) =>
                      setCurrentRecord({
                        ...currentRecord,
                        status: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Cost (BDT)
                  </label>
                  <input
                    type="text"
                    required
                    value={currentRecord.cost}
                    onChange={(e) =>
                      setCurrentRecord({
                        ...currentRecord,
                        cost: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Workshop / Mechanic
                  </label>
                  <input
                    type="text"
                    required
                    value={currentRecord.mechanic}
                    onChange={(e) =>
                      setCurrentRecord({
                        ...currentRecord,
                        mechanic: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-all"
                >
                  Update Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
