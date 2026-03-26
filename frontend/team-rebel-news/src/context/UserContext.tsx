"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

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

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);

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
    setPreferences(defaultPreferences);
  };

  return (
    <UserContext.Provider
      value={{
        preferences,
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
