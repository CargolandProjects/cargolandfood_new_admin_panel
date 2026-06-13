/**
 * Geocoding and geospatial utilities for zone search
 */

export interface LatLng {
  lat: number;
  lng: number;
}

/**
 * Geocode an address string to latitude and longitude
 */
export async function geocodeAddress(address: string): Promise<LatLng | null> {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    );

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return {
        lat: location.lat,
        lng: location.lng,
      };
    }

    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}

/**
 * Check if a point is inside a polygon using ray casting algorithm
 */
export function isPointInPolygon(point: LatLng, polygon: LatLng[]): boolean {
  if (polygon.length < 3) return false;

  let inside = false;
  let p1 = polygon[0];

  for (let i = 1; i <= polygon.length; i++) {
    const p2 = polygon[i % polygon.length];

    if (
      point.lng > Math.min(p1.lng, p2.lng) &&
      point.lng <= Math.max(p1.lng, p2.lng) &&
      point.lat <= Math.max(p1.lat, p2.lat)
    ) {
      if (p1.lng !== p2.lng) {
        const xinters =
          ((point.lng - p1.lng) * (p2.lat - p1.lat)) / (p2.lng - p1.lng) +
          p1.lat;
        if (p1.lat === p2.lat || point.lat <= xinters) {
          inside = !inside;
        }
      }
    }

    p1 = p2;
  }

  return inside;
}

/**
 * Find zones that contain a given point
 */
export function findZonesContainingPoint<T extends { id: string; polygon?: Array<{ lat: number; lng: number }> }>(
  point: LatLng,
  zones: T[]
): T[] {
  return zones.filter((zone) => {
    if (!zone.polygon || zone.polygon.length < 3) return false;
    return isPointInPolygon(point, zone.polygon);
  });
}
