import { apiCall } from "./client";


export interface Zone {
  id: string;
  zoneName: string;
  zoneType: string;
  priority: number;
  polygon?: Array<{ lat: number; lng: number }>;
  polygonGeoJson?: {
    type: string;
    coordinates: number[][][];
  };
  isActive: boolean;
  country?: string;
  state?: string;
  city?: string;
  baseDeliveryFee?: number;
  deliveryFeePerKm?: number;
  averageEtaMinutes?: number;
  restaurantCount?: number;
  personnelCount?: number;
}

export interface ZonesResponse {
  status: string;
  message: string;
  data: Zone[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

export async function fetchZones(): Promise<Zone[]> {
  try {
    const data = await apiCall<ZonesResponse>("/zone/get-zones", {
      method: "GET",
    });
    
    // Convert GeoJSON to polygon array if needed
    return (data.data || []).map(zone => {
      if (!zone.polygon && zone.polygonGeoJson?.coordinates?.[0]) {
        // Convert GeoJSON coordinates to LatLng array
        zone.polygon = zone.polygonGeoJson.coordinates[0].map(([lng, lat]) => ({
          lat,
          lng,
        }));
      }
      return zone;
    });
  } catch (error) {
    console.error("Failed to fetch zones:", error);
    throw error;
  }
}

export interface CreateZonePayload {
  zoneName: string;
  zoneType: string;
  priority: number;
  polygon: Array<{ lat: number; lng: number }>;
  isActive?: boolean;
  country?: string;
  state?: string;
  city?: string;
  baseDeliveryFee?: number;
  deliveryFeePerKm?: number;
  averageEtaMinutes?: number;
  metadata?: Record<string, unknown>;
}

export async function createZone(payload: CreateZonePayload): Promise<Zone> {
  try {
    const response = await apiCall<any>("/zone/create-zone", {
      method: "POST",
      body: JSON.stringify({
        ...payload,
        isActive: true,
      }),
    });
    return response.data?.[0] || response.data;
  } catch (error) {
    console.error("Failed to create zone:", error);
    throw error;
  }
}
