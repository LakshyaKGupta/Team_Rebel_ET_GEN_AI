import { AssetType, InterestVerificationResult, MarketSearchResult } from "@/lib/types";

const API_BASE = "/api/auth";

export async function apisignup(email: string, password: string, name?: string) {
  const res = await fetch(`${API_BASE}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password, name }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Signup failed");
  return data;
}

export async function apilogin(email: string, password: string) {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Login failed");
  return data;
}

export async function apilogout() {
  await fetch(`${API_BASE}/logout`, { method: "POST" });
}

export async function apigetMe() {
  const res = await fetch(`${API_BASE}/me`, { credentials: "include" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Not authenticated");
  return data;
}

export async function apigetPreferences() {
  const res = await fetch(`${API_BASE}/preferences`, { credentials: "include" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to get preferences");
  return data;
}

export async function apiupdatePreferences(prefs: {
  theme?: string;
  notificationsEnabled?: boolean;
  emailUpdates?: boolean;
  userType?: string;
  selectedInterests?: string[];
  goal?: string;
  notificationPref?: string;
  hasCompletedOnboarding?: boolean;
  experienceLevel?: string;
  riskAppetite?: string;
  timeHorizon?: string;
}) {
  const res = await fetch(`${API_BASE}/preferences`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(prefs),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to update preferences");
  return data;
}

export async function apigetProfile() {
  const res = await fetch(`/api/profile`, { credentials: "include" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to get profile");
  return data;
}

export async function apiupdateProfile(data: { name?: string; avatarUrl?: string }) {
  const res = await fetch(`/api/profile`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || "Failed to update profile");
  return result;
}

export async function apichangePassword(currentPassword: string, newPassword: string) {
  const res = await fetch(`${API_BASE}/change-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || "Failed to change password");
  return result;
}

export async function apiUploadAvatar(file: File) {
  const formData = new FormData();
  formData.append("avatar", file);
  
  const res = await fetch(`${API_BASE}/upload-avatar`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to upload avatar");
  return data;
}

export async function apiGetPersonalizedBriefing(
  topic: string, 
  mode: string, 
  articles?: string[],
  depthLevel?: "simple" | "detailed",
  simulatedUserType?: string
) {
  const res = await fetch("/api/ai/briefing", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic, mode, articles, depthLevel, simulatedUserType }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to get personalized briefing");
  return data;
}

export async function apiSearchListedSecurities(query: string, type?: AssetType) {
  const params = new URLSearchParams({ q: query });
  if (type) {
    params.set("type", type);
  }

  const res = await fetch(`/api/market/search?${params.toString()}`, {
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to search listed securities");
  return data as { results: MarketSearchResult[]; source: string };
}

export async function apiVerifyCustomInterest(interest: string) {
  const res = await fetch("/api/interests/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ interest }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to verify interest");
  return data as InterestVerificationResult;
}
