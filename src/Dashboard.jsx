import React, { useState } from 'react';
import { Info, Bell, User, ChevronDown, X, Navigation, MapPin, Truck } from 'lucide-react';

export default function Dashboard() {
    // Selected metric card filter for modal vehicle view
    const [activeModalFilter, setActiveModalFilter] = useState(null);

    // Active tooltip tracking state on "i" icon hover
    const [activeTooltip, setActiveTooltip] = useState(null);

    // Sample telemetry vehicle list mapped to each status category
    const [vehicles] = useState([
        {
            id: 1,
            name: 'Toyota Hiace',
            plateNumber: 'DHK-11-2344',
            status: 'MOVING',
            speed: '55 km/h',
            location: 'Gulshan-2, Dhaka',
            driver: 'Rahim Uddin',
            lastUpdate: 'Just now'
        },
        {
            id: 2,
            name: 'Tata Pickup',
            plateNumber: 'CTG-12-9812',
            status: 'ENGINE OFF',
            speed: '0 km/h',
            location: 'Agrabad, Chattogram',
            driver: 'Karim Mia',
            lastUpdate: '5 mins ago'
        },
        {
            id: 3,
            name: 'Mitsubishi Canter',
            plateNumber: 'SYL-22-4411',
            status: 'OFFLINE',
            speed: '-',
            location: 'Sylhet Bypass',
            driver: 'Tanvir Ahmed',
            lastUpdate: '2 hours ago'
        }
    ]);

    // Metric cards definition with status criteria, tooltips, and clickable filters
    const metrics = [
        {
            id: 'all',
            label: 'TOTAL OBJECTS',
            value: vehicles.length,
            color: 'text-blue-600',
            tooltip: 'Total number of active GPS devices registered under your fleet account.'
        },
        {
            id: 'MOVING',
            label: 'MOVING',
            value: vehicles.filter(v => v.status === 'MOVING').length,
            color: 'text-emerald-600',
            tooltip: 'Vehicles currently in transit with engine ON and speed greater than 0 km/h.'
        },
        {
            id: 'ENGINE OFF',
            label: 'ENGINE OFF',
            value: vehicles.filter(v => v.status === 'ENGINE OFF').length,
            color: 'text-amber-500',
            tooltip: 'Vehicles parked safely with engine ignition switched OFF.'
        },
        {
            id: 'OFFLINE',
            label: 'OFFLINE',
            value: vehicles.filter(v => v.status === 'OFFLINE').length,
            color: 'text-orange-500',
            tooltip: 'Vehicles with lost cellular or GPS satellite connection for over 1 hour.'
        },
        {
            id: 'alarms',
            label: 'ALARMS TODAY',
            value: '2',
            color: 'text-rose-600',
            tooltip: 'Count of critical safety or geofence violation alerts triggered today.'
        },
        {
            id: 'mileage',
            label: 'TODAY MILEAGE',
            value: '62.1 KM',
            color: 'text-blue-600',
            tooltip: 'Aggregated total distance traveled across all fleet units today.'
        },
    ];

    // Filter vehicles dynamically based on clicked card category
    const modalVehicles = activeModalFilter === 'all'
        ? vehicles
        : vehicles.filter(v => v.status === activeModalFilter);

    return (
        <div className="flex-1 p-6 bg-gray-50 overflow-y-auto h-full w-full space-y-6">

            {/* Top Bar / Header */}
            <div className="flex items-center justify-between pb-2">
                <h1 className="text-xl font-bold text-gray-800">Dashboard View</h1>

                {/* User Info & Notification Header */}
                <div className="flex items-center gap-6">
                    <div className="relative cursor-pointer">
                        <div className="p-2 text-gray-500 hover:text-gray-700 transition-all">
                            <Bell size={20} />
                        </div>
                        <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                            24
                        </span>
                    </div>

                    <div className="flex items-center gap-2.5 cursor-pointer">
                        <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                            <User size={18} />
                        </div>
                        <div className="text-left hidden sm:block">
                            <div className="text-xs font-bold text-gray-800 leading-tight">Md. Limon Babu</div>
                            <div className="text-[10px] text-gray-400">personal account</div>
                        </div>
                        <ChevronDown size={14} className="text-gray-400 ml-1" />
                    </div>
                </div>
            </div>

            {/* Clickable Metrics Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {metrics.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => ['all', 'MOVING', 'ENGINE OFF', 'OFFLINE'].includes(item.id) && setActiveModalFilter(item.id)}
                        className={`bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between h-24 relative transition-all duration-200 ${
                            ['all', 'MOVING', 'ENGINE OFF', 'OFFLINE'].includes(item.id)
                                ? 'cursor-pointer hover:border-blue-400 hover:shadow-md'
                                : ''
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">{item.label}</span>

                            {/* "i" Icon with Automatic Hover Tooltip */}
                            <div
                                className="relative"
                                onMouseEnter={(e) => {
                                    e.stopPropagation();
                                    setActiveTooltip(item.id);
                                }}
                                onMouseLeave={(e) => {
                                    e.stopPropagation();
                                    setActiveTooltip(null);
                                }}
                            >
                                <Info size={13} className="text-gray-400 hover:text-blue-600 transition-colors cursor-help" />

                                {activeTooltip === item.id && (
                                    <div className="absolute right-0 top-5 w-48 bg-gray-900 text-white text-[11px] leading-snug p-2.5 rounded-lg shadow-xl z-30 pointer-events-none">
                                        <div className="font-bold text-blue-300 mb-0.5">{item.label}</div>
                                        {item.tooltip}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={`text-2xl font-bold ${item.color}`}>
                            {item.value}
                        </div>
                    </div>
                ))}
            </div>

            {/* Weekly Distance Overview Card */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-400 tracking-wider uppercase">WEEKLY DISTANCE OVERVIEW</span>
                    <span className="text-[11px] text-gray-400 font-medium">Updated Last Friday At 12:17 AM</span>
                </div>

                <div className="relative w-full h-64 pt-4">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 800 200" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                            </linearGradient>
                        </defs>

                        <line x1="0" y1="40" x2="800" y2="40" stroke="#f1f5f9" strokeDasharray="3 3" />
                        <line x1="0" y1="100" x2="800" y2="100" stroke="#f1f5f9" strokeDasharray="3 3" />
                        <line x1="0" y1="160" x2="800" y2="160" stroke="#f1f5f9" strokeDasharray="3 3" />

                        <path d="M 50 130 Q 250 140 400 135 T 600 110 T 750 40 L 750 200 L 50 200 Z" fill="url(#blueGradient)" />
                        <path d="M 50 130 Q 250 140 400 135 T 600 110 T 750 40" fill="none" stroke="#3b82f6" strokeWidth="3.5" strokeLinecap="round" />

                        <circle cx="50" cy="130" r="4" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
                        <circle cx="400" cy="135" r="4" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
                        <circle cx="600" cy="110" r="4" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
                        <circle cx="750" cy="40" r="5" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
                    </svg>

                    <div className="absolute left-[3%] top-[48%] bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">15.62</div>
                    <div className="absolute left-[47%] top-[50%] bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">5.98</div>
                    <div className="absolute left-[72%] top-[39%] bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">5.89</div>
                    <div className="absolute right-[2.5%] top-[8%] bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">62.13</div>
                </div>

                <div className="grid grid-cols-4 text-center pt-4 border-t border-gray-100">
                    <div>
                        <div className="text-[11px] text-gray-400">Oct 11, 2026</div>
                        <div className="text-[10px] text-gray-400 mt-1">Last 7 days (KM)</div>
                        <div className="text-sm font-bold text-blue-600 mt-0.5">89.62</div>
                    </div>
                    <div>
                        <div className="text-[11px] text-gray-400">Oct 12, 2026</div>
                        <div className="text-[10px] text-gray-400 mt-1">Last 30 days (KM)</div>
                        <div className="text-sm font-bold text-blue-600 mt-0.5">149.2</div>
                    </div>
                    <div>
                        <div className="text-[11px] text-gray-400">Oct 13, 2026</div>
                        <div className="text-[10px] text-gray-400 mt-1">September, 2026 (KM)</div>
                        <div className="text-sm font-bold text-blue-600 mt-0.5">177.18</div>
                    </div>
                    <div>
                        <div className="text-[11px] text-gray-400">Oct 15, 2026</div>
                    </div>
                </div>

            </div>

            {/* Modal: Shows Filtered Vehicle List on Card Click */}
            {activeModalFilter && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                            <div className="flex items-center gap-2">
                                <Truck size={18} className="text-blue-600" />
                                <h3 className="text-base font-bold text-gray-800 uppercase tracking-wide">
                                    {activeModalFilter === 'all' ? 'All Registered Vehicles' : `${activeModalFilter} Vehicles`}
                                </h3>
                                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-full">
                                    {modalVehicles.length} Units
                                </span>
                            </div>
                            <button
                                onClick={() => setActiveModalFilter(null)}
                                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Vehicle Data Table inside Modal */}
                        <div className="overflow-x-auto max-h-80 overflow-y-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-200 text-[11px] font-bold text-gray-500 bg-gray-50">
                                        <th className="py-2.5 px-3">Vehicle</th>
                                        <th className="py-2.5 px-3">Driver</th>
                                        <th className="py-2.5 px-3">Status</th>
                                        <th className="py-2.5 px-3">Location & Speed</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-xs">
                                    {modalVehicles.length > 0 ? (
                                        modalVehicles.map((v) => (
                                            <tr key={v.id} className="hover:bg-gray-50/80 transition-all">
                                                <td className="py-3 px-3">
                                                    <div className="font-bold text-gray-800">{v.name}</div>
                                                    <div className="text-[11px] text-blue-600 font-mono">{v.plateNumber}</div>
                                                </td>
                                                <td className="py-3 px-3 text-gray-600">{v.driver}</td>
                                                <td className="py-3 px-3">
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                        v.status === 'MOVING' ? 'bg-emerald-50 text-emerald-600' :
                                                        v.status === 'ENGINE OFF' ? 'bg-amber-50 text-amber-600' : 'bg-orange-50 text-orange-600'
                                                    }`}>
                                                        {v.status}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-3">
                                                    <div className="flex items-center gap-1 text-gray-800 font-medium truncate max-w-[180px]">
                                                        <MapPin size={12} className="text-gray-400 flex-shrink-0" />
                                                        {v.location}
                                                    </div>
                                                    <div className="text-[11px] text-gray-400 font-mono">Speed: {v.speed}</div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="py-6 text-center text-gray-400">
                                                No vehicles found under this status.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                onClick={() => setActiveModalFilter(null)}
                                className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-all"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}