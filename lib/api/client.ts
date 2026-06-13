import { refreshAccessToken } from "./auth";
import { getApiBaseUrl, getAuthApiBaseUrl } from "./config";

interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
  /** Use auth host (login server) — profile, logout, etc. */
  authBase?: boolean;
}

export async function apiCall<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { skipAuth = false, authBase = false, ...fetchOptions } = options;

  const baseUrl = authBase ? getAuthApiBaseUrl() : getApiBaseUrl();
  const url = `${baseUrl}${endpoint}`;
  const headers = new Headers(fetchOptions.headers || {});

  // Add auth header if not skipped
  if (!skipAuth) {
    try {
      const { getAccessToken } = await import("@/lib/actions/auth");
      const token = await getAccessToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    } catch (error) {
      console.error("Failed to get access token:", error);
    }
  }

  headers.set("Content-Type", "application/json");

  let response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  // If 401, try to refresh token and retry
  if (response.status === 401 && !skipAuth) {
    try {
      const newToken = await refreshAccessToken();
      headers.set("Authorization", `Bearer ${newToken}`);

      response = await fetch(url, {
        ...fetchOptions,
        headers,
      });
    } catch (error) {
      console.error("Token refresh failed:", error);
      // Redirect to login on auth failure
      if (typeof window !== "undefined") {
        window.location.href = "/auth/admin";
      }
      throw error;
    }
  }

  const data: T = await response.json();

  if (!response.ok) {
    throw new Error(
      (data as any)?.message || `API error: ${response.status}`
    );
  }

  return data;
}
