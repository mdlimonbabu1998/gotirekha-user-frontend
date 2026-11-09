import React, { useState } from 'react';
import { UserPlus, Search, Shield, Trash2, CheckCircle2 } from 'lucide-react';

export default function SubUserList() {
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [successMsg, setSuccessMsg] = useState(false);

    const [users, setUsers] = useState([
        {
            id: 1,
            name: 'Tanvir Ahmed',
            email: 'tanvir.ahmed@garitrack.com',
            phone: '+880 1711-297914',
            role: 'Fleet Supervisor',
            status: 'Active',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
            assignedVehicles: 12
        },
        {
            id: 2,
            name: 'Rahim Uddin',
            email: 'rahim.uddin@garitrack.com',
            phone: '+880 1819-445566',
            role: 'Dispatcher',
            status: 'Active',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
            assignedVehicles: 5
        },
        {
            id: 3,
            name: 'Nasir Khan',
            email: 'nasir.khan@garitrack.com',
            phone: '+880 1922-334455',
            role: 'Maintenance Lead',
            status: 'Inactive',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
            assignedVehicles: 8
        }
    ]);

    const [newUser, setNewUser] = useState({ name: '', email: '', phone: '', role: 'Dispatcher' });

    const handleAddUser = (e) => {
        e.preventDefault();
        if (!newUser.name || !newUser.email) return;

        const createdUser = {
            id: users.length + 1,
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone || '+880 1000-000000',
            role: newUser.role,
            status: 'Active',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
            assignedVehicles: 0
        };

        setUsers([createdUser, ...users]);
        setNewUser({ name: '', email: '', phone: '', role: 'Dispatcher' });
        setShowAddModal(false);
        setSuccessMsg(true);
        setTimeout(() => setSuccessMsg(false), 3000);
    };

    const handleDelete = (id) => {
        setUsers(users.filter(u => u.id !== id));
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex-1 p-6 bg-gray-50 overflow-y-auto h-full w-full">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Header & Button */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Sub User List</h1>
                        <p className="text-xs text-gray-500 mt-0.5">Manage user roles and vehicle monitoring access permissions.</p>
                    </div>

                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center space-x-2 cursor-pointer"
                    >
                        <UserPlus size={15} />
                        <span>Add Sub User</span>
                    </button>
                </div>

                {successMsg && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-lg text-xs font-medium flex items-center space-x-2">
                        <CheckCircle2 size={16} className="text-emerald-600" />
                        <span>Sub user created successfully!</span>
                    </div>
                )}

                {/* Search Bar */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
                    <div className="relative w-72">
                        <Search size={15} className="absolute left-3 top-2.5 text-gray-400 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search user by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 rounded-lg py-2 pl-9 pr-3 text-xs text-gray-800 outline-none transition-all"
                        />
                    </div>
                    <div className="text-xs text-gray-500 font-medium">
                        Total Sub-Users: <span className="font-bold text-gray-800">{users.length}</span>
                    </div>
                </div>

                {/* Sub User Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-200 text-[11px] font-bold text-gray-500 bg-gray-50/50">
                                    <th className="py-3 px-4">User Details</th>
                                    <th className="py-3 px-4">Phone Number</th>
                                    <th className="py-3 px-4">Role / Permission</th>
                                    <th className="py-3 px-4 text-center">Assigned Vehicles</th>
                                    <th className="py-3 px-4 text-center">Status</th>
                                    <th className="py-3 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50/80 transition-all">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center space-x-3">
                                                <img
                                                    src={user.avatar}
                                                    alt={user.name}
                                                    className="w-8 h-8 rounded-full object-cover border border-gray-200"
                                                />
                                                <div>
                                                    <p className="font-semibold text-gray-800 leading-tight">{user.name}</p>
                                                    <p className="text-[10px] text-gray-400">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 font-mono text-gray-600">{user.phone}</td>
                                        <td className="py-3 px-4">
                                            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600">
                                                <Shield size={10} />
                                                <span>{user.role}</span>
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-center font-semibold text-gray-700">{user.assignedVehicles} Units</td>
                                        <td className="py-3 px-4 text-center">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                                user.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'
                                            }`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                                title="Delete User"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl space-y-4">
                        <h3 className="text-base font-bold text-gray-900">Add New Sub User</h3>

                        <form onSubmit={handleAddUser} className="space-y-3">
                            <div>
                                <label className="block text-[11px] font-bold text-gray-600 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g., John Doe"
                                    value={newUser.name}
                                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-xs text-gray-800 outline-none focus:border-blue-600"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-gray-600 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="user@garitrack.com"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-xs text-gray-800 outline-none focus:border-blue-600"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-gray-600 mb-1">Mobile Number</label>
                                <input
                                    type="text"
                                    placeholder="+880 1700-000000"
                                    value={newUser.phone}
                                    onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-xs text-gray-800 outline-none focus:border-blue-600"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-gray-600 mb-1">Operational Role</label>
                                <select
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-xs text-gray-800 outline-none focus:border-blue-600 cursor-pointer"
                                >
                                    <option value="Fleet Supervisor">Fleet Supervisor</option>
                                    <option value="Dispatcher">Dispatcher</option>
                                    <option value="Maintenance Lead">Maintenance Lead</option>
                                    <option value="Viewer">Viewer Only</option>
                                </select>
                            </div>

                            <div className="flex justify-end space-x-2 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 cursor-pointer shadow-sm"
                                >
                                    Save User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}