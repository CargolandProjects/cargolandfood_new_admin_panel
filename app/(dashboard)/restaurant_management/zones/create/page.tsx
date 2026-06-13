 "use client";

import { useState, useCallback, useRef, useMemo } from "react";
import { 
  ChevronDown, 
  Info, 
  MapPin, 
  CheckCircle2,
  Search,
  Loader,
  AlertCircle
} from "lucide-react";
import { 
  GoogleMap, 
  useJsApiLoader, 
  Marker,
  Polygon
} from "@react-google-maps/api";
import { useRouter } from "next/navigation";
import { createZone, type CreateZonePayload } from "@/lib/api/zones";
import { COUNTRIES, STATES, CITIES, ZONE_TYPES, ZONE_TYPE_COLORS } from "@/lib/data/locations";
import { geocodeAddress, type LatLng } from "@/lib/utils/geocoding";

// 1. External Config (Prevents re-renders from triggering re-loads)
const mapContainerStyle = { width: "100%", height: "100%" };
const defaultCenter = { lat: 6.4735, lng: 3.6318 }; // Center on Ibeju-Lekki area

export default function CreateZone() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    country: "Nigeria",
    state: "",
    cities: "",
    zoneType: "CITY",
    zoneName: "",
    description: "",
  });

  // Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchedPoint, setSearchedPoint] = useState<LatLng | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // 2. Map & Drawing States
  const [polygonPath, setPolygonPath] = useState<{ lat: number; lng: number }[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const polygonRef = useRef<google.maps.Polygon | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const maps = typeof window !== "undefined" ? window.google?.maps : undefined;

  const mapsReady =
    Boolean(maps);

  // Get available cities based on selected state
  const availableCities = useMemo(() => {
    return formData.state ? CITIES[formData.state] || [] : [];
  }, [formData.state]);

  // Get polygon color based on zone type
  const polygonColor = useMemo(() => {
    return ZONE_TYPE_COLORS[formData.zoneType] || ZONE_TYPE_COLORS.CITY;
  }, [formData.zoneType]);

  // 3. Load Script
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  // Handle location search
  const handleLocationSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchError("Please enter a location");
      return;
    }

    try {
      setSearching(true);
      setSearchError(null);

      const point = await geocodeAddress(searchQuery);

      if (!point) {
        setSearchError("Location not found. Please try another search.");
        return;
      }

      setSearchedPoint(point);

      // Pan map to the searched location
      if (mapRef.current) {
        mapRef.current.panTo(point);
        mapRef.current.setZoom(14);
      }
    } catch (err) {
      setSearchError("Search failed. Please try again.");
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  // 4. Keep polygon coordinates in sync while editing
  const onPolygonLoad = useCallback((polygon: google.maps.Polygon) => {
    polygonRef.current = polygon;

    const updatePath = () => {
      const path = polygon.getPath().getArray().map((latLng) => ({
        lat: latLng.lat(),
        lng: latLng.lng(),
      }));
      setPolygonPath(path);
    };

    updatePath();
    polygon.setEditable(true);

    // Listen for edits/drags to update coordinates in real-time
    const addListener = maps?.event?.addListener;
    if (addListener) {
      addListener(polygon.getPath(), "set_at", updatePath);
      addListener(polygon.getPath(), "insert_at", updatePath);
      addListener(polygon.getPath(), "remove_at", updatePath);
    }
  }, [maps]);

  const handleMapClick = useCallback(
    (event: google.maps.MapMouseEvent) => {
      if (!isDrawing) return;
      const latLng = event.latLng;
      if (!latLng) return;

      setError(null);
      setPolygonPath((prev) => [
        ...(prev ?? []),
        { lat: latLng.lat(), lng: latLng.lng() },
      ]);
    },
    [isDrawing]
  );

  const handleStartDrawing = () => {
    if (polygonRef.current) {
      polygonRef.current.setMap(null);
      polygonRef.current = null;
    }
    setError(null);
    setPolygonPath([]);
    setIsDrawing(true);
  };

  const handleFinishDrawing = () => {
    if (!polygonPath || polygonPath.length < 3) {
      setError("Please add at least 3 points before finishing.");
      return;
    }
    setIsDrawing(false);
  };

  // 5. Reset Logic
  const handleReset = () => {
    if (polygonRef.current) {
      polygonRef.current.setMap(null);
      polygonRef.current = null;
    }
    setIsDrawing(false);
    setPolygonPath(null);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Reset city when state changes
    if (field === "state") {
      setFormData(prev => ({ ...prev, cities: "" }));
    }
  };

  const handleSubmit = async () => {
    if (!polygonPath || polygonPath.length < 3) {
      setError("Please draw a polygon with at least 3 points");
      return;
    }

    if (!formData.zoneName.trim()) {
      setError("Zone name is required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const payload: CreateZonePayload = {
        zoneName: formData.zoneName,
        zoneType: formData.zoneType,
        priority: 1,
        polygon: polygonPath,
        country: formData.country || undefined,
        state: formData.state || undefined,
        city: formData.cities || undefined,
      };

      await createZone(payload);
      alert("Zone created successfully!");
      router.push("/restaurant_management/zones");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create zone");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loadError) return <div className="p-8 text-red-500 font-bold">Error loading maps. Check your API key.</div>;

  return (
    <div className="min-h-screen p-8 font-sans text-[#4B5563] w-full bg-gray-50/30">
      <div className="w-full space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Create New Zone</h1>
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Back
          </button>
        </div>

        {/* Section 1: Geographic Context */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-[13px] font-bold text-gray-900 mb-4 uppercase tracking-wider">Geographic Context</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <SelectField 
              label="Country" 
              value={formData.country}
              onChange={(value) => handleInputChange("country", value)}
              options={COUNTRIES}
            />
            <SelectField 
              label="State" 
              value={formData.state}
              onChange={(value) => handleInputChange("state", value)}
              options={STATES}
            />
            <SelectField 
              label="Cities" 
              value={formData.cities}
              onChange={(value) => handleInputChange("cities", value)}
              options={availableCities}
              disabled={!formData.state}
            />
            <SelectField 
              label="Zone type" 
              value={formData.zoneType}
              onChange={(value) => handleInputChange("zoneType", value)}
              options={ZONE_TYPES.map(z => z.value)}
              optionLabels={ZONE_TYPES.reduce((acc, z) => ({ ...acc, [z.value]: z.label }), {})}
            />
          </div>
          
          <div className="mt-6 flex gap-3 p-3 bg-white rounded-lg border border-orange-100 items-start">
            <div className="p-1 bg-orange-50 rounded">
              <Info className="w-4 h-4 text-orange-500 shrink-0" />
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              <span className="font-bold text-gray-800">Important</span><br />
              Country, State, and City are metadata for context only. They don't define delivery logic—Zone Type does that.
            </p>
          </div>
        </div>

        {/* Section 2: Zone Details */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-[13px] font-bold text-gray-900 mb-4 uppercase tracking-wider">Zone Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-1">
              <label className="text-[13px] font-medium text-gray-600">Zone name</label>
              <p className="text-[11px] text-gray-400 mb-2">(Choose a descriptive name)</p>
              <input 
                type="text"
                value={formData.zoneName}
                onChange={(e) => handleInputChange("zoneName", e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-orange-500 outline-none"
                placeholder="e.g., Lagos Mainland Coverage"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[13px] font-medium text-gray-600">Description</label>
              <p className="text-[11px] text-transparent mb-2">Spacer</p>
              <input 
                type="text"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-orange-500 outline-none"
                placeholder="Description (optional)"
              />
            </div>
          </div>
        </div>

        {/* Section 0: Search Location */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-[13px] font-bold text-gray-900 mb-4 uppercase tracking-wider">Search Location</h2>
          <form onSubmit={handleLocationSearch} className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g., Lekki Phase 1, Victoria Island, Ikoyi..."
                  className="w-full bg-white border border-gray-200 rounded-lg pl-12 pr-4 py-3 text-sm focus:border-orange-500 outline-none"
                  disabled={searching}
                />
              </div>
              <button
                type="submit"
                disabled={searching}
                className="px-6 py-3 bg-orange-100 text-orange-600 rounded-lg text-sm font-bold hover:bg-orange-200 disabled:opacity-50 transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                {searching ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Search
                  </>
                )}
              </button>
            </div>

            {searchError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{searchError}</p>
              </div>
            )}

            {searchedPoint && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-green-700">Location found</p>
                  <p className="text-sm text-green-600 mt-1">{searchQuery}</p>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Section 3: Draw Zone on Map */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-[13px] font-bold text-gray-900 uppercase tracking-wider">Draw Zone on Map</h2>
            <p className="text-[11px] text-gray-400 mt-1">Use the polygon tool at the top of the map to draw your area.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-[#F6FEF9] border border-[#D1FAE5] rounded-xl p-5">
              <h3 className="text-[12px] font-bold text-[#065F46] mb-3 uppercase">Drawing Instructions</h3>
              <ul className="text-[11px] text-[#065F46] space-y-2 list-decimal pl-5 leading-tight">
                <li>Click <b>Start drawing</b> below the map</li>
                <li>Click points on the map to create your boundary</li>
                <li>Click <b>Finish drawing</b> once you have at least 3 points</li>
                <li>Drag the white points to refine the polygon</li>
              </ul>
            </div>

            <div className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 text-center transition-all ${polygonPath ? 'border-green-200 bg-green-50' : 'border-gray-100 bg-gray-50/50'}`}>
              <div className={`mb-3 p-2 rounded-full ${polygonPath ? 'bg-green-100' : 'bg-orange-50'}`}>
                {polygonPath ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <MapPin className="w-5 h-5 text-orange-500" />}
              </div>
              <h4 className="text-[13px] font-bold text-gray-800 uppercase tracking-tight">
                {polygonPath ? "Zone Defined" : "Polygon Status"}
              </h4>
              <p className="text-[11px] text-gray-400 mt-1">
                {polygonPath?.length ? `${polygonPath.length} points captured` : "Start drawing on the map"}
              </p>
            </div>
          </div>

          {/* Interactive Map */}
          <div className="relative w-full h-[500px] bg-gray-100 rounded-xl overflow-hidden border border-gray-200 mb-8 shadow-inner">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={searchedPoint || defaultCenter}
                zoom={searchedPoint ? 14 : 13}
                onLoad={(map) => { mapRef.current = map; }}
                onClick={handleMapClick}
                options={{
                  disableDefaultUI: false,
                  mapTypeControl: true,
                  streetViewControl: false,
                }}
              >
                {polygonPath && polygonPath.length > 0 && (
                  <Polygon
                    path={polygonPath}
                    onLoad={onPolygonLoad}
                    options={{
                      fillColor: polygonColor.fill,
                      fillOpacity: 0.35,
                      strokeColor: polygonColor.stroke,
                      strokeWeight: 2,
                      clickable: true,
                      editable: !isDrawing,
                      zIndex: 1,
                    }}
                  />
                )}
                {searchedPoint && (
                  <Marker
                    position={searchedPoint}
                    title={searchQuery}
                  />
                )}
              </GoogleMap>
            ) : (
              <div className="flex items-center justify-center h-full flex-col gap-2">
                <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-gray-400 font-medium">Initializing Maps...</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 mb-4">
            <button
              type="button"
              onClick={handleStartDrawing}
              disabled={!mapsReady || loading}
              className="px-4 py-2 border border-orange-200 bg-orange-50 text-orange-600 rounded-lg text-sm font-bold hover:bg-orange-100 disabled:opacity-50"
            >
              Start drawing
            </button>
            <button
              type="button"
              onClick={handleFinishDrawing}
              disabled={!isDrawing || loading}
              className="px-4 py-2 border border-gray-200 bg-white text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 disabled:opacity-50"
            >
              Finish drawing
            </button>
            <p className="text-xs text-gray-500">
              {isDrawing ? "Drawing mode on: click map to add points." : "Drawing mode off."}
            </p>
          </div>

          {/* Legend */}
          <div className="bg-white border border-gray-100 rounded-xl p-5 w-fit min-w-[280px]">
            <p className="text-[11px] font-bold text-gray-800 mb-4 uppercase tracking-wider font-sans">Zone Types on Maps</p>
            <div className="space-y-3">
              {ZONE_TYPES.map(zone => (
                <LegendItem 
                  key={zone.value}
                  color={ZONE_TYPE_COLORS[zone.value].light}
                  label={zone.label}
                />
              ))}
            </div>
          </div>

          {/* Coordinates Preview Box 
          
            {polygonPath && (
            <div className="mt-4 p-4 bg-gray-900 rounded-lg overflow-hidden">
              <p className="text-[10px] font-mono text-green-400 mb-2">// Raw Coordinate Data</p>
              <div className="max-h-32 overflow-y-auto custom-scrollbar">
                <pre className="text-[10px] text-gray-300 font-mono">
                  {JSON.stringify(polygonPath, null, 2)}
                </pre>
              </div>
            </div>
          )}
          
          */}
        
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-4 pt-4">
          <button 
            type="button"
            onClick={handleReset}
            disabled={loading}
            className="px-10 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-white hover:border-gray-300 transition-all bg-transparent shadow-sm active:scale-95 disabled:opacity-50"
          >
            Reset Map
          </button>
          <button 
            type="button"
            onClick={handleSubmit}
            disabled={!polygonPath || loading}
            className="px-10 py-3 bg-[#FFEBE1] text-[#F16622] rounded-xl text-sm font-bold hover:bg-[#F16622] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95"
          >
            {loading ? "Creating..." : "Submit Zone"}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Sub-components
function SelectField({ 
  label, 
  value, 
  onChange,
  options,
  optionLabels,
  disabled
}: { 
  label: string;
  value: string;
  onChange: (value: string) => void;
  options?: string[];
  optionLabels?: Record<string, string>;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[13px] font-medium text-gray-500">{label}</label>
      <div className="relative">
        <select 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-orange-500 outline-none transition-colors cursor-pointer disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          <option value="">Select {label.toLowerCase()}</option>
          {options?.map(opt => (
            <option key={opt} value={opt}>
              {optionLabels?.[opt] || opt}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string, label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-12 h-7 rounded border`} style={{ backgroundColor: color, borderColor: color }}></div>
      <span className="text-[11px] font-medium text-gray-600">{label}</span>
    </div>
  );
}
