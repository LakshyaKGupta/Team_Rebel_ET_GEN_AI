"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Compass, User, Settings, Bell, Shield, HelpCircle, LogOut, ArrowLeft } from "lucide-react";
import { useUser } from "@/context/UserContext";

const navItems = [
  { id: 'home', label: 'Home', icon: Home, href: '/' },
  { id: 'dashboard', label: 'Dashboard', icon: Compass, href: '/dashboard' },
  { id: 'profile', label: 'Profile', icon: User, href: '/profile' },
];

const settingsItems = [
  { icon: Bell, label: 'Notifications', desc: 'Manage alerts and updates' },
  { icon: Shield, label: 'Privacy', desc: 'Control your data' },
  { icon: HelpCircle, label: 'Help & Support', desc: 'Get assistance' },
];

export default function ProfilePage() {
  const pathname = usePathname();
  const { preferences, resetOnboarding } = useUser();

  const userTypeLabels: Record<string, string> = {
    investor: 'Investor',
    student: 'Student',
    founder: 'Founder',
    exploring: 'Just Exploring',
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-gray-100 z-50">
          <div className="max-w-6xl mx-auto px-4 lg:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-[#FF4F00] to-[#FF7A00] rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xs">ET</span>
                </div>
                <span className="font-semibold text-lg text-[#1a1a1a]">My ET</span>
              </Link>
              <div className="hidden lg:flex items-center gap-1">
                {navItems.map((item) => (
                  <Link key={item.id} href={item.href}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      pathname === item.href ? 'bg-[#FF4F00] text-white' : 'text-gray-600 hover:text-[#FF4F00] hover:bg-orange-50'
                    }`}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>

        <main className="pt-24 pb-20 px-4 lg:px-6 max-w-2xl mx-auto">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-[#FF4F00] mb-6">
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bg-gray-50 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center">
                <User size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Your Profile</h1>
                <p className="text-gray-500">{userTypeLabels[preferences.userType || 'exploring']}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Your Interests</h2>
            <div className="flex flex-wrap gap-2">
              {preferences.selectedInterests.length > 0 ? (
                preferences.selectedInterests.map((interest) => (
                  <span key={interest} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm capitalize">
                    {interest}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">No interests selected</p>
              )}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Preferences</h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <span className="text-gray-700">Notification Settings</span>
                <span className="text-gray-500 text-sm capitalize">{preferences.notificationPref || 'Default'}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <span className="text-gray-700">Your Goal</span>
                <span className="text-gray-500 text-sm capitalize">{preferences.goal?.replace('_', ' ') || 'Not set'}</span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Settings</h2>
            <div className="space-y-2">
              {settingsItems.map((item) => (
                <button key={item.label} className="w-full flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <item.icon size={20} className="text-gray-600" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={resetOnboarding}
            className="w-full flex items-center justify-center gap-2 p-4 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            <span>Reset & Start Over</span>
          </button>
        </motion.div>
      </main>
    </div>
  );
}