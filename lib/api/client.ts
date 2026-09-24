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
  const isAbsoluteUrl = /^https?:\/\//i.test(endpoint);
  const url = isAbsoluteUrl ? endpoint : `${baseUrl}${endpoint}`;
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

  // Only default to JSON when the caller isn't sending FormData (which needs
  // the browser to set its own multipart boundary) and hasn't set a
  // Content-Type themselves.
  const isFormData =
    typeof FormData !== "undefined" && fetchOptions.body instanceof FormData;
  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

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

      // If still unauthorized after refresh, force logout.
      if (response.status === 401) {
        const { clearAuthCookies } = await import("@/lib/actions/auth");
        await clearAuthCookies();
        if (typeof window !== "undefined") {
          window.location.href = "/auth/admin?reason=session-expired";
        }
        throw new Error("Session expired. Please log in again.");
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      // Redirect to login on auth failure
      if (typeof window !== "undefined") {
        window.location.href = "/auth/admin?reason=session-expired";
      }
      throw error;
    }
  }

  const data: T = await response.json();

  if (!response.ok) {
    const message =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (data as any)?.message || `API error: ${response.status}`;
    const error = new Error(message) as Error & { statusCode: number };
    error.statusCode = response.status;
    throw error;
  }

  return data;
}