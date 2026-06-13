 "use client";

import { useState, useRef, useEffect } from "react";
import { X, Search, Loader, AlertCircle, CheckCircle2, MapPin } from "lucide-react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  Polygon,
} from "@react-google-maps/api";
import { geocodeAddress, findZonesContainingPoint, type LatLng } from "@/lib/utils/geocoding";
import { ZONE_TYPE_COLORS } from "@/lib/data/locations";
import type { Zone } from "@/lib/api/zones";

interface SearchZoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  zones: Zone[];
}

const mapContainerStyle = { width: "100%", height: "100%" };
const defaultCenter = { lat: 6.4735, lng: 3.6318 };

export default function SearchZoneModal({
  isOpen,
  onClose,
  zones,
}: SearchZoneModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [foundZones, setFoundZones] = useState<Zone[]>([]);
  const [searchedPoint, setSearchedPoint] = useState<LatLng | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setSearchError(null);
      setFoundZones([]);
      setSearchedPoint(null);
    }
  }, [isOpen]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchError("Please enter a location");
      return;
    }

    try {
      setSearching(true);
      setSearchError(null);
      setFoundZones([]);

      // Geocode the address
      const point = await geocodeAddress(searchQuery);

      if (!point) {
        setSearchError("Location not found. Please try another search.");
        return;
      }

      setSearchedPoint(point);

      // Find zones containing this point
      const matchingZones = findZonesContainingPoint(point, zones);

      if (matchingZones.length === 0) {
        setSearchError("No zones found for this location");
      } else {
        setFoundZones(matchingZones);
      }

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

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="w-full max-w-4xl bg-white rounded-lg shadow-lg max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
            <h2 className="text-xl font-bold text-gray-900">Search Zones</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {/* Search Input */}
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label className="text-[13px] font-medium text-gray-600 block mb-2">
                  Search Location
                </label>
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
              </div>

              {searchError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{searchError}</p>
                </div>
              )}

              {foundZones.length > 0 && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-green-700">
                      Found {foundZones.length} zone{foundZones.length !== 1 ? "s" : ""}
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      {foundZones.map((z) => z.zoneName).join(", ")}
                    </p>
                  </div>
                </div>
              )}
            </form>

            {/* Map */}
            {isLoaded && !loadError && (
              <div className="space-y-4">
                <div className="relative w-full h-[400px] bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shadow-inner">
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={searchedPoint || defaultCenter}
                    zoom={searchedPoint ? 14 : 13}
                    onLoad={(map) => {
                      mapRef.current = map;
                    }}
                    options={{
                      disableDefaultUI: false,
                      mapTypeControl: true,
                      streetViewControl: false,
                    }}
                  >
                    {/* Render all zones */}
                    {zones.map((zone) => {
                      if (!zone.polygon || zone.polygon.length < 3) return null;

                      const colors =
                        ZONE_TYPE_COLORS[zone.zoneType] || ZONE_TYPE_COLORS.CITY;
                      const isFound = foundZones.some((z) => z.id === zone.id);

                      return (
                        <Polygon
                          key={zone.id}
                          paths={zone.polygon}
                          options={{
                            fillColor: colors.fill,
                            fillOpacity: isFound ? 0.6 : 0.2,
                            strokeColor: colors.stroke,
                            strokeWeight: isFound ? 3 : 1.5,
                            clickable: true,
                            zIndex: isFound ? 10 : 1,
                          }}
                        />
                      );
                    })}

                    {/* Search result marker */}
                    {searchedPoint && (
                      <Marker
                        position={searchedPoint}
                        title={searchQuery}
                      />
                    )}
                  </GoogleMap>
                </div>

                {/* Legend */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { type: "CITY", label: "City" },
                    { type: "LOCAL", label: "Local" },
                    { type: "EXPRESS", label: "Express" },
                    { type: "PROMO", label: "Promo" },
                  ].map((item) => {
                    const colors = ZONE_TYPE_COLORS[item.type];
                    return (
                      <div key={item.type} className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded border"
                          style={{
                            backgroundColor: colors.fill,
                            borderColor: colors.stroke,
                          }}
                        ></div>
                        <span className="text-[11px] text-gray-600">
                          {item.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Results */}
            {foundZones.length > 0 && (
              <div className="space-y-3 border-t border-gray-200 pt-6">
                <h3 className="text-sm font-semibold text-gray-900">
                  Matching Zones
                </h3>
                {foundZones.map((zone) => {
                  const colors =
                    ZONE_TYPE_COLORS[zone.zoneType] || ZONE_TYPE_COLORS.CITY;
                  return (
                    <div
                      key={zone.id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-gray-900">
                            {zone.zoneName}
                          </h4>
                          <div className="flex items-center gap-3 mt-2 flex-wrap">
                            <span
                              className="text-[11px] font-semibold px-3 py-1 rounded-full text-white"
                              style={{ backgroundColor: colors.fill }}
                            >
                              {zone.zoneType}
                            </span>
                            <span className="text-[11px] text-gray-500">
                              Priority: {zone.priority}
                            </span>
                            <span
                              className={`text-[11px] font-semibold px-3 py-1 rounded-full ${
                                zone.isActive
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-200 text-gray-700"
                              }`}
                            >
                              {zone.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t border-gray-200 justify-end sticky bottom-0 bg-white">
            <button
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
