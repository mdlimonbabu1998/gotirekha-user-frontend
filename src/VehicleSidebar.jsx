import React from 'react';

export default function VehicleSidebar({ vehicles, selectedVehicle, onSelectVehicle }) {
    return (
        <aside className="w-80 bg-white border-r border-gray-200 flex flex-col z-10 shadow-md">
            <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-700">Assigned Assets</h2>
                <input 
                    type="text" 
                    placeholder="Search vehicle..." 
                    className="mt-2 w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
                {vehicles.map((vehicle) => {
                    const isSelected = selectedVehicle?.id === vehicle.id;
                    return (
                        <div 
                            key={vehicle.id}
                            onClick={() => onSelectVehicle(vehicle)}
                            className={`p-4 cursor-pointer transition-colors ${isSelected ? 'bg-blue-50 border-l-4 border-blue-600' : 'hover:bg-gray-50'}`}
                        >
                            <div className="flex justify-between items-center">
                                <h3 className="font-medium text-gray-900">{vehicle.name}</h3>
                                <span className={`text-xs px-2 py-0.5 rounded ${vehicle.ignition ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                    {vehicle.ignition ? 'Engine ON' : 'Engine OFF'}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">IMEI: {vehicle.imei}</p>
                            <div className="mt-2 flex justify-between text-xs text-gray-600">
                                <span>Speed: <strong>{vehicle.speed} km/h</strong></span>
                                <span className="capitalize text-blue-600 font-medium">{vehicle.status}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </aside>
    );
}
