"use client";

import { useUser } from "@/context/UserContext";
import Onboarding from "./onboarding/page";
import Dashboard from "./dashboard/page";

export default function RootPage() {
  const { preferences } = useUser();

  if (!preferences.hasCompletedOnboarding) {
    return <Onboarding />;
  }

  return <Dashboard />;
}