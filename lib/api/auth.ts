import { apiCall } from "./client";
import { getAuthApiBaseUrl } from "./config";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  status?: string;
  createdAt?: string;
  lastLoginAt?: string;
}

export interface AuthResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: User;
  };
  timestamp: string;
}

export interface ProfileResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: User;
  timestamp: string;
}

export interface LogoutResponse {
  success: boolean;
  statusCode: number;
  message: string;
  timestamp: string;
}

export async function loginAdmin(payload: LoginPayload): Promise<AuthResponse> {
  try {
    const response = await fetch(`${getAuthApiBaseUrl()}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data: AuthResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    // Store tokens in cookies via server action
    if (data.data?.accessToken && data.data?.refreshToken) {
      const { setAuthCookies } = await import("@/lib/actions/auth");
      await setAuthCookies(data.data.accessToken, data.data.refreshToken);
    }

    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

export async function getProfile(): Promise<User> {
  try {
    const data = await apiCall<ProfileResponse>("/auth/profile", {
      method: "GET",
      authBase: true,
    });
    return data.data;
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    throw error;
  }
}

export async function logoutAdmin(): Promise<LogoutResponse> {
  try {
    const data = await apiCall<LogoutResponse>("/auth/logout", {
      method: "POST",
      authBase: true,
    });

    // Clear cookies after successful logout
    const { clearAuthCookies } = await import("@/lib/actions/auth");
    await clearAuthCookies();

    return data;
  } catch (error) {
    console.error("Logout error:", error);
    // Clear cookies even if logout API fails
    const { clearAuthCookies } = await import("@/lib/actions/auth");
    await clearAuthCookies();
    throw error;
  }
}

export async function refreshAccessToken(): Promise<string> {
  try {
    const { getRefreshToken } = await import("@/lib/actions/auth");
    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await fetch(`${getAuthApiBaseUrl()}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Token refresh failed");
    }

    // Update tokens in cookies
    if (data.data?.accessToken && data.data?.refreshToken) {
      const { setAuthCookies } = await import("@/lib/actions/auth");
      await setAuthCookies(data.data.accessToken, data.data.refreshToken);
    }

    return data.data.accessToken;
  } catch (error) {
    console.error("Token refresh error:", error);
    // Clear cookies on refresh failure
    const { clearAuthCookies } = await import("@/lib/actions/auth");
    await clearAuthCookies();
    throw error;
  }
}

export async function getUserFromCookie(): Promise<User | null> {
  try {
    const { getAccessToken } = await import("@/lib/actions/auth");
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return null;
    }

    // Fetch profile using the access token
    return await getProfile();
  } catch (error) {
    console.error("Get user error:", error);
    return null;
  }
}
