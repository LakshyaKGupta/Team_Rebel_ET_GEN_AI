"use client";

import { useUser } from "@/context/UserContext";
import Onboarding from "@/components/Onboarding";
import HomeScreen from "@/components/HomeScreen";

export default function Home() {
  const { preferences } = useUser();

  if (!preferences.hasCompletedOnboarding) {
    return <Onboarding />;
  }

  return <HomeScreen />;
}
