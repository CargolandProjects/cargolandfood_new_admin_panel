/**
 * API base URLs.
 *
 * Auth and data may live on different hosts in this project:
 * - adminpanel.cargolandfood.com → auth (login, refresh, profile)
 * - dev.cargolandfood.com → admin data (riders, vendors, orders, …)
 *
 * Set both in .env, or only NEXT_PUBLIC_API_URL if everything is on one host.
 */
function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

const DEFAULT_DATA_API = "https://prod.cargolandfood.com/api/v1";
const DEFAULT_AUTH_API = "https://adminpanel.cargolandfood.com/api/v1";

/** Base URL for riders, vendors, orders, zones, staff, etc. */
export function getApiBaseUrl(): string {
  return normalizeBaseUrl(
    process.env.NEXT_PUBLIC_API_URL || DEFAULT_DATA_API
  );
}

/** Base URL for login / refresh (falls back to data API if not set). */
export function getAuthApiBaseUrl(): string {
  const authUrl = process.env.NEXT_PUBLIC_AUTH_API_URL;
  if (authUrl) return normalizeBaseUrl(authUrl);
  return normalizeBaseUrl(
    process.env.NEXT_PUBLIC_API_URL || DEFAULT_AUTH_API
  );
}
