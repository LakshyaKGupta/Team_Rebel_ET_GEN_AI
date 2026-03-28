"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type UserType = "investor" | "student" | "founder" | "exploring" | null;
type Interest = "stocks" | "startups" | "economy" | "global" | "tech" | "finance";
type Goal = "invest" | "stay_updated" | "learn" | null;
type NotificationPref = "realtime" | "key_only" | "daily" | "none" | null;

interface UserPreferences {
  userType: UserType;
  selectedInterests: Interest[];
  goal: Goal;
  notificationPref: NotificationPref;
  hasCompletedOnboarding: boolean;
}

interface UserContextType {
  preferences: UserPreferences;
  isLoading: boolean;
  currentUser: string | null;
  setUserType: (type: UserType) => void;
  setSelectedInterests: (interests: Interest[]) => void;
  setGoal: (goal: Goal) => void;
  setNotificationPref: (pref: NotificationPref) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

const defaultPreferences: UserPreferences = {
  userType: null,
  selectedInterests: [],
  goal: null,
  notificationPref: null,
  hasCompletedOnboarding: false,
};

const STORAGE_KEY = "myet_preferences";

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  const loadPreferencesForUser = (email: string) => {
    const allPrefs = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return allPrefs[email] || { ...defaultPreferences };
  };

  const savePreferencesForUser = (email: string, prefs: UserPreferences) => {
    const allPrefs = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    allPrefs[email] = prefs;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allPrefs));
  };

  useEffect(() => {
    const user = localStorage.getItem("myet_current_user");
    setCurrentUser(user);
    
    if (user) {
      const userPrefs = loadPreferencesForUser(user);
      setPreferences(userPrefs);
    }
    
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated && currentUser) {
      savePreferencesForUser(currentUser, preferences);
    }
  }, [preferences, currentUser, isHydrated]);

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

  const completeOnboarding = () => {
    setPreferences((prev) => ({ ...prev, hasCompletedOnboarding: true }));
  };

  const resetOnboarding = () => {
    if (currentUser) {
      savePreferencesForUser(currentUser, defaultPreferences);
    }
    setPreferences(defaultPreferences);
  };

  return (
    <UserContext.Provider
      value={{
        preferences,
        isLoading: !isHydrated,
        currentUser,
        setUserType,
        setSelectedInterests,
        setGoal,
        setNotificationPref,
        completeOnboarding,
        resetOnboarding,
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
