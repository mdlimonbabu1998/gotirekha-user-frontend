import L from "leaflet";
import {
  Check,
  Edit3,
  Eye,
  Layers,
  Plus,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import { useState } from "react";
import {
  Circle,
  MapContainer,
  Marker,
  Polygon,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";

// Helper component to handle map clicks for circle center or polygon vertices
function MapClickHandler({ active, creationType, onMapClick }) {
  useMapEvents({
    click: (e) => {
      if (!active) return;
      onMapClick(e.latlng);
    },
  });
  return null;
}

export default function GeofencesModule() {
  // Geofences state with mock assigned vehicles
  const [geofences, setGeofences] = useState([
    {
      id: 1,
      name: "Uttara Main Depot",
      type: "Circle",
      lat: 23.8103,
      lng: 90.4125,
      radius: 2000, // 2 km in meters
      color: "#2563eb",
      speedLimit: "80",
      status: "Active",
      assignedVehicles: [
        {
          id: "v1",
          name: "Truck-01 (DHAKA-METRO-11)",
          driver: "Rahim Mia",
          status: "Inside",
        },
        {
          id: "v2",
          name: "Pickup-04 (DHAKA-METRO-22)",
          driver: "Karim Ullah",
          status: "Near Boundary",
        },
      ],
    },
    {
      id: 2,
      name: "Gulshan Corporate Zone",
      type: "Polygon",
      positions: [
        [23.795, 90.4],
        [23.8, 90.41],
        [23.79, 90.415],
        [23.785, 90.405],
      ],
      color: "#16a34a",
      speedLimit: "60",
      status: "Active",
      assignedVehicles: [
        {
          id: "v3",
          name: "Delivery Van-09 (SYLHET-METRO-88)",
          driver: "Jashim Uddin",
          status: "Inside",
        },
      ],
    },
  ]);

  // Creation / Edit Form & Modal States
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("Circle"); // 'Circle' or 'Polygon'
  const [newRadiusKm, setNewRadiusKm] = useState("2"); // Radius in KM
  const [newSpeedLimit, setNewSpeedLimit] = useState("80");
  const [newColor, setNewColor] = useState("#2563eb");

  // Temporary clicked center for circle or vertices for polygon
  const [tempCircleCenter, setTempCircleCenter] = useState(null);
  const [tempPolygonPoints, setTempPolygonPoints] = useState([]);

  // View Assigned Vehicles Modal State
  const [viewingGeo, setViewingGeo] = useState(null);

  const handleMapClick = (latlng) => {
    if (newType === "Circle") {
      setTempCircleCenter([latlng.lat, latlng.lng]);
    } else {
      setTempPolygonPoints((prev) => [...prev, [latlng.lat, latlng.lng]]);
    }
  };

  const handleStartCreate = () => {
    setEditingId(null);
    setNewName("");
    setNewType("Circle");
    setNewRadiusKm("2");
    setNewSpeedLimit("80");
    setNewColor("#2563eb");
    setTempCircleCenter(null);
    setTempPolygonPoints([]);
    setIsCreating(true);
  };

  const handleStartEdit = (geo) => {
    setEditingId(geo.id);
    setNewName(geo.name);
    setNewType(geo.type);
    setNewSpeedLimit(geo.speedLimit || "80");
    setNewColor(geo.color || "#2563eb");
    if (geo.type === "Circle") {
      setNewRadiusKm((geo.radius / 1000).toString());
      setTempCircleCenter([geo.lat, geo.lng]);
      setTempPolygonPoints([]);
    } else {
      setTempPolygonPoints(geo.positions || []);
      setTempCircleCenter(null);
    }
    setIsCreating(true);
  };

  const handleSaveGeofence = () => {
    if (!newName) {
      alert("Please enter a geofence name.");
      return;
    }

    if (editingId) {
      // Update existing
      setGeofences(
        geofences.map((geo) => {
          if (geo.id === editingId) {
            const updated = {
              ...geo,
              name: newName,
              type: newType,
              color: newColor,
              speedLimit: newSpeedLimit,
            };
            if (newType === "Circle") {
              if (tempCircleCenter) {
                updated.lat = tempCircleCenter[0];
                updated.lng = tempCircleCenter[1];
              }
              updated.radius = parseFloat(newRadiusKm) * 1000;
              delete updated.positions;
            } else {
              if (tempPolygonPoints.length >= 3) {
                updated.positions = tempPolygonPoints;
              }
              delete updated.lat;
              delete updated.lng;
              delete updated.radius;
            }
            return updated;
          }
          return geo;
        }),
      );
    } else {
      // Create new
      let newGeo = {
        id: Date.now(),
        name: newName,
        type: newType,
        color: newColor,
        speedLimit: newSpeedLimit,
        status: "Active",
        assignedVehicles: [],
      };

      if (newType === "Circle") {
        if (!tempCircleCenter) {
          alert("Please click on the map to place the circle center!");
          return;
        }
        newGeo.lat = tempCircleCenter[0];
        newGeo.lng = tempCircleCenter[1];
        newGeo.radius = parseFloat(newRadiusKm) * 1000;
      } else {
        if (tempPolygonPoints.length < 3) {
          alert("Please click at least 3 points on the map to form a polygon!");
          return;
        }
        newGeo.positions = tempPolygonPoints;
      }

      setGeofences([...geofences, newGeo]);
    }

    handleCancel();
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    setNewName("");
    setTempCircleCenter(null);
    setTempPolygonPoints([]);
  };

  const handleDelete = (id) => {
    setGeofences(geofences.filter((g) => g.id !== id));
  };

  return (
    <div className="relative w-full h-full bg-slate-100 overflow-hidden font-sans flex flex-col">
      {/* FULL PAGE MAP WRAPPER */}
      <div className="relative flex-1 w-full h-full">
        <MapContainer
          center={[23.8103, 90.4125]}
          zoom={12}
          scrollWheelZoom={true}
          zoomControl={false}
          style={{ height: "100%", width: "100%" }}
          className="absolute inset-0 z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapClickHandler
            active={isCreating}
            creationType={newType}
            onMapClick={handleMapClick}
          />

          {/* Render Existing Geofences (when not editing them) */}
          {geofences.map((geo) => {
            if (editingId === geo.id) return null; // Hide while editing to show temp shape

            if (geo.type === "Circle") {
              return (
                <Circle
                  key={geo.id}
                  center={[geo.lat, geo.lng]}
                  radius={geo.radius}
                  pathOptions={{
                    color: geo.color,
                    fillColor: geo.color,
                    fillOpacity: 0.3,
                  }}
                >
                  <Popup>
                    <div className="p-1 space-y-1 text-xs">
                      <p className="font-bold text-blue-600">{geo.name}</p>
                      <p>
                        Radius:{" "}
                        <span className="font-semibold">
                          {geo.radius / 1000} km
                        </span>
                      </p>
                      <p>
                        Speed Limit:{" "}
                        <span className="font-semibold">
                          {geo.speedLimit} km/h
                        </span>
                      </p>
                      <p>
                        Assigned Vehicles:{" "}
                        <span className="font-semibold">
                          {geo.assignedVehicles?.length || 0}
                        </span>
                      </p>
                    </div>
                  </Popup>
                </Circle>
              );
            } else {
              return (
                <Polygon
                  key={geo.id}
                  positions={geo.positions}
                  pathOptions={{
                    color: geo.color,
                    fillColor: geo.color,
                    fillOpacity: 0.3,
                  }}
                >
                  <Popup>
                    <div className="p-1 space-y-1 text-xs">
                      <p className="font-bold text-emerald-600">{geo.name}</p>
                      <p>
                        Type: <span className="font-semibold">Polygon</span>
                      </p>
                      <p>
                        Speed Limit:{" "}
                        <span className="font-semibold">
                          {geo.speedLimit} km/h
                        </span>
                      </p>
                      <p>
                        Assigned Vehicles:{" "}
                        <span className="font-semibold">
                          {geo.assignedVehicles?.length || 0}
                        </span>
                      </p>
                    </div>
                  </Popup>
                </Polygon>
              );
            }
          })}

          {/* Render Temporary Circle Being Created/Edited */}
          {isCreating && newType === "Circle" && tempCircleCenter && (
            <>
              <Circle
                center={tempCircleCenter}
                radius={parseFloat(newRadiusKm || 1) * 1000}
                pathOptions={{
                  color: newColor,
                  fillColor: newColor,
                  fillOpacity: 0.4,
                  dashArray: "6, 6",
                }}
              />
              <Marker
                position={tempCircleCenter}
                icon={L.divIcon({
                  className: "custom-pin",
                  html: `<div style="background: ${newColor}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.4);"></div>`,
                  iconSize: [14, 14],
                  iconAnchor: [7, 7],
                })}
              />
            </>
          )}

          {/* Render Temporary Polygon Being Created/Edited + Click Markers at each vertex */}
          {isCreating &&
            newType === "Polygon" &&
            tempPolygonPoints.length > 0 && (
              <>
                <Polygon
                  positions={tempPolygonPoints}
                  pathOptions={{
                    color: newColor,
                    fillColor: newColor,
                    fillOpacity: 0.4,
                    dashArray: "6, 6",
                  }}
                />
                {tempPolygonPoints.map((pt, idx) => (
                  <Marker
                    key={idx}
                    position={pt}
                    icon={L.divIcon({
                      className: "polygon-vertex-pin",
                      html: `<div style="background: #2563eb; color: white; width: 18px; height: 18px; border-radius: 50%; border: 2px solid white; font-size: 9px; font-weight: bold; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,0.4);">${idx + 1}</div>`,
                      iconSize: [18, 18],
                      iconAnchor: [9, 9],
                    })}
                  />
                ))}
              </>
            )}
        </MapContainer>

        {/* TOP BAR: Create Button positioned at the top right */}
        <div className="absolute top-4 right-4 z-[1000]">
          {!isCreating && (
            <button
              onClick={handleStartCreate}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-lg transition-all"
            >
              <Plus size={16} />
              <span>Create New Geofence</span>
            </button>
          )}
        </div>

        {/* LEFT SIDE PANEL: Includes Header at the top of the box & Configured Fences list */}
        <div className="absolute top-4 left-4 bottom-4 w-84 z-[1000] bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 flex flex-col overflow-hidden">
          {/* Header inside the top of the left box */}
          <div className="px-4 py-4 border-b border-gray-200 bg-gray-50 flex items-center space-x-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Layers size={18} />
            </div>
            <div>
              <h2 className="font-bold text-gray-800 text-xs uppercase tracking-wide">
                Geofencing & Perimeter
              </h2>
              <p className="text-[10px] text-gray-400">
                {geofences.length} active zones configured
              </p>
            </div>
          </div>

          {!isCreating ? (
            <>
              <div className="px-4 py-2.5 border-b border-gray-100 bg-white flex items-center justify-between">
                <h3 className="font-bold text-gray-700 text-[11px] uppercase tracking-wider">
                  Configured Fences
                </h3>
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-gray-100 p-3 space-y-2">
                {geofences.map((geo) => (
                  <div
                    key={geo.id}
                    className="p-3 bg-white rounded-xl border border-gray-100 shadow-xs hover:border-blue-200 transition-all flex items-center justify-between"
                  >
                    <div className="space-y-1 flex-1 pr-2">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: geo.color }}
                        ></div>
                        <h4 className="font-bold text-gray-800 text-xs truncate">
                          {geo.name}
                        </h4>
                      </div>
                      <p className="text-[10px] text-gray-400">
                        {geo.type === "Circle"
                          ? `Radius: ${geo.radius / 1000} km`
                          : `Polygon (${geo.positions?.length || 0} pts)`}{" "}
                        | Speed: {geo.speedLimit} km/h
                      </p>
                      <div className="flex items-center space-x-2 pt-0.5">
                        <span className="inline-block px-1.5 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] rounded font-semibold border border-emerald-100">
                          {geo.status}
                        </span>
                        <span className="text-[10px] text-blue-600 font-medium">
                          Vehicles: {geo.assignedVehicles?.length || 0}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons: View Assigned, Edit, Delete */}
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => setViewingGeo(geo)}
                        className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                        title="View Assigned Vehicles"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        onClick={() => handleStartEdit(geo)}
                        className="p-1.5 text-amber-500 hover:bg-amber-50 rounded-lg transition-all"
                        title="Edit Geofence"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(geo.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete Geofence"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="font-bold text-gray-800 text-xs uppercase">
                  {editingId ? "Edit Geofence" : "Create New Geofence"}
                </h3>
                <button
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-red-600"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-600">Name</label>
                  <input
                    type="text"
                    placeholder="Add a Radius Name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-600">Type</label>
                  <select
                    value={newType}
                    onChange={(e) => {
                      setNewType(e.target.value);
                      setTempCircleCenter(null);
                      setTempPolygonPoints([]);
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Circle">Circle</option>
                    <option value="Polygon">Polygon</option>
                  </select>
                </div>

                {newType === "Circle" ? (
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-600">
                      Radius (KM)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={newRadiusKm}
                      onChange={(e) => setNewRadiusKm(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-[10px] text-purple-600 italic">
                      The minimum geofence radius is 0.1km
                    </p>
                  </div>
                ) : (
                  <div className="bg-blue-50 border border-blue-200 p-2.5 rounded-lg space-y-1.5 text-blue-900">
                    <p className="font-bold">
                      Polygon Points:{" "}
                      <span className="text-blue-600">
                        {tempPolygonPoints.length}
                      </span>
                    </p>
                    <p className="text-[11px] text-blue-700">
                      Click consecutively on the map to add vertices.
                    </p>
                    {tempPolygonPoints.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setTempPolygonPoints([])}
                        className="text-[10px] text-red-600 font-bold hover:underline"
                      >
                        Clear All Points
                      </button>
                    )}
                  </div>
                )}

                <div className="space-y-1">
                  <label className="font-semibold text-gray-600">
                    Speed Limit (km/h)
                  </label>
                  <input
                    type="number"
                    value={newSpeedLimit}
                    onChange={(e) => setNewSpeedLimit(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-600">Color</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                      className="w-10 h-8 border border-gray-300 rounded cursor-pointer p-0.5 bg-white"
                    />
                    <input
                      type="text"
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-2.5 py-1.5 font-medium text-gray-800"
                    />
                  </div>
                </div>

                <div className="pt-3 flex flex-col gap-2">
                  <button
                    onClick={handleSaveGeofence}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-lg shadow-sm transition-all flex items-center justify-center space-x-1"
                  >
                    <Check size={16} />
                    <span>DONE</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-2 rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Instruction Banner when creating / editing */}
        {isCreating && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-blue-600 text-white px-4 py-1.5 rounded-full shadow-lg text-xs font-semibold animate-pulse">
            {newType === "Circle"
              ? "👉 Click anywhere on the map to place/update your circle center!"
              : `👉 Click map to drop polygon vertices (${tempPolygonPoints.length} points added)`}
          </div>
        )}

        {/* VIEW ASSIGNED VEHICLES MODAL */}
        {viewingGeo && (
          <div className="absolute inset-0 z-[2000] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-md overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
              <div className="px-5 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <Truck size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm">
                      Assigned Vehicles
                    </h3>
                    <p className="text-[11px] text-gray-500">
                      {viewingGeo.name}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setViewingGeo(null)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-4 max-h-[350px] overflow-y-auto space-y-2.5">
                {viewingGeo.assignedVehicles &&
                viewingGeo.assignedVehicles.length > 0 ? (
                  viewingGeo.assignedVehicles.map((veh) => (
                    <div
                      key={veh.id}
                      className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5">
                        <p className="font-bold text-gray-800">{veh.name}</p>
                        <p className="text-[11px] text-gray-500">
                          Driver:{" "}
                          <span className="font-medium text-gray-700">
                            {veh.driver}
                          </span>
                        </p>
                      </div>
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold rounded-lg">
                        {veh.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400 text-xs">
                    No vehicles currently assigned to this geofence zone.
                  </div>
                )}
              </div>

              <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => setViewingGeo(null)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
