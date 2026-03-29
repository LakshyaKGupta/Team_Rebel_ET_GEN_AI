"use client";

import { useUser } from "@/context/UserContext";
import Onboarding from "./onboarding/page";
import Dashboard from "./dashboard/page";
import LandingPage from "@/components/landing/LandingPage";

export default function RootPage() {
  const { preferences, isAuthenticated, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#080B14] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#E8501A] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  if (!preferences.hasCompletedOnboarding) {
    return <Onboarding />;
  }

  return <Dashboard />;
}
