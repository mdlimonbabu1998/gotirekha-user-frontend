import {
  BarChart2,
  Bell,
  ChevronDown,
  ChevronUp,
  FileText,
  Fuel,
  History,
  LayoutDashboard,
  MapPin,
  Receipt,
  Settings,
  ShieldAlert,
  Truck,
  Users,
  Wrench,
} from "lucide-react";
import { useState } from "react";

export default function Sidebar({ activeTab, setActiveTab }) {
  const [isVmsOpen, setIsVmsOpen] = useState(true);

  const standardMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "live-track", label: "Live Track", icon: MapPin },
    { id: "history", label: "History", icon: History },
    { id: "reports", label: "Reports", icon: BarChart2 },
    { id: "alarms", label: "Alarms", icon: Bell },
    { id: "geofences", label: "Geofences", icon: ShieldAlert },
  ];

  const vmsSubItems = [
    { id: "sub-user-list", label: "Sub User List", icon: Users },
    { id: "vehicle-list", label: "Vehicle List", icon: Truck },
    { id: "paper-information", label: "Paper information", icon: FileText },
    { id: "vehicle-maintenance", label: "Vehicle Maintenance", icon: Wrench },
    { id: "expenses", label: "Expenses", icon: Receipt },
    { id: "fuel-management", label: "Fuel Managment", icon: Fuel },
  ];

  return (
    <aside className="vts-sidebar w-64 bg-white border-r border-gray-200 flex flex-col h-full shadow-sm z-20">
      {/* Logo / Brand Header */}
      <div className="p-4 border-b border-gray-100 flex items-center space-x-2">
        <span className="text-blue-600 font-extrabold text-lg tracking-wide">
          Myself
        </span>
        <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold">
          web
        </span>
      </div>

      {/* Navigation Menu List */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {/* Standard Top Items */}
        {standardMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Icon
                size={18}
                className={isActive ? "text-white" : "text-gray-500"}
              />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}

        {/* VMS Parent Category with Collapsible Sub-Items */}
        <div className="pt-2">
          <button
            onClick={() => setIsVmsOpen(!isVmsOpen)}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100 transition-all cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <Truck size={18} className="text-blue-600" />
              <span>VMS</span>
            </div>
            {isVmsOpen ? (
              <ChevronUp size={16} className="text-gray-400" />
            ) : (
              <ChevronDown size={16} className="text-gray-400" />
            )}
          </button>

          {/* VMS Sub-Menu List */}
          {isVmsOpen && (
            <div className="pl-4 mt-1 space-y-1 border-l-2 border-gray-100 ml-4">
              {vmsSubItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      isActive
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <Icon
                      size={16}
                      className={isActive ? "text-white" : "text-gray-400"}
                    />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Settings at the bottom */}
        <button
          onClick={() => setActiveTab("settings")}
          className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer mt-2 ${
            activeTab === "settings"
              ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <Settings
            size={18}
            className={
              activeTab === "settings" ? "text-white" : "text-gray-500"
            }
          />
          <span className="truncate">Settings</span>
        </button>
      </nav>
    </aside>
  );
}
