import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polygon, Circle, Popup, Polyline, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
    ChevronLeft, Search, Filter, Layers, Plus, MoreVertical,
    Wrench, Clock, History, Navigation, Eye, Share2, ShieldAlert, Route as RouteIcon, Video,
    Maximize2, Compass, MapPin, ZoomIn, ZoomOut,
    Grid, Type, Globe, Activity, Ruler
} from 'lucide-react';

// Functional Zoom Handler to update map zoom state dynamically
function ZoomHandler({ setZoom }) {
    useMapEvents({
        zoomend: (e) => {
            setZoom(e.target.getZoom());
        }
    });
    return null;
}
// Updated Ruler click handler with precise single-point undo
function RulerClickHandler({ enabled, rulerPoints, setRulerPoints, setTotalDistance }) {
    useMapEvents({
        click: (e) => {
            if (!enabled) return;
            const newPoint = [e.latlng.lat, e.latlng.lng];

            setRulerPoints((prevPoints) => {
                const updated = [...prevPoints, newPoint];

                // Calculate distance for the new set
                if (updated.length > 1) {
                    let dist = 0;
                    for (let i = 0; i < updated.length - 1; i++) {
                        const p1 = L.latLng(updated[i][0], updated[i][1]);
                        const p2 = L.latLng(updated[i + 1][0], updated[i + 1][1]);
                        dist += p1.distanceTo(p2);
                    }
                    setTotalDistance(dist);
                }
                return updated;
            });
        }
    });

    // Listen for Backspace or Escape to cleanly remove only the last node
    useEffect(() => {
        if (!enabled) return;
        const handleKeyDown = (e) => {
            if (e.key === 'Backspace' || e.key === 'Escape') {
                setRulerPoints((prevPoints) => {
                    if (prevPoints.length === 0) return prevPoints;

                    // Remove only the last point
                    const updated = prevPoints.slice(0, -1);

                    if (updated.length <= 1) {
                        setTotalDistance(0);
                    } else {
                        let dist = 0;
                        for (let i = 0; i < updated.length - 1; i++) {
                            const p1 = L.latLng(updated[i][0], updated[i][1]);
                            const p2 = L.latLng(updated[i + 1][0], updated[i + 1][1]);
                            dist += p1.distanceTo(p2);
                        }
                        setTotalDistance(dist);
                    }
                    return updated;
                });
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [enabled, setRulerPoints, setTotalDistance]);

    return null;
}
export default function LiveMap() {
    const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedVehicleId, setSelectedVehicleId] = useState('2');
    const [activeMenuId, setActiveMenuId] = useState(null);
    const [isBottomPanelOpen, setIsBottomPanelOpen] = useState(true);
    const [currentZoom, setCurrentZoom] = useState(13);
    // Ruler tool states
    const [rulerPoints, setRulerPoints] = useState([]);
    const [totalDistance, setTotalDistance] = useState(0);

    // Right-side toolbar toggles state
    const [toolToggles, setToolToggles] = useState({
        cluster: true,
        objects: true,
        nameSpeed: true,
        geofence: true,
        route: false,
        tails: false,
        ruler: false
    });

    const toggleTool = (key) => {
        setToolToggles(prev => ({ ...prev, [key]: !prev[key] }));
    };

    // Mock vehicle list state
    const [vehicles, setVehicles] = useState([
        {
            id: '1',
            name: 'Demo 14',
            status: 'offline',
            speed: 0,
            ignition: 'Off',
            lastUpdate: '2026-10-31 06:29:05',
            lat: 23.8103,
            lng: 90.4125,
            address: 'Mirpur DOHS, Dhaka',
            distance: '45,210.00 Km',
            iconType: 'arrow',
            checked: true
        },
        {
            id: '2',
            name: 'Demo 3',
            status: 'moving',
            speed: 44,
            ignition: 'On',
            lastUpdate: '2026-10-31 06:29:14',
            lat: 23.7936,
            lng: 90.4066,
            address: 'Gulshan 2 Circle, Dhaka',
            distance: '102,790.74 Km',
            iconType: 'car',
            checked: true
        }
    ]);

    // Mock Geofences data
    const [geofences, setGeofences] = useState([
        {
            id: 'g1',
            name: 'Gulshan Secure Zone',
            type: 'circle',
            center: [23.7936, 90.4066],
            radius: 800,
            color: '#ef4444'
        },
        {
            id: 'g2',
            name: 'Mirpur Depot',
            type: 'polygon',
            positions: [
                [23.8153, 90.4025],
                [23.8203, 90.4150],
                [23.8053, 90.4200]
            ],
            color: '#3b82f6'
        }
    ]);

    const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId) || vehicles[0];

    // Select All logic
    const allSelected = vehicles.length > 0 && vehicles.every(v => v.checked);
    const toggleSelectAll = () => {
        const nextState = !allSelected;
        setVehicles(vehicles.map(v => ({ ...v, checked: nextState })));
    };

    const toggleVehicleCheck = (id, e) => {
        e.stopPropagation();
        setVehicles(vehicles.map(v => v.id === id ? { ...v, checked: !v.checked } : v));
    };

    const filteredVehicles = vehicles.filter(v =>
        v.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Close menu on outside click
    useEffect(() => {
        const handleClickOutside = () => setActiveMenuId(null);
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    const checkedVehicles = vehicles.filter(v => v.checked);
    // Clustering only triggers when zoomed out (zoom < 11) and cluster tool is enabled
    const shouldCluster = toolToggles.cluster && currentZoom < 11 && checkedVehicles.length > 1;

    return (
        <div className="flex-1 flex flex-col h-screen w-full bg-slate-100 overflow-hidden relative">
            {/* Map Surface Area filling available space above telemetry */}
            <div className="relative flex-1 w-full overflow-hidden">
                <MapContainer
    center={[23.8103, 90.4125]}
    zoom={13}
    zoomControl={false}
    style={{ height: '100%', width: '100%' }}
    className="w-full h-full z-0"
>
    <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    />
    <ZoomHandler setZoom={setCurrentZoom} />

    {/* ADD RULER CLICK HANDLER HERE INSIDE MAP CONTAINER */}
    <RulerClickHandler
        enabled={toolToggles.ruler}
        rulerPoints={rulerPoints}
        setRulerPoints={setRulerPoints}
        setTotalDistance={setTotalDistance}
    />
<ZoomHandler setZoom={setCurrentZoom} />

    <RulerClickHandler
        enabled={toolToggles.ruler}
        rulerPoints={rulerPoints}
        setRulerPoints={setRulerPoints}
        setTotalDistance={setTotalDistance}
    />

    {/* RENDER RULER PATH, NODES, AND DISTANCE POPUP */}
    {toolToggles.ruler && rulerPoints.length > 0 && (
        <>
            <Polyline
                positions={rulerPoints}
                pathOptions={{ color: '#0284c7', weight: 3, dashArray: '6, 6' }}
            />

            {rulerPoints.map((pt, idx) => (
                <Marker
                    key={idx}
                    position={pt}
                    icon={L.divIcon({
                        className: 'ruler-node-marker',
                        html: `<div style="background: #0284c7; color: white; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
                        iconSize: [14, 14],
                        iconAnchor: [7, 7]
                    })}
                />
            ))}

            <Popup position={rulerPoints[rulerPoints.length - 1]}>
                <div className="text-xs font-semibold text-slate-800 mb-1">
                    Total Distance: {totalDistance > 1000 ? `${(totalDistance / 1000).toFixed(2)} km` : `${totalDistance.toFixed(0)} m`}
                </div>
                <div className="flex gap-1">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setRulerPoints((prev) => {
                                const updated = prev.slice(0, -1);
                                if (updated.length <= 1) setTotalDistance(0);
                                return updated;
                            });
                        }}
                        className="px-2 py-0.5 bg-amber-500 text-white rounded text-[10px] hover:bg-amber-600 transition-colors"
                    >
                        Undo Last
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setRulerPoints([]);
                            setTotalDistance(0);
                        }}
                        className="px-2 py-0.5 bg-red-500 text-white rounded text-[10px] hover:bg-red-600 transition-colors"
                    >
                        Clear All
                    </button>
                </div>
            </Popup>
        </>
    )}

    {/* Geofences Rendering */}
    ...
                    {toolToggles.geofence && geofences.map(geo => {
                        if (geo.type === 'circle') {
                            return (
                                <Circle
                                    key={geo.id}
                                    center={geo.center}
                                    radius={geo.radius}
                                    pathOptions={{ color: geo.color, fillColor: geo.color, fillOpacity: 0.2, weight: 2 }}
                                >
                                    <Popup>
                                        <div className="text-xs font-semibold">{geo.name}</div>
                                        <div className="text-[10px] text-slate-500">Radius: {geo.radius}m</div>
                                    </Popup>
                                </Circle>
                            );
                        } else if (geo.type === 'polygon') {
                            return (
                                <Polygon
                                    key={geo.id}
                                    positions={geo.positions}
                                    pathOptions={{ color: geo.color, fillColor: geo.color, fillOpacity: 0.2, weight: 2 }}
                                >
                                    <Popup>
                                        <div className="text-xs font-semibold">{geo.name}</div>
                                        <div className="text-[10px] text-slate-500">Operational Zone</div>
                                    </Popup>
                                </Polygon>
                            );
                        }
                        return null;
                    })}
{/* =============================================== */}
{/* RULER MEASUREMENT LAYER                         */}
{/* =============================================== */}
<RulerClickHandler
    enabled={toolToggles.ruler}
    rulerPoints={rulerPoints}
    setRulerPoints={setRulerPoints}
    setTotalDistance={setTotalDistance}
/>

{toolToggles.ruler && rulerPoints.length > 0 && (
    <>
        <Polyline
            positions={rulerPoints}
            pathOptions={{ color: '#0284c7', weight: 3, dashArray: '6, 6' }}
        />

        {rulerPoints.map((pt, idx) => (
            <Marker
                key={idx}
                position={pt}
                icon={L.divIcon({
                    className: 'ruler-node-marker',
                    html: `<div style="background: #0284c7; color: white; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
                    iconSize: [14, 14],
                    iconAnchor: [7, 7]
                })}
            />
        ))}

        <Popup position={rulerPoints[rulerPoints.length - 1]}>
            <div className="text-xs font-semibold text-slate-800">
                Total Distance: {totalDistance > 1000 ? `${(totalDistance / 1000).toFixed(2)} km` : `${totalDistance.toFixed(0)} m`}
            </div>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setRulerPoints([]);
                    setTotalDistance(0);
                }}
                className="mt-1 px-2 py-0.5 bg-red-500 text-white rounded text-[10px] hover:bg-red-600 transition-colors"
            >
                Clear Measurement
            </button>
        </Popup>
    </>
)}
                    {/* Vehicle Markers Rendering */}
                    {toolToggles.objects && (
                        shouldCluster ? (
                            <Marker
                                position={[23.8019, 90.4095]}
                                icon={L.divIcon({
                                    className: 'custom-cluster-badge',
                                    html: `
                                        <div style="background: #0284c7; color: white; width: 36px; height: 36px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 13px;">
                                            ${checkedVehicles.length}
                                        </div>
                                    `,
                                    iconSize: [36, 36],
                                    iconAnchor: [18, 18]
                                })}
                            />
                        ) : (
                            checkedVehicles.map(vehicle => {
                                const customIcon = L.divIcon({
                                    className: 'custom-vehicle-marker',
                                    html: `
                                        <div style="position: relative; width: 0; height: 0;">
                                            ${toolToggles.nameSpeed ? `
                                                <div style="position: absolute; bottom: 18px; left: 50%; transform: translateX(-50%); background: white; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; color: #1e293b; box-shadow: 0 2px 6px rgba(0,0,0,0.15); border: 1px solid #cbd5e1; text-align: center; white-space: nowrap; pointer-events: none;">
                                                    ${vehicle.name} (${vehicle.speed} kph)
                                                </div>
                                            ` : ''}
                                            <div style="position: absolute; top: -14px; left: -14px; width: 28px; height: 28px; background: ${vehicle.speed > 0 ? '#10b981' : '#f59e0b'}; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.25); display: flex; align-items: center; justify-content: center; color: white;">
                                                ${vehicle.iconType === 'car' ? '🚗' : '⬆️'}
                                            </div>
                                        </div>
                                    `,
                                    iconSize: [0, 0],
                                    iconAnchor: [0, 0]
                                });

                                return (
                                    <Marker
                                        key={vehicle.id}
                                        position={[vehicle.lat, vehicle.lng]}
                                        icon={customIcon}
                                        eventHandlers={{
                                            click: () => setSelectedVehicleId(vehicle.id)
                                        }}
                                    />
                                );
                            })
                        )
                    )}
                </MapContainer>

                {/* =================================================== */}
                {/* 2. TOP-LEFT FLOATING OBJECTS / VEHICLES PANEL       */}
                {/* =================================================== */}
                <div className={`absolute top-4 left-4 z-10 transition-all duration-300 ${
                    isLeftPanelOpen ? 'w-80 sm:w-96' : 'w-12'
                }`}>
                    <div className="relative bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/80">
                        {/* Panel Header */}
                        <div className="p-3 bg-slate-50/80 border-b border-slate-200/60 flex items-center justify-between rounded-t-2xl">
                            <button
                                onClick={() => setIsLeftPanelOpen(!isLeftPanelOpen)}
                                className="p-1.5 hover:bg-slate-200/60 rounded-lg text-slate-600 transition-colors flex items-center gap-2"
                            >
                                <ChevronLeft size={18} className={`transform transition-transform ${!isLeftPanelOpen ? 'rotate-180' : ''}`} />
                                {isLeftPanelOpen && <span className="font-bold text-xs uppercase tracking-wider text-slate-700">Objects ({vehicles.length})</span>}
                            </button>

                            {isLeftPanelOpen && (
                                <div className="flex items-center gap-1.5">
                                    <button className="p-1.5 hover:bg-slate-200/60 rounded-lg text-slate-600 transition-colors" title="Filter"><Filter size={15} /></button>
                                    <button className="p-1.5 hover:bg-slate-200/60 rounded-lg text-slate-600 transition-colors" title="Group View"><Layers size={15} /></button>
                                    <button className="p-1.5 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors shadow-sm" title="Add Object"><Plus size={15} /></button>
                                    <button className="p-1.5 hover:bg-slate-200/60 rounded-lg text-slate-600 transition-colors" title="Menu"><MoreVertical size={15} /></button>
                                </div>
                            )}
                        </div>

                        {isLeftPanelOpen && (
                            <>
                                {/* Search & Select All Bar */}
                                <div className="p-3 border-b border-slate-100 bg-slate-50/50 flex flex-col gap-2.5">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Search vehicles, plates..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between px-1 text-xs text-slate-600">
                                        <label className="flex items-center gap-2 cursor-pointer font-medium">
                                            <input
                                                type="checkbox"
                                                checked={allSelected}
                                                onChange={toggleSelectAll}
                                                className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 cursor-pointer"
                                            />
                                            Select All
                                        </label>
                                        <span className="text-slate-400 font-mono">{vehicles.filter(v => v.checked).length} selected</span>
                                    </div>
                                </div>

                                {/* Group Header */}
                                <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between bg-white/40 text-xs text-slate-600">
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-sky-600" />
                                        <span className="font-semibold">Ungrouped</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-400 font-mono">{vehicles.length}</span>
                                        <MoreVertical className="w-3.5 h-3.5 text-slate-400 cursor-pointer" />
                                    </div>
                                </div>

                                {/* Vehicle List Items */}
                                <div className="p-2 max-h-[50vh] overflow-y-auto space-y-2">
                                    {filteredVehicles.map((vehicle) => {
                                        const getEngineStatus = (v) => {
                                            if (v.status === 'offline') return { bg: 'bg-slate-100 border-slate-200', text: 'text-slate-400', label: 'Offline' };
                                            if (v.speed > 0) return { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-600', label: 'Moving' };
                                            return { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-500', label: 'Idle' };
                                        };

                                        const engine = getEngineStatus(vehicle);

                                        return (
                                            <div
                                                key={vehicle.id}
                                                onClick={() => setSelectedVehicleId(vehicle.id)}
                                                className={`relative flex items-center justify-between p-3 pr-4 rounded-xl cursor-pointer transition-all border ${
                                                    vehicle.id === selectedVehicleId
                                                        ? 'bg-sky-50/80 border-sky-300 shadow-sm'
                                                        : 'bg-white/60 hover:bg-white border-slate-100'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="checkbox"
                                                        checked={vehicle.checked}
                                                        onChange={(e) => toggleVehicleCheck(vehicle.id, e)}
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 cursor-pointer"
                                                    />
                                                    <div>
                                                        <div className="font-semibold text-slate-800 text-sm">{vehicle.name}</div>
                                                        <div className="text-slate-400 text-[11px]">{vehicle.lastUpdate}</div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2.5">
                                                    <div
                                                        className={`p-1.5 rounded-lg border flex items-center justify-center ${engine.bg} ${engine.text}`}
                                                        title={`Engine Status: ${engine.label}`}
                                                    >
                                                        <Wrench className="w-4 h-4" />
                                                    </div>

                                                    <span className="text-xs font-medium text-slate-600 font-mono">{vehicle.speed} kph</span>
                                                    <span className={`w-2 h-2 rounded-full ${vehicle.speed > 0 ? 'bg-emerald-500' : 'bg-amber-500'}`} />

                                                    {/* Three-Dot Action Dropdown Button */}
                                                    <div className="relative">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                const rect = e.currentTarget.getBoundingClientRect();
                                                                setActiveMenuId(activeMenuId?.id === vehicle.id ? null : { id: vehicle.id, top: rect.top });
                                                            }}
                                                            className="p-1 hover:bg-slate-200/60 rounded-lg text-slate-500 transition-colors"
                                                        >
                                                            <MoreVertical className="w-4 h-4" />
                                                        </button>

                                                        {/* Action Menu Popup */}
                                                        {activeMenuId?.id === vehicle.id && (
                                                            <div
                                                                style={{ top: `${Math.min(activeMenuId.top, window.innerHeight - 400)}px` }}
                                                                className="fixed left-[370px] w-52 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-slate-200/90 py-2 z-[99999] text-xs text-slate-700 animate-in fade-in zoom-in-95 duration-100"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <div className="px-4 py-2 hover:bg-sky-50 hover:text-sky-600 flex items-center gap-2.5 cursor-pointer transition-colors">
                                                                    <Clock className="w-4 h-4 text-slate-400" /> Show history last hour
                                                                </div>
                                                                <div className="px-4 py-2 hover:bg-sky-50 hover:text-sky-600 flex items-center gap-2.5 cursor-pointer transition-colors">
                                                                    <Clock className="w-4 h-4 text-slate-400" /> Show history today
                                                                </div>
                                                                <div className="px-4 py-2 hover:bg-sky-50 hover:text-sky-600 flex items-center gap-2.5 cursor-pointer transition-colors">
                                                                    <History className="w-4 h-4 text-slate-400" /> Show history yesterday
                                                                </div>
                                                                <div className="border-t border-slate-100 my-1" />
                                                                <div className="px-4 py-2 hover:bg-sky-50 hover:text-sky-600 flex items-center gap-2.5 cursor-pointer transition-colors">
                                                                    <Navigation className="w-4 h-4 text-slate-400" /> Send command
                                                                </div>
                                                                <div className="px-4 py-2 hover:bg-sky-50 hover:text-sky-600 flex items-center gap-2.5 cursor-pointer transition-colors">
                                                                    <Eye className="w-4 h-4 text-slate-400" /> Follow
                                                                </div>
                                                                <div className="px-4 py-2 hover:bg-sky-50 hover:text-sky-600 flex items-center gap-2.5 cursor-pointer transition-colors">
                                                                    <Share2 className="w-4 h-4 text-slate-400" /> Sharing
                                                                </div>
                                                                <div className="px-4 py-2 hover:bg-sky-50 hover:text-sky-600 flex items-center gap-2.5 cursor-pointer transition-colors">
                                                                    <Share2 className="w-4 h-4 text-slate-400" /> Sharings
                                                                </div>
                                                                <div className="px-4 py-2 hover:bg-sky-50 hover:text-sky-600 flex items-center gap-2.5 cursor-pointer transition-colors">
                                                                    <ShieldAlert className="w-4 h-4 text-slate-400" /> Alerts
                                                                </div>
                                                                <div className="px-4 py-2 hover:bg-sky-50 hover:text-sky-600 flex items-center gap-2.5 cursor-pointer transition-colors">
                                                                    <RouteIcon className="w-4 h-4 text-slate-400" /> Route types
                                                                </div>
                                                                <div className="px-4 py-2 hover:bg-sky-50 hover:text-sky-600 flex items-center gap-2.5 cursor-pointer transition-colors">
                                                                    <Video className="w-4 h-4 text-slate-400" /> Camera / Media
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* =================================================== */}
                {/* 3. RIGHT-SIDE FLOATING TOOLBAR CONTROLS             */}
                {/* =================================================== */}
                <div className="absolute top-4 right-4 z-10 flex flex-col bg-white/90 backdrop-blur-md p-1.5 rounded-2xl shadow-xl border border-slate-200/80 gap-1 text-slate-700">
                    <button
                        onClick={() => toggleTool('cluster')}
                        className={`p-2 rounded-xl transition-colors ${toolToggles.cluster ? 'bg-sky-100 text-sky-600' : 'hover:bg-sky-50 hover:text-sky-600'}`}
                        title="Cluster Enable/Disable"
                    >
                        <Grid size={18} />
                    </button>
                    <button
                        onClick={() => toggleTool('objects')}
                        className={`p-2 rounded-xl transition-colors ${toolToggles.objects ? 'bg-sky-100 text-sky-600' : 'hover:bg-sky-50 hover:text-sky-600'}`}
                        title="Object Enable/Disable"
                    >
                        <MapPin size={18} />
                    </button>
                    <button
                        onClick={() => toggleTool('nameSpeed')}
                        className={`p-2 rounded-xl transition-colors ${toolToggles.nameSpeed ? 'bg-sky-100 text-sky-600' : 'hover:bg-sky-50 hover:text-sky-600'}`}
                        title="Object Name & Speed"
                    >
                        <Type size={18} />
                    </button>
                    <button
                        onClick={() => toggleTool('geofence')}
                        className={`p-2 rounded-xl transition-colors ${toolToggles.geofence ? 'bg-sky-100 text-sky-600' : 'hover:bg-sky-50 hover:text-sky-600'}`}
                        title="Geofence Enable/Disable"
                    >
                        <Globe size={18} />
                    </button>
                    <button
                        onClick={() => toggleTool('route')}
                        className={`p-2 rounded-xl transition-colors ${toolToggles.route ? 'bg-sky-100 text-sky-600' : 'hover:bg-sky-50 hover:text-sky-600'}`}
                        title="Route Enable/Disable"
                    >
                        <RouteIcon size={18} />
                    </button>
                    <button
                        onClick={() => toggleTool('tails')}
                        className={`p-2 rounded-xl transition-colors ${toolToggles.tails ? 'bg-sky-100 text-sky-600' : 'hover:bg-sky-50 hover:text-sky-600'}`}
                        title="Tails Enable/Disable"
                    >
                        <Activity size={18} />
                    </button>
                    <button
                        onClick={() => toggleTool('ruler')}
                        className={`p-2 rounded-xl transition-colors ${toolToggles.ruler ? 'bg-sky-100 text-sky-600' : 'hover:bg-sky-50 hover:text-sky-600'}`}
                        title="Ruler Enable/Disable"
                    >
                        <Ruler size={18} />
                    </button>
                    <div className="border-t border-slate-200 my-1" />
                    <button className="p-2 hover:bg-sky-50 hover:text-sky-600 rounded-xl transition-colors" title="Fullscreen"><Maximize2 size={18} /></button>
                    <button className="p-2 hover:bg-sky-50 hover:text-sky-600 rounded-xl transition-colors" title="Compass"><Compass size={18} /></button>
                    <button className="p-2 hover:bg-sky-50 hover:text-sky-600 rounded-xl transition-colors" title="Layers"><Layers size={18} /></button>
                    <div className="border-t border-slate-200 my-1" />
                    <button className="p-2 hover:bg-sky-50 hover:text-sky-600 rounded-xl transition-colors" title="Zoom In"><ZoomIn size={18} /></button>
                    <button className="p-2 hover:bg-sky-50 hover:text-sky-600 rounded-xl transition-colors" title="Zoom Out"><ZoomOut size={18} /></button>
                </div>
            </div>

            {/* =================================================== */}
            {/* 4. BOTTOM TELEMETRY & INSIGHTS PANEL                */}
            {/* =================================================== */}
            <div className="relative z-20 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl p-4 shrink-0">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                    <div className="flex items-center gap-3">
                        <span className={`w-2.5 h-2.5 rounded-full ${selectedVehicle.speed > 0 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        <span className="font-bold text-sm text-slate-800">LIVE TELEMETRY & INSIGHTS — {selectedVehicle.name.toUpperCase()}</span>
                    </div>
                    <button
                        onClick={() => setIsBottomPanelOpen(!isBottomPanelOpen)}
                        className="text-slate-400 hover:text-slate-600 text-xs font-semibold flex items-center gap-1"
                    >
                        <ChevronLeft size={16} className={`transform transition-transform ${isBottomPanelOpen ? '-rotate-90' : 'rotate-90'}`} />
                    </button>
                </div>

                {isBottomPanelOpen && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                        {/* Location Card */}
                        <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/60 flex flex-col gap-1.5">
                            <div className="font-semibold text-slate-700 flex items-center gap-1.5 border-b border-slate-200/50 pb-1">
                                <MapPin size={13} className="text-sky-600" /> Location
                            </div>
                            <div className="text-slate-600 truncate"><span className="font-medium text-slate-500">Address:</span> {selectedVehicle.address}</div>
                            <div className="text-slate-600"><span className="font-medium text-slate-500">Time:</span> {selectedVehicle.lastUpdate}</div>
                            <div className="text-slate-600"><span className="font-medium text-slate-500">Driver:</span> Not Assigned</div>
                        </div>

                        {/* Sensors Card */}
                        <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/60 flex flex-col gap-1.5">
                            <div className="font-semibold text-slate-700 flex items-center gap-1.5 border-b border-slate-200/50 pb-1">
                                <Wrench size={13} className="text-emerald-600" /> Sensors
                            </div>
                            <div className="flex justify-between text-slate-600"><span className="font-medium text-slate-500">Speed:</span> <span className="font-mono font-semibold">{selectedVehicle.speed} kph</span></div>
                            <div className="flex justify-between text-slate-600"><span className="font-medium text-slate-500">Odometer:</span> <span className="font-mono">{selectedVehicle.distance}</span></div>
                            <div className="flex justify-between text-slate-600"><span className="font-medium text-slate-500">Ignition:</span> <span className={`font-semibold ${selectedVehicle.ignition === 'On' ? 'text-emerald-600' : 'text-slate-400'}`}>{selectedVehicle.ignition}</span></div>
                        </div>

                        {/* Services Card */}
                        <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/60 flex flex-col justify-between">
                            <div>
                                <div className="font-semibold text-slate-700 flex items-center gap-1.5 border-b border-slate-200/50 pb-1 mb-2">
                                    <Wrench size={13} className="text-amber-600" /> Services
                                </div>
                                <div className="text-slate-400 text-center py-2">No active service tasks</div>
                            </div>
                            <button className="w-full py-1.5 bg-white border border-sky-300 text-sky-600 rounded-lg font-medium hover:bg-sky-50 transition-colors shadow-sm">
                                + Add service
                            </button>
                        </div>

                        {/* Camera / Media Card */}
                        <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/60 flex flex-col justify-between">
                            <div>
                                <div className="font-semibold text-slate-700 flex items-center gap-1.5 border-b border-slate-200/50 pb-1 mb-2">
                                    <Video size={13} className="text-indigo-600" /> Dash Cam
                                </div>
                                <div className="text-slate-400 text-center py-3">Dash cam model unlinked</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}