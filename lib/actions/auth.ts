"use server";

import { cookies } from "next/headers";
import type { User } from "@/lib/api/auth";

export async function setAuthCookies(
  accessToken: string,
  refreshToken: string,
) {
  const cookieStore = await cookies();

  // Access token - shorter expiry (1 hour)
  cookieStore.set("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60, // 1 hour
    path: "/",
  });

  // Refresh token - longer expiry (7 days)
  cookieStore.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

const SESSION_USER_COOKIE = "session_user";

export async function setSessionUser(user: User): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_USER_COOKIE, JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getSessionUser(): Promise<User | null> {
  const raw = (await cookies()).get(SESSION_USER_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export async function getAccessToken() {
  const cookieStore = await cookies();
  return cookieStore.get("accessToken")?.value;
}

export async function getRefreshToken() {
  const cookieStore = await cookies();
  return cookieStore.get("refreshToken")?.value;
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
  cookieStore.delete(SESSION_USER_COOKIE);
}
