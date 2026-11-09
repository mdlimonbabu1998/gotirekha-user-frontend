import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import {
    Calendar,
    Download,
    ChevronDown,
    RotateCcw,
    Maximize,
    Layers,
    ChevronUp,
    ChevronDown as ChevronDownIcon,
    Play,
    Pause,
    Search,
    TrafficCone
} from 'lucide-react';

// Fix Leaflet marker icons
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

export default function History() {
    const [vehicles] = useState([
        { id: 1, name: 'CHATTO-METRO-K-45' },
        { id: 2, name: 'DHAKA-METRO-G-11' },
        { id: 3, name: 'Limon Bike' }
    ]);
    const [selectedDevice, setSelectedDevice] = useState('CHATTO-METRO-K-45');
    const [vehicleDropdownOpen, setVehicleDropdownOpen] = useState(false);
    const [vehicleSearch, setVehicleSearch] = useState('');

    const [fromDate, setFromDate] = useState('2026-11-03 09:00');
    const [toDate, setToDate] = useState('2026-11-03 18:59');

    const [showAdvanced, setShowAdvanced] = useState(false);
    const [stopDurationFilter, setStopDurationFilter] = useState('> 3 min');
    const [showInvalidCoords, setShowInvalidCoords] = useState(true);

    const [activeTab, setActiveTab] = useState('Speed');
    const [isGraphVisible, setIsGraphVisible] = useState(true);

    // Playback & Scrubber Slider States
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const animationRef = useRef(null);

    // Map Tools & Fullscreen Ref
    const mapContainerRef = useRef(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [mapLayer, setMapLayer] = useState('streets');
    const [showTraffic, setShowTraffic] = useState(false);

    const historyPoints = [
        {
            lat: 23.8103,
            lng: 90.4125,
            time: '09:00 AM',
            departed: '02:08 PM',
            duration: '4 hr 58 min 4 sec',
            speed: 0,
            status: 'engine_off',
            altitude: 12,
            address: 'House no, 06 Rd 4, Dhaka, Bangladesh'
        },
        {
            lat: 23.8150,
            lng: 90.4180,
            time: '11:30 AM',
            departed: '11:45 AM',
            duration: '15 min 0 sec',
            speed: 45,
            status: 'moving',
            altitude: 15,
            address: 'Road No. 7, Mirpur DOHS, Dhaka'
        },
        {
            lat: 23.8200,
            lng: 90.4220,
            time: '02:35 PM',
            departed: '03:00 PM',
            duration: '25 min 0 sec',
            speed: 52,
            status: 'moving',
            altitude: 14,
            address: 'Avenue 5, Brindaban, Dhaka'
        },
        {
            lat: 23.8250,
            lng: 90.4300,
            time: '06:59 PM',
            departed: '06:59 PM',
            duration: '0 sec',
            speed: 0,
            status: 'engine_off',
            altitude: 10,
            address: 'Bashundhara Gate, Dhaka'
        },
    ];

    const filteredVehicles = vehicles.filter(v => v.name.toLowerCase().includes(vehicleSearch.toLowerCase()));
    const polylinePositions = historyPoints.map(pt => [pt.lat, pt.lng]);
    const currentTelemetry = historyPoints[currentIndex] || historyPoints[0];

    // Playback loop effect
    useEffect(() => {
        if (isPlaying) {
            animationRef.current = setInterval(() => {
                setCurrentIndex((prev) => {
                    if (prev >= historyPoints.length - 1) {
                        setIsPlaying(false);
                        return prev;
                    }
                    return prev + 1;
                });
            }, 1500 / playbackSpeed);
        } else {
            clearInterval(animationRef.current);
        }
        return () => clearInterval(animationRef.current);
    }, [isPlaying, playbackSpeed, historyPoints.length]);

    const handleSliderChange = (e) => {
        setIsPlaying(false);
        setCurrentIndex(parseInt(e.target.value, 10));
    };

    // Working Fullscreen Toggle Handler
    const toggleFullscreen = () => {
        if (!mapContainerRef.current) return;
        if (!document.fullscreenElement) {
            mapContainerRef.current.requestFullscreen().catch(err => {
                alert(`Error attempting to enable fullscreen: ${err.message}`);
            });
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    return (
        <div ref={mapContainerRef} className="relative w-full h-full bg-gray-100 overflow-hidden font-sans flex flex-col">

            <div className="relative flex-1 w-full h-full">

                {/* 1. LEFT HISTORY FILTER PANEL */}
                <div className="absolute top-4 left-4 z-[1000] w-80 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden max-h-[92vh] flex flex-col">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
                        <div className="flex items-center space-x-2">
                            <RotateCcw size={18} className="text-gray-500" />
                            <h2 className="font-bold text-gray-800 text-base">History</h2>
                        </div>
                    </div>

                    <div className="p-4 space-y-4 text-xs overflow-y-auto flex-1">

                        <div className="relative">
                            <label className="block text-gray-500 font-medium mb-1">Device</label>
                            <div
                                onClick={() => setVehicleDropdownOpen(!vehicleDropdownOpen)}
                                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 font-semibold flex justify-between items-center cursor-pointer shadow-sm"
                            >
                                <span>{selectedDevice}</span>
                                <ChevronDown size={14} className="text-gray-500" />
                            </div>

                            {vehicleDropdownOpen && (
                                <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-2xl z-50 p-2 space-y-2">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Search vehicle..."
                                            value={vehicleSearch}
                                            onChange={(e) => setVehicleSearch(e.target.value)}
                                            className="w-full border border-gray-300 rounded px-2 py-1.5 pl-7 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                            autoFocus
                                        />
                                        <Search size={12} className="absolute left-2 top-2.5 text-gray-400" />
                                    </div>
                                    <div className="max-h-36 overflow-y-auto space-y-1">
                                        {filteredVehicles.map(v => (
                                            <div
                                                key={v.id}
                                                onClick={() => {
                                                    setSelectedDevice(v.name);
                                                    setVehicleDropdownOpen(false);
                                                    setVehicleSearch('');
                                                }}
                                                className={`px-2 py-1.5 rounded cursor-pointer hover:bg-cyan-50 font-medium text-gray-700 ${selectedDevice === v.name ? 'bg-cyan-100 text-cyan-800 font-bold' : ''}`}
                                            >
                                                {v.name}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="block text-gray-500 font-medium">Date & Time Range</label>
                            <div className="space-y-1.5">
                                <div>
                                    <span className="text-[10px] text-gray-400 font-medium">From:</span>
                                    <input
                                        type="datetime-local"
                                        value={fromDate.replace(' ', 'T')}
                                        onChange={(e) => setFromDate(e.target.value.replace('T', ' '))}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    />
                                </div>
                                <div>
                                    <span className="text-[10px] text-gray-400 font-medium">To:</span>
                                    <input
                                        type="datetime-local"
                                        value={toDate.replace(' ', 'T')}
                                        onChange={(e) => setToDate(e.target.value.replace('T', ' '))}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <button
                                onClick={() => setShowAdvanced(!showAdvanced)}
                                className="text-cyan-600 font-bold flex items-center space-x-1 hover:underline text-[11px]"
                            >
                                <span>Advanced</span>
                                <ChevronDown size={14} className={`transform transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                            </button>

                            {showAdvanced && (
                                <div className="mt-2 p-2.5 bg-gray-50 rounded-lg border border-gray-200 space-y-2 text-[11px]">
                                    <div>
                                        <label className="text-gray-500 font-medium block mb-1">Stops</label>
                                        <select
                                            value={stopDurationFilter}
                                            onChange={(e) => setStopDurationFilter(e.target.value)}
                                            className="w-full border border-gray-300 rounded px-2 py-1 bg-white font-medium"
                                        >
                                            <option value="> 3 min">&gt; 3 min</option>
                                            <option value="> 5 min">&gt; 5 min</option>
                                            <option value="> 10 min">&gt; 10 min</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center space-x-2 pt-1">
                                        <input
                                            type="checkbox"
                                            id="invalidCoords"
                                            checked={showInvalidCoords}
                                            onChange={(e) => setShowInvalidCoords(e.target.checked)}
                                            className="rounded text-cyan-600 focus:ring-cyan-500"
                                        />
                                        <label htmlFor="invalidCoords" className="text-gray-700 font-medium cursor-pointer">Show invalid coordinates</label>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center space-x-2 pt-1">
                            <button className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2.5 rounded-lg shadow-sm transition-all text-center">
                                Show history
                            </button>
                            <button className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-all" title="Export">
                                <Download size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* 2. RIGHT-SIDE MAP TOOLS (Fullscreen, Layer, and Traffic Signal Tool) */}
                <div className="absolute top-4 right-4 z-[1000] flex flex-col space-y-2 bg-white rounded-xl shadow-xl border border-gray-200 p-1.5">
                    <button
                        onClick={toggleFullscreen}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                        title="Toggle Fullscreen"
                    >
                        <Maximize size={18} />
                    </button>
                    <button
                        onClick={() => setMapLayer(prev => prev === 'streets' ? 'satellite' : 'streets')}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                        title="Map Layer"
                    >
                        <Layers size={18} />
                    </button>
                    <button
                        onClick={() => setShowTraffic(!showTraffic)}
                        className={`p-2 rounded-lg transition-colors ${showTraffic ? 'bg-cyan-100 text-cyan-600' : 'hover:bg-gray-100 text-gray-600'}`}
                        title="Traffic Signal / Layer"
                    >
                        <TrafficCone size={18} />
                    </button>
                </div>

                {/* 3. LEAFLET MAP */}
                <MapContainer
                    center={[historyPoints[currentIndex].lat, historyPoints[currentIndex].lng]}
                    zoom={14}
                    scrollWheelZoom={true}
                    zoomControl={false}
                    className="w-full h-full z-0"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url={mapLayer === 'streets'
                            ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            : "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        }
                    />

                    <Polyline positions={polylinePositions} color="#06b6d4" weight={5} opacity={0.8} />

                    {historyPoints.map((pt, idx) => (
                        <Marker
                            key={idx}
                            position={[pt.lat, pt.lng]}
                            eventHandlers={{
                                click: () => {
                                    setIsPlaying(false);
                                    setCurrentIndex(idx);
                                }
                            }}
                        >
                            <Popup className="custom-popup" maxWidth={320}>
                                <div className="text-xs space-y-1.5 p-1">
                                    <h3 className="font-bold text-gray-900 border-b pb-1">Event Details</h3>
                                    <p><strong className="text-gray-600">Vehicle:</strong> <span className="font-semibold text-gray-900">{selectedDevice}</span></p>
                                    <p><strong className="text-gray-600">Address:</strong> <span className="text-gray-800">{pt.address}</span></p>
                                    <p><strong className="text-gray-600">Status:</strong> <span className="text-red-600 font-medium">{pt.status}</span></p>
                                    <p><strong className="text-gray-600">Arrived:</strong> <span className="text-gray-800">{pt.time}</span></p>
                                    <p><strong className="text-gray-600">Departed:</strong> <span className="text-gray-800">{pt.departed}</span></p>
                                    <p><strong className="text-gray-600">Duration:</strong> <span className="text-gray-800">{pt.duration}</span></p>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>

            {/* 4. BOTTOM BAR */}
            <div className="bg-white border-t border-gray-200 z-[1000] shadow-2xl flex flex-col shrink-0 transition-all">
                <div className="flex flex-wrap items-center justify-between px-6 py-2 border-b border-gray-100 bg-gray-50 gap-2">

                    {/* LEFT CONTROLS */}
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => setIsGraphVisible(!isGraphVisible)}
                            className="flex items-center space-x-1 text-xs font-bold text-cyan-600 hover:text-cyan-700 bg-white border border-gray-200 px-2.5 py-1.5 rounded shadow-sm transition-all"
                        >
                            <span>{isGraphVisible ? 'Hide Graph' : 'Show Graph'}</span>
                            {isGraphVisible ? <ChevronDownIcon size={14} /> : <ChevronUp size={14} />}
                        </button>

                        <div className="flex items-center space-x-1 bg-white border border-gray-200 px-2 py-1 rounded-lg">
                            <span className="text-[10px] font-bold text-gray-400 mr-1">Speed:</span>
                            {[1, 2, 3, 4].map((spd) => (
                                <button
                                    key={spd}
                                    onClick={() => setPlaybackSpeed(spd)}
                                    className={`px-2 py-0.5 text-xs font-bold rounded transition-all ${
                                        playbackSpeed === spd
                                            ? 'bg-cyan-500 text-white shadow-sm'
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    {spd}x
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => {
                                if (currentIndex >= historyPoints.length - 1) setCurrentIndex(0);
                                setIsPlaying(!isPlaying);
                            }}
                            className="flex items-center space-x-1.5 bg-cyan-500 hover:bg-cyan-600 text-white px-3.5 py-1.5 rounded text-xs font-bold shadow transition-all"
                        >
                            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                            <span>{isPlaying ? 'Pause' : 'Play History'}</span>
                        </button>
                    </div>

                    {/* TIMELINE RANGE SLIDER */}
                    <div className="flex-1 max-w-md mx-4 flex flex-col justify-center">
                        <div className="relative flex items-center">
                            <input
                                type="range"
                                min="0"
                                max={historyPoints.length - 1}
                                value={currentIndex}
                                onChange={handleSliderChange}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                            />
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-500 font-semibold px-1 mt-0.5">
                            <span>09:00 AM</span>
                            <span>06:59 PM</span>
                        </div>
                    </div>

                    {/* HISTORY SUMMARY CARD AT BOTTOM RIGHT */}
                    <div className="flex items-center space-x-4 bg-gray-50 border border-gray-200 px-3 py-1 rounded-lg text-xs">
                        <div>
                            <span className="text-gray-400 text-[9px] block">Route length</span>
                            <span className="font-bold text-gray-800">14.25 Km</span>
                        </div>
                        <div>
                            <span className="text-gray-400 text-[9px] block">Top speed</span>
                            <span className="font-bold text-cyan-600">52 kph</span>
                        </div>
                        <div>
                            <span className="text-gray-400 text-[9px] block">Stop duration</span>
                            <span className="font-bold text-gray-800">4h 58m</span>
                        </div>
                        <div className="border-l pl-3">
                            <span className="text-gray-400 text-[9px] block">Time</span>
                            <span className="font-semibold text-gray-800">{currentTelemetry.time}</span>
                        </div>
                    </div>
                </div>

                {/* GRAPH PANEL */}
                {isGraphVisible && (
                    <div className="h-40 flex flex-col">
                        <div className="flex items-center justify-between px-6 py-1.5 border-b border-gray-100 bg-gray-50/50">
                            <div className="flex items-center space-x-6 text-xs font-bold">
                                <button
                                    onClick={() => setActiveTab('Speed')}
                                    className={`py-1 border-b-2 transition-all ${activeTab === 'Speed' ? 'border-cyan-500 text-cyan-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                                >
                                    Speed
                                </button>
                                <button
                                    onClick={() => setActiveTab('Altitude')}
                                    className={`py-1 border-b-2 transition-all ${activeTab === 'Altitude' ? 'border-cyan-500 text-cyan-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                                >
                                    Altitude
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 p-3 relative flex items-end justify-between bg-white overflow-hidden">
                            <div className="absolute left-4 top-2 bottom-6 flex flex-col justify-between text-[10px] text-gray-400 font-medium">
                                <span>80 kph</span>
                                <span>60 kph</span>
                                <span>40 kph</span>
                                <span>20 kph</span>
                                <span>0 kph</span>
                            </div>

                            <div className="ml-16 mr-4 flex-1 h-full flex items-end space-x-0.5 border-b border-gray-200 pb-1">
                                {Array.from({ length: 120 }).map((_, i) => {
                                    const height = Math.sin(i * 0.15) * 40 + Math.random() * 30 + 10;
                                    const isActive = Math.floor((currentIndex / historyPoints.length) * 120) === i;
                                    return (
                                        <div
                                            key={i}
                                            style={{ height: `${height}%` }}
                                            className={`flex-1 transition-colors ${isActive ? 'bg-cyan-600' : 'bg-gray-400 hover:bg-cyan-500 opacity-70'}`}
                                        />
                                    );
                                })}
                            </div>
                        </div>

                        <div className="ml-20 mr-8 pb-1 flex justify-between text-[10px] text-gray-400 font-medium border-t border-gray-100 pt-1">
                            <span>09:00 AM</span><span>11:15 AM</span><span>01:30 PM</span><span>03:45 PM</span><span>06:59 PM</span>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
}