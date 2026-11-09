import { AlertTriangle, FileText, Mail, Plus, Search, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function PaperInformation() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [notificationLog, setNotificationLog] = useState([]);

  // Sample vehicle paper documents dataset
  const [papers, setPapers] = useState([
    {
      id: 1,
      vehicleName: "Toyota Hiace",
      plateNumber: "DHK-11-2344",
      paperType: "Fitness Certificate",
      issueDate: "2025-11-15",
      expiryDate: "2026-11-15",
      status: "Active",
      amount: "4,500 BDT",
    },
    {
      id: 2,
      vehicleName: "Tata Pickup",
      plateNumber: "CTG-12-9812",
      paperType: "Tax Token",
      issueDate: "2025-10-20",
      expiryDate: "2026-11-05", // Expiring within 15 days from current date (Oct 23, 2026)
      status: "Expiring Soon",
      amount: "6,200 BDT",
    },
    {
      id: 3,
      vehicleName: "Mitsubishi Canter",
      plateNumber: "SYL-22-4411",
      paperType: "Insurance Policy",
      issueDate: "2024-09-10",
      expiryDate: "2025-09-10", // Already expired
      status: "Expired",
      amount: "12,000 BDT",
    },
    {
      id: 4,
      vehicleName: "Hino Truck 3-Ton",
      plateNumber: "RAJ-31-5567",
      paperType: "Route Permit",
      issueDate: "2024-01-01",
      expiryDate: "2027-01-01",
      status: "Active",
      amount: "8,500 BDT",
    },
  ]);

  // Form state for adding new paper record
  const [newPaper, setNewPaper] = useState({
    vehicleName: "Toyota Hiace",
    plateNumber: "DHK-11-2344",
    paperType: "Fitness Certificate",
    issueDate: "",
    expiryDate: "",
    amount: "",
  });

  // Check for papers expiring within 15 days and trigger popup & mail alerts
  useEffect(() => {
    const today = new Date();
    const expiringSoonAlerts = papers.filter((p) => {
      const expiry = new Date(p.expiryDate);
      const diffTime = expiry - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 15 && diffDays >= 0; // Trigger alert if expiry is within 15 days
    });

    if (expiringSoonAlerts.length > 0) {
      const alerts = expiringSoonAlerts.map((item) => ({
        id: item.id,
        title: `⚠️ 15-Day Expiry Warning: ${item.paperType}`,
        message: `Vehicle ${item.vehicleName} (${item.plateNumber}) paper expires on ${item.expiryDate} (within 15 days). Email notification dispatched to admin.`,
      }));
      setNotificationLog(alerts);
    }
  }, [papers]);

  // Handle adding new paper document
  const handleAddPaper = (e) => {
    e.preventDefault();
    const createdPaper = {
      id: papers.length + 1,
      ...newPaper,
      status: "Active",
    };
    setPapers([createdPaper, ...papers]);
    setIsAddModalOpen(false);
    setNewPaper({
      vehicleName: "Toyota Hiace",
      plateNumber: "DHK-11-2344",
      paperType: "Fitness Certificate",
      issueDate: "",
      expiryDate: "",
      amount: "",
    });
  };

  // Filter papers based on search and status dropdown
  const filteredPapers = papers.filter((p) => {
    const matchesSearch =
      p.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.paperType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" ||
      p.status.toLowerCase().replace(/\s+/g, "") === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex-1 p-6 bg-gray-50 overflow-y-auto h-full w-full space-y-6">
      {/* Header Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">
            Vehicle Paper Information
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Track fitness certificates, tax tokens, and insurance renewals with
            automated 15-day expiration warnings.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-2"
        >
          <Plus size={16} /> Add New Document
        </button>
      </div>

      {/* Automated 15-Day Expiration Popup Banner / Notification Log */}
      {notificationLog.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wide">
            <AlertTriangle
              size={16}
              className="text-amber-600 animate-bounce"
            />
            Automated 15-Day Expiry Warning & Mail Notifications Active
          </div>
          <div className="space-y-1">
            {notificationLog.map((note) => (
              <div
                key={note.id}
                className="text-xs text-amber-900 flex items-center justify-between bg-white/60 px-3 py-2 rounded-lg border border-amber-100"
              >
                <span>{note.message}</span>
                <span className="flex items-center gap-1 text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">
                  <Mail size={12} /> Email Sent
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search vehicle, plate, or paper type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:border-blue-500 w-full sm:w-auto"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="expiringsoon">Expiring Soon (15 Days)</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Papers Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-[11px] font-bold text-gray-500 bg-gray-50/50">
                <th className="py-3 px-4">Vehicle Details</th>
                <th className="py-3 px-4">Document Type</th>
                <th className="py-3 px-4">Issue Date</th>
                <th className="py-3 px-4">Expiry Date</th>
                <th className="py-3 px-4">Fee / Cost</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
              {filteredPapers.length > 0 ? (
                filteredPapers.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/80 transition-all">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-gray-800">
                        {p.vehicleName}
                      </div>
                      <div className="text-[11px] text-blue-600 font-mono mt-0.5">
                        {p.plateNumber}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-800 flex items-center gap-1.5 pt-4">
                      <FileText size={14} className="text-blue-500" />
                      {p.paperType}
                    </td>
                    <td className="py-3 px-4 text-gray-600 font-mono">
                      {p.issueDate}
                    </td>
                    <td className="py-3 px-4 text-gray-600 font-mono font-medium">
                      {p.expiryDate}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-gray-800">
                      {p.amount}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                          p.status === "Active"
                            ? "bg-emerald-50 text-emerald-600"
                            : p.status === "Expiring Soon"
                              ? "bg-amber-50 text-amber-600"
                              : "bg-rose-50 text-rose-600"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            p.status === "Active"
                              ? "bg-emerald-500"
                              : p.status === "Expiring Soon"
                                ? "bg-amber-500"
                                : "bg-rose-500"
                          }`}
                        ></span>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() =>
                          alert(
                            `15-day renewal reminder email & SMS manually sent for ${p.paperType} (${p.plateNumber}).`,
                          )
                        }
                        className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-[11px] font-semibold transition-all inline-flex items-center gap-1"
                      >
                        <Mail size={12} /> Send Notice
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-gray-400">
                    No paper information records found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Document Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-800">
                Add Vehicle Paper Record
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddPaper} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Vehicle Name & Plate
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Toyota Hiace (DHK-11-2344)"
                  value={newPaper.vehicleName}
                  onChange={(e) =>
                    setNewPaper({ ...newPaper, vehicleName: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Document Type
                </label>
                <select
                  value={newPaper.paperType}
                  onChange={(e) =>
                    setNewPaper({ ...newPaper, paperType: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="Fitness Certificate">
                    Fitness Certificate
                  </option>
                  <option value="Tax Token">Tax Token</option>
                  <option value="Insurance Policy">Insurance Policy</option>
                  <option value="Route Permit">Route Permit</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Issue Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newPaper.issueDate}
                    onChange={(e) =>
                      setNewPaper({ ...newPaper, issueDate: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newPaper.expiryDate}
                    onChange={(e) =>
                      setNewPaper({ ...newPaper, expiryDate: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Renewal Fee (BDT)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5,000 BDT"
                  value={newPaper.amount}
                  onChange={(e) =>
                    setNewPaper({ ...newPaper, amount: e.target.value })
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
                  Save Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
