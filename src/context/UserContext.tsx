"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from "react";
import { apigetMe, apilogout, apiupdateProfile, apichangePassword, apiUploadAvatar } from "@/lib/api";

type UserType = "investor" | "student" | "founder" | "exploring" | null;
type Interest = string;
type Goal = "invest" | "stay_updated" | "learn" | null;
type NotificationPref = "realtime" | "key_only" | "daily" | "none" | null;
type ExperienceLevel = "beginner" | "intermediate" | "advanced" | null;
type RiskAppetite = "conservative" | "moderate" | "aggressive" | null;
type TimeHorizon = "short" | "medium" | "long" | null;

export interface UserPreferences {
  userType: UserType;
  selectedInterests: Interest[];
  goal: Goal;
  notificationPref: NotificationPref;
  hasCompletedOnboarding: boolean;
  theme?: string;
  notificationsEnabled?: boolean;
  emailUpdates?: boolean;
  experienceLevel?: ExperienceLevel;
  riskAppetite?: RiskAppetite;
  timeHorizon?: TimeHorizon;
}

interface BackendUser {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  createdAt: string;
}

interface UserContextType {
  user: BackendUser | null;
  preferences: UserPreferences;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUserType: (type: UserType) => void;
  setSelectedInterests: (interests: Interest[]) => void;
  setGoal: (goal: Goal) => void;
  setNotificationPref: (pref: NotificationPref) => void;
  setExperienceLevel: (level: ExperienceLevel) => void;
  setRiskAppetite: (appetite: RiskAppetite) => void;
  setTimeHorizon: (horizon: TimeHorizon) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (data: { name?: string; avatarUrl?: string }) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;
}

const defaultPreferences: UserPreferences = {
  userType: null,
  selectedInterests: [],
  goal: null,
  notificationPref: null,
  hasCompletedOnboarding: false,
  experienceLevel: undefined,
  riskAppetite: undefined,
  timeHorizon: undefined,
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<BackendUser | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);
  const hasBootstrapped = useRef(false);

  const refreshUser = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const res = await fetch("/api/auth/me", { 
        credentials: "include",
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      // If not authenticated (401), that's fine - just set defaults
      if (res.status === 401) {
        setUser(null);
        setPreferences(defaultPreferences);
        return;
      }
      
      if (!res.ok) {
        throw new Error("Failed to fetch user");
      }

      const data = await res.json();
      setUser(data.user);
      setPreferences({
        userType: data.preferences.userType as UserType,
        selectedInterests: data.preferences.selectedInterests as Interest[],
        goal: data.preferences.goal as Goal,
        notificationPref: data.preferences.notificationPref as NotificationPref,
        hasCompletedOnboarding: data.preferences.hasCompletedOnboarding,
        theme: data.preferences.theme,
        notificationsEnabled: data.preferences.notificationsEnabled,
        emailUpdates: data.preferences.emailUpdates,
        experienceLevel: data.preferences.experienceLevel as ExperienceLevel,
        riskAppetite: data.preferences.riskAppetite as RiskAppetite,
        timeHorizon: data.preferences.timeHorizon as TimeHorizon,
      });
    } catch (error) {
      console.error("Failed to refresh user:", error);
      setUser(null);
      setPreferences(defaultPreferences);
    }
  };

  useEffect(() => {
    if (hasBootstrapped.current) {
      return;
    }

    hasBootstrapped.current = true;
    refreshUser().finally(() => setIsLoading(false));
  }, []);

  const setUserType = (userType: UserType) => {
    setPreferences((prev) => ({ ...prev, userType }));
  };

  const setSelectedInterests = (selectedInterests: Interest[]) => {
    setPreferences((prev) => ({ ...prev, selectedInterests }));
  };

  const setGoal = (goal: Goal) => {
    setPreferences((prev) => ({ ...prev, goal }));
  };

  const setNotificationPref = (notificationPref: NotificationPref) => {
    setPreferences((prev) => ({ ...prev, notificationPref }));
  };

  const setExperienceLevel = (experienceLevel: ExperienceLevel) => {
    setPreferences((prev) => ({ ...prev, experienceLevel }));
  };

  const setRiskAppetite = (riskAppetite: RiskAppetite) => {
    setPreferences((prev) => ({ ...prev, riskAppetite }));
  };

  const setTimeHorizon = (timeHorizon: TimeHorizon) => {
    setPreferences((prev) => ({ ...prev, timeHorizon }));
  };

  const completeOnboarding = () => {
    setPreferences((prev) => ({ ...prev, hasCompletedOnboarding: true }));
  };

  const resetOnboarding = async () => {
    await apilogout();
    setUser(null);
    setPreferences(defaultPreferences);
  };

  const logout = async () => {
    await apilogout();
    setUser(null);
    setPreferences(defaultPreferences);
  };

  const updateProfile = async (data: { name?: string; avatarUrl?: string }) => {
    const result = await apiupdateProfile(data);
    if (result.user) {
      setUser((prev) => prev ? { ...prev, ...result.user } : null);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    await apichangePassword(currentPassword, newPassword);
  };

  const uploadAvatar = async (file: File) => {
    const result = await apiUploadAvatar(file);
    setUser((prev) => prev ? { ...prev, avatarUrl: result.avatarUrl } : null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        preferences,
        isLoading,
        isAuthenticated: !!user,
        setUserType,
        setSelectedInterests,
        setGoal,
        setNotificationPref,
        setExperienceLevel,
        setRiskAppetite,
        setTimeHorizon,
        completeOnboarding,
        resetOnboarding,
        logout,
        refreshUser,
        updateProfile,
        changePassword,
        uploadAvatar,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
