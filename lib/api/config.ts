/**
 * API base URLs.
 *
 * Defaults to production and can be overridden by env vars.
 */
function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

const DEFAULT_DATA_API = "https://adminpanelprod.cargolandfood.com/api/v1";


/** Base URL for riders, vendors, orders, zones, staff, etc. */
export function getApiBaseUrl(): string {
  return normalizeBaseUrl(
    process.env.NEXT_PUBLIC_API_URL || DEFAULT_DATA_API
  );
}

/** Base URL for login / refresh (falls back to data API if not set). */
export function getAuthApiBaseUrl(): string {
  return normalizeBaseUrl(
    process.env.NEXT_PUBLIC_API_URL || DEFAULT_DATA_API
  );
}
