import { apiCall } from "./client";

const ZONES_PROD_BASE = "https://prod.cargolandfood.com/api/v1";


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
  status?: string;
  message?: string;
  data?:
    | Zone[]
    | {
        status?: string;
        message?: string;
        data?: Zone[];
        meta?: {
          totalItems: number;
          itemCount: number;
          itemsPerPage: number;
          totalPages: number;
          currentPage: number;
        };
      };
}

export async function fetchZones(): Promise<Zone[]> {
  try {
    const data = await apiCall<ZonesResponse>(`${ZONES_PROD_BASE}/zone/get-zones`, {
      method: "GET",
    });

    const initialZones = Array.isArray(data.data)
      ? data.data
      : data.data?.data ?? [];

    const initialMeta = Array.isArray(data.data) ? undefined : data.data?.meta;
    const totalPages = initialMeta?.totalPages ?? 1;
    const itemsPerPage = initialMeta?.itemsPerPage ?? (initialZones.length || 10);

    let zones = [...initialZones];

    // Some APIs default to paginated responses. Aggregate all pages so UI cards and tables show complete counts.
    if (totalPages > 1) {
      for (let page = 2; page <= totalPages; page++) {
        const pageData = await apiCall<ZonesResponse>(
          `${ZONES_PROD_BASE}/zone/get-zones?page=${page}&limit=${itemsPerPage}`,
          { method: "GET" }
        );

        const pageZones = Array.isArray(pageData.data)
          ? pageData.data
          : pageData.data?.data ?? [];

        zones = zones.concat(pageZones);
      }
    }

    // Avoid duplicates if API includes overlaps across pages.
    const uniqueZones = Array.from(new Map(zones.map((zone) => [zone.id, zone])).values());
    
    // Convert GeoJSON to polygon array if needed
    return uniqueZones.map(zone => {
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
    const response = await apiCall<any>(`${ZONES_PROD_BASE}/zone/create-zone`, {
      method: "POST",
      body: JSON.stringify({
        ...payload,
        isActive: true,
      }),
    });

    const zone =
      response?.data?.data?.[0] ||
      response?.data?.[0] ||
      response?.data;

    if (!zone) {
      throw new Error("Create zone response missing zone data");
    }

    return zone;
  } catch (error) {
    console.error("Failed to create zone:", error);
    throw error;
  }
}
