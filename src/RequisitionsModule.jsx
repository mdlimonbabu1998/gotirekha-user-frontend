import React, { useState } from 'react';
import {
    ClipboardList,
    Plus,
    Calendar,
    Truck,
    User,
    CheckCircle2,
    XCircle,
    Clock,
    MapPin,
    FileText
} from 'lucide-react';

export default function RequisitionsModule() {
    // Requisitions state
    const [requisitions, setRequisitions] = useState([
        {
            id: 'REQ-101',
            requester: 'Md. Tanvir Ahmed',
            department: 'Operations',
            vehicle: 'DHAKA-METRO-G-11-2233',
            purpose: 'Client visit & site inspection in Uttara',
            destination: 'Uttara Sector 12, Dhaka',
            dateTime: '2026-10-20 09:30 AM',
            status: 'Approved'
        },
        {
            id: 'REQ-102',
            requester: 'Sabina Yasmin',
            department: 'Marketing',
            vehicle: 'DHAKA-METRO-HA-15-9012',
            purpose: 'Promotional event transport in Gulshan',
            destination: 'Gulshan-2 Convention Center',
            dateTime: '2026-10-21 02:00 PM',
            status: 'Pending'
        },
        {
            id: 'REQ-103',
            requester: 'Rakibul Islam',
            department: 'Logistics',
            vehicle: 'CHATTO-METRO-KA-09-4455',
            purpose: 'Warehouse stock transfer & audit',
            destination: 'Motijheel Central Depot',
            dateTime: '2026-10-22 10:00 AM',
            status: 'Rejected'
        }
    ]);

    // New Request Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [requester, setRequester] = useState('');
    const [department, setDepartment] = useState('Operations');
    const [vehicle, setVehicle] = useState('DHAKA-METRO-G-11-2233');
    const [purpose, setPurpose] = useState('');
    const [destination, setDestination] = useState('');
    const [dateTime, setDateTime] = useState('');

    const handleCreateRequisition = (e) => {
        e.preventDefault();
        if (!requester || !purpose || !destination) return;

        const newReq = {
            id: `REQ-10${requisitions.length + 1}`,
            requester,
            department,
            vehicle,
            purpose,
            destination,
            dateTime: dateTime ? dateTime.replace('T', ' ') : '2026-10-25 10:00 AM',
            status: 'Pending'
        };

        setRequisitions([newReq, ...requisitions]);
        setRequester('');
        setPurpose('');
        setDestination('');
        setIsModalOpen(false);
    };

    const handleUpdateStatus = (id, newStatus) => {
        setRequisitions(prev => prev.map(req =>
            req.id === id ? { ...req, status: newStatus } : req
        ));
    };

    return (
        <div className="flex flex-col h-full w-full bg-gray-50 overflow-y-auto font-sans p-8 space-y-6">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div>
                    <h1 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
                        <ClipboardList className="text-blue-600" size={24} />
                        <span>Vehicle Requisitions & Booking</span>
                    </h1>
                    <p className="text-xs text-gray-500 mt-1">
                        Manage transportation bookings, employee travel requests, and vehicle allocation approvals.
                    </p>
                </div>
                <div>
                    <button
                        onClick={() => setIsModalOpen(!isModalOpen)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-xs font-bold flex items-center space-x-2 transition-all shadow-sm"
                    >
                        <Plus size={16} />
                        <span>{isModalOpen ? 'Cancel' : 'New Requisition Request'}</span>
                    </button>
                </div>
            </div>

            {/* Creation Form Panel */}
            {isModalOpen && (
                <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-md space-y-4">
                    <h3 className="font-bold text-gray-800 text-sm border-b pb-2">Submit Vehicle Requisition Form</h3>
                    <form onSubmit={handleCreateRequisition} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div className="flex flex-col space-y-1">
                            <label className="text-xs font-bold text-gray-500">Requester Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Md. Limon Babu"
                                value={requester}
                                onChange={(e) => setRequester(e.target.value)}
                                required
                                className="border border-gray-300 rounded-lg px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                        <div className="flex flex-col space-y-1">
                            <label className="text-xs font-bold text-gray-500">Department</label>
                            <select
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 text-xs font-medium bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                                <option value="Operations">Operations</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Logistics">Logistics</option>
                                <option value="Management">Management</option>
                            </select>
                        </div>
                        <div className="flex flex-col space-y-1">
                            <label className="text-xs font-bold text-gray-500">Preferred Vehicle</label>
                            <select
                                value={vehicle}
                                onChange={(e) => setVehicle(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 text-xs font-medium bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                                <option value="DHAKA-METRO-G-11-2233">DHAKA-METRO-G-11-2233</option>
                                <option value="DHAKA-METRO-HA-15-9012">DHAKA-METRO-HA-15-9012</option>
                                <option value="CHATTO-METRO-KA-09-4455">CHATTO-METRO-KA-09-4455</option>
                            </select>
                        </div>
                        <div className="flex flex-col space-y-1">
                            <label className="text-xs font-bold text-gray-500">Destination</label>
                            <input
                                type="text"
                                placeholder="e.g. Uttara Sector 7"
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                                required
                                className="border border-gray-300 rounded-lg px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                        <div className="flex flex-col space-y-1">
                            <label className="text-xs font-bold text-gray-500">Date & Time</label>
                            <input
                                type="datetime-local"
                                value={dateTime}
                                onChange={(e) => setDateTime(e.target.value)}
                                required
                                className="border border-gray-300 rounded-lg px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                        <div className="flex flex-col space-y-1">
                            <label className="text-xs font-bold text-gray-500">Purpose</label>
                            <input
                                type="text"
                                placeholder="Brief reason for trip"
                                value={purpose}
                                onChange={(e) => setPurpose(e.target.value)}
                                required
                                className="border border-gray-300 rounded-lg px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                        <div className="md:col-span-3">
                            <button
                                type="submit"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm"
                            >
                                Submit Requisition Request
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Requisitions Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800 text-sm">All Transport Requests ({requisitions.length})</h3>
                    <span className="text-xs text-gray-400">Manage approval workflows</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50 text-[11px] font-bold text-gray-500 uppercase">
                                <th className="px-6 py-3">Req ID</th>
                                <th className="px-6 py-3">Requester & Dept</th>
                                <th className="px-6 py-3">Vehicle Assigned</th>
                                <th className="px-6 py-3">Destination / Purpose</th>
                                <th className="px-6 py-3">Date & Time</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 text-xs text-gray-700">
                            {requisitions.map((req) => (
                                <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-3 font-bold text-blue-600">{req.id}</td>
                                    <td className="px-6 py-3">
                                        <p className="font-bold text-gray-900">{req.requester}</p>
                                        <span className="text-gray-400 text-[11px]">{req.department}</span>
                                    </td>
                                    <td className="px-6 py-3 font-semibold text-gray-800">{req.vehicle}</td>
                                    <td className="px-6 py-3">
                                        <p className="font-semibold text-gray-800">{req.destination}</p>
                                        <span className="text-gray-400 text-[11px]">{req.purpose}</span>
                                    </td>
                                    <td className="px-6 py-3 text-gray-500">{req.dateTime}</td>
                                    <td className="px-6 py-3">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                            req.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                            req.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                                            'bg-red-50 text-red-700 border border-red-100'
                                        }`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 space-x-2">
                                        {req.status === 'Pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleUpdateStatus(req.id, 'Approved')}
                                                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold transition-all"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateStatus(req.id, 'Rejected')}
                                                    className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[10px] font-bold transition-all"
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                        {req.status !== 'Pending' && (
                                            <span className="text-gray-400 italic text-[11px]">Completed</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}