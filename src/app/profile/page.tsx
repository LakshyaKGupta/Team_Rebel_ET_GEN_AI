"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Home, Compass, User, Settings, Bell, Shield, HelpCircle, 
  LogOut, ArrowLeft, ArrowRight, Check,
  TrendingUp, GraduationCap, Rocket, Compass as ExploreIcon,
  LineChart, Briefcase, Globe, Cpu, PiggyBank,
  Zap, Clock, BellOff, Eye, Target, Clock3, Lock, Mail
} from "lucide-react";
import { useUser } from "@/context/UserContext";
import { UserType, Interest, Goal, NotificationPref, ExperienceLevel, RiskAppetite, TimeHorizon } from "@/lib/types";
import { apiupdatePreferences } from "@/lib/api";

const newspaperColors = {
  paper: "#F5F0E6",
  ink: "#1A1A1A",
  accent: "#8B4513",
  muted: "#5C5C5C",
  line: "#D4CFC4",
};

const userTypes = [
  { id: "investor" as const, label: "Investor", icon: TrendingUp, desc: "Track markets & portfolio" },
  { id: "student" as const, label: "Student", icon: GraduationCap, desc: "Learn business & finance" },
  { id: "founder" as const, label: "Founder", icon: Rocket, desc: "Build & scale my startup" },
  { id: "exploring" as const, label: "Just Exploring", icon: ExploreIcon, desc: "Stay informed casually" },
];

const allInterests = [
  { id: "stocks" as const, label: "Stocks & Markets", icon: LineChart },
  { id: "startups" as const, label: "Startups & Funding", icon: Briefcase },
  { id: "economy" as const, label: "Economy & Policy", icon: Globe },
  { id: "global" as const, label: "Global Business", icon: Globe },
  { id: "tech" as const, label: "Technology", icon: Cpu },
  { id: "finance" as const, label: "Personal Finance", icon: PiggyBank },
];

const goals = [
  { id: "invest" as const, label: "Make better investment decisions" },
  { id: "stay_updated" as const, label: "Stay updated quickly" },
  { id: "learn" as const, label: "Learn and understand deeply" },
];

const notificationPrefs = [
  { id: "realtime" as const, label: "Real-time alerts", icon: Zap },
  { id: "key_only" as const, label: "Key updates only", icon: Bell },
  { id: "daily" as const, label: "Daily summary", icon: Clock },
  { id: "none" as const, label: "No notifications", icon: BellOff },
];

const notificationLabels: Record<string, string> = {
  realtime: "Real-time alerts",
  key_only: "Key updates only",
  daily: "Daily summary",
  none: "No notifications",
};

const experienceLevels = [
  { id: "beginner" as const, label: "Beginner", desc: "New to investing & markets" },
  { id: "intermediate" as const, label: "Intermediate", desc: "Understand basics, want to learn more" },
  { id: "advanced" as const, label: "Advanced", desc: "Experienced investor or finance professional" },
];

const riskAppetites = [
  { id: "conservative" as const, label: "Conservative", desc: "Prefer stability over high returns" },
  { id: "moderate" as const, label: "Moderate", desc: "Balance between growth and safety" },
  { id: "aggressive" as const, label: "Aggressive", desc: "Comfortable with volatility for higher returns" },
];

const timeHorizons = [
  { id: "short" as const, label: "Short Term", desc: "Days to months" },
  { id: "medium" as const, label: "Medium Term", desc: "1-3 years" },
  { id: "long" as const, label: "Long Term", desc: "3+ years" },
];

type EditMode = 'none' | 'userType' | 'interests' | 'goal' | 'notifications' | 'experienceLevel' | 'riskAppetite' | 'timeHorizon';

export default function ProfilePage() {
  const router = useRouter();
  const { preferences, setUserType, setSelectedInterests, setGoal, setNotificationPref, setExperienceLevel, setRiskAppetite, setTimeHorizon, logout, user } = useUser();
  
  const [editMode, setEditMode] = useState<EditMode>('none');
  const [tempUserType, setTempUserType] = useState<UserType>(preferences.userType);
  const [tempInterests, setTempInterests] = useState<Interest[]>(preferences.selectedInterests);
  const [tempGoal, setTempGoal] = useState<Goal>(preferences.goal);
  const [tempNotificationPref, setTempNotificationPref] = useState<NotificationPref>(preferences.notificationPref);
  const [tempExperienceLevel, setTempExperienceLevel] = useState<ExperienceLevel>(preferences.experienceLevel || null);
  const [tempRiskAppetite, setTempRiskAppetite] = useState<RiskAppetite>(preferences.riskAppetite || null);
  const [tempTimeHorizon, setTempTimeHorizon] = useState<TimeHorizon>(preferences.timeHorizon || null);

  const userTypeLabels: Record<string, string> = {
    investor: 'Investor',
    student: 'Student',
    founder: 'Founder',
    exploring: 'Just Exploring',
  };

  const toggleInterest = (interest: Interest) => {
    setTempInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const saveChanges = async () => {
    try {
      if (editMode === 'userType') {
        setUserType(tempUserType);
        await apiupdatePreferences({ userType: tempUserType || undefined });
      }
      if (editMode === 'interests') {
        setSelectedInterests(tempInterests);
        await apiupdatePreferences({ selectedInterests: tempInterests });
      }
      if (editMode === 'goal') {
        setGoal(tempGoal);
        await apiupdatePreferences({ goal: tempGoal || undefined });
      }
      if (editMode === 'notifications') {
        setNotificationPref(tempNotificationPref);
        await apiupdatePreferences({ notificationPref: tempNotificationPref || undefined });
      }
      if (editMode === 'experienceLevel') {
        setExperienceLevel(tempExperienceLevel);
        await apiupdatePreferences({ experienceLevel: tempExperienceLevel || undefined });
      }
      if (editMode === 'riskAppetite') {
        setRiskAppetite(tempRiskAppetite);
        await apiupdatePreferences({ riskAppetite: tempRiskAppetite || undefined });
      }
      if (editMode === 'timeHorizon') {
        setTimeHorizon(tempTimeHorizon);
        await apiupdatePreferences({ timeHorizon: tempTimeHorizon || undefined });
      }
      setEditMode('none');
    } catch (error) {
      console.error("Failed to save preferences:", error);
    }
  };

  const cancelEdit = () => {
    setTempUserType(preferences.userType);
    setTempInterests(preferences.selectedInterests);
    setTempGoal(preferences.goal);
    setTempNotificationPref(preferences.notificationPref);
    setTempExperienceLevel(preferences.experienceLevel || null);
    setTempRiskAppetite(preferences.riskAppetite || null);
    setTempTimeHorizon(preferences.timeHorizon || null);
    setEditMode('none');
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#F5F0E6]">
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ backgroundColor: newspaperColors.paper, borderBottom: `2px solid ${newspaperColors.ink}` }}>
        <div className="max-w-6xl mx-auto px-4 lg:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center" style={{ backgroundColor: newspaperColors.ink, color: newspaperColors.paper }}>
                <span className="font-serif font-bold text-sm">ET</span>
              </div>
              <span className="font-serif font-bold text-sm" style={{ color: newspaperColors.ink }}>THE ECONOMIC TIMES</span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-20 px-4 lg:px-6 max-w-2xl mx-auto">
        <Link href="/dashboard" className="flex items-center gap-2 mb-6" style={{ color: newspaperColors.muted }}>
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bg-white border-2 mb-6 p-6" style={{ borderColor: newspaperColors.line, boxShadow: `4px 4px 0px ${newspaperColors.line}` }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 flex items-center justify-center" style={{ backgroundColor: newspaperColors.ink, color: newspaperColors.paper }}>
                <User size={32} />
              </div>
              <div>
                <h1 className="font-serif text-2xl font-bold" style={{ color: newspaperColors.ink }}>Your Profile</h1>
                <p className="font-serif" style={{ color: newspaperColors.muted }}>{userTypeLabels[preferences.userType || 'exploring']}</p>
              </div>
            </div>
          </div>

          {editMode === 'userType' && (
            <div className="bg-white border-2 mb-6 p-6" style={{ borderColor: newspaperColors.accent, boxShadow: `4px 4px 0px ${newspaperColors.accent}40` }}>
              <h2 className="font-serif text-xl font-bold mb-4" style={{ color: newspaperColors.ink }}>Who are you?</h2>
              <div className="space-y-3">
                {userTypes.map(({ id, label, icon: Icon, desc }) => (
                  <button
                    key={id}
                    onClick={() => setTempUserType(id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                      tempUserType === id 
                        ? 'border-[#8B4513] bg-[#F5F0E6]' 
                        : 'border-[#D4CFC4] hover:border-[#8B4513]'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${tempUserType === id ? 'bg-[#8B4513] text-white' : 'bg-[#F5F0E6]'}`}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <p className="font-medium" style={{ color: newspaperColors.ink }}>{label}</p>
                      <p className="text-sm" style={{ color: newspaperColors.muted }}>{desc}</p>
                    </div>
                    {tempUserType === id && <Check className="ml-auto text-[#8B4513]" size={20} />}
                  </button>
                ))}
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={cancelEdit} className="flex-1 py-3 border-2 font-medium" style={{ borderColor: newspaperColors.line, color: newspaperColors.muted }}>Cancel</button>
                <button onClick={saveChanges} className="flex-1 py-3 font-medium text-white" style={{ backgroundColor: newspaperColors.ink }}>Save</button>
              </div>
            </div>
          )}

          {editMode === 'interests' && (
            <div className="bg-white border-2 mb-6 p-6" style={{ borderColor: newspaperColors.accent, boxShadow: `4px 4px 0px ${newspaperColors.accent}40` }}>
              <h2 className="font-serif text-xl font-bold mb-4" style={{ color: newspaperColors.ink }}>What do you care about?</h2>
              <div className="grid grid-cols-2 gap-3">
                {allInterests.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => toggleInterest(id)}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                      tempInterests.includes(id)
                        ? 'border-[#8B4513] bg-[#F5F0E6]' 
                        : 'border-[#D4CFC4] hover:border-[#8B4513]'
                    }`}
                  >
                    <Icon size={20} style={{ color: tempInterests.includes(id) ? newspaperColors.accent : newspaperColors.muted }} />
                    <span className="text-sm font-medium" style={{ color: newspaperColors.ink }}>{label}</span>
                  </button>
                ))}
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={cancelEdit} className="flex-1 py-3 border-2 font-medium" style={{ borderColor: newspaperColors.line, color: newspaperColors.muted }}>Cancel</button>
                <button onClick={saveChanges} className="flex-1 py-3 font-medium text-white" style={{ backgroundColor: newspaperColors.ink }}>Save</button>
              </div>
            </div>
          )}

          {editMode === 'goal' && (
            <div className="bg-white border-2 mb-6 p-6" style={{ borderColor: newspaperColors.accent, boxShadow: `4px 4px 0px ${newspaperColors.accent}40` }}>
              <h2 className="font-serif text-xl font-bold mb-4" style={{ color: newspaperColors.ink }}>What do you want from news?</h2>
              <div className="space-y-3">
                {goals.map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => setTempGoal(id)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left ${
                      tempGoal === id 
                        ? 'border-[#8B4513] bg-[#F5F0E6]' 
                        : 'border-[#D4CFC4] hover:border-[#8B4513]'
                    }`}
                  >
                    <span className="font-medium" style={{ color: newspaperColors.ink }}>{label}</span>
                    {tempGoal === id && <Check size={20} style={{ color: newspaperColors.accent }} />}
                  </button>
                ))}
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={cancelEdit} className="flex-1 py-3 border-2 font-medium" style={{ borderColor: newspaperColors.line, color: newspaperColors.muted }}>Cancel</button>
                <button onClick={saveChanges} className="flex-1 py-3 font-medium text-white" style={{ backgroundColor: newspaperColors.ink }}>Save</button>
              </div>
            </div>
          )}

          {editMode === 'notifications' && (
            <div className="bg-white border-2 mb-6 p-6" style={{ borderColor: newspaperColors.accent, boxShadow: `4px 4px 0px ${newspaperColors.accent}40` }}>
              <h2 className="font-serif text-xl font-bold mb-4" style={{ color: newspaperColors.ink }}>How often should we update you?</h2>
              <div className="space-y-3">
                {notificationPrefs.map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => setTempNotificationPref(id)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left ${
                      tempNotificationPref === id 
                        ? 'border-[#8B4513] bg-[#F5F0E6]' 
                        : 'border-[#D4CFC4] hover:border-[#8B4513]'
                    }`}
                  >
                    <span className="font-medium" style={{ color: newspaperColors.ink }}>{label}</span>
                    {tempNotificationPref === id && <Check size={20} style={{ color: newspaperColors.accent }} />}
                  </button>
                ))}
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={cancelEdit} className="flex-1 py-3 border-2 font-medium" style={{ borderColor: newspaperColors.line, color: newspaperColors.muted }}>Cancel</button>
                <button onClick={saveChanges} className="flex-1 py-3 font-medium text-white" style={{ backgroundColor: newspaperColors.ink }}>Save</button>
              </div>
            </div>
          )}

          {editMode === 'experienceLevel' && (
            <div className="bg-white border-2 mb-6 p-6" style={{ borderColor: newspaperColors.accent, boxShadow: `4px 4px 0px ${newspaperColors.accent}40` }}>
              <h2 className="font-serif text-xl font-bold mb-4" style={{ color: newspaperColors.ink }}>What's your experience level?</h2>
              <div className="space-y-3">
                {experienceLevels.map(({ id, label, desc }) => (
                  <button
                    key={id}
                    onClick={() => setTempExperienceLevel(id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                      tempExperienceLevel === id 
                        ? 'border-[#8B4513] bg-[#F5F0E6]' 
                        : 'border-[#D4CFC4] hover:border-[#8B4513]'
                    }`}
                  >
                    <div className="flex-1">
                      <p className="font-medium" style={{ color: newspaperColors.ink }}>{label}</p>
                      <p className="text-sm" style={{ color: newspaperColors.muted }}>{desc}</p>
                    </div>
                    {tempExperienceLevel === id && <Check size={20} style={{ color: newspaperColors.accent }} />}
                  </button>
                ))}
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={cancelEdit} className="flex-1 py-3 border-2 font-medium" style={{ borderColor: newspaperColors.line, color: newspaperColors.muted }}>Cancel</button>
                <button onClick={saveChanges} className="flex-1 py-3 font-medium text-white" style={{ backgroundColor: newspaperColors.ink }}>Save</button>
              </div>
            </div>
          )}

          {editMode === 'riskAppetite' && (
            <div className="bg-white border-2 mb-6 p-6" style={{ borderColor: newspaperColors.accent, boxShadow: `4px 4px 0px ${newspaperColors.accent}40` }}>
              <h2 className="font-serif text-xl font-bold mb-4" style={{ color: newspaperColors.ink }}>What's your risk appetite?</h2>
              <div className="space-y-3">
                {riskAppetites.map(({ id, label, desc }) => (
                  <button
                    key={id}
                    onClick={() => setTempRiskAppetite(id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                      tempRiskAppetite === id 
                        ? 'border-[#8B4513] bg-[#F5F0E6]' 
                        : 'border-[#D4CFC4] hover:border-[#8B4513]'
                    }`}
                  >
                    <div className="flex-1">
                      <p className="font-medium" style={{ color: newspaperColors.ink }}>{label}</p>
                      <p className="text-sm" style={{ color: newspaperColors.muted }}>{desc}</p>
                    </div>
                    {tempRiskAppetite === id && <Check size={20} style={{ color: newspaperColors.accent }} />}
                  </button>
                ))}
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={cancelEdit} className="flex-1 py-3 border-2 font-medium" style={{ borderColor: newspaperColors.line, color: newspaperColors.muted }}>Cancel</button>
                <button onClick={saveChanges} className="flex-1 py-3 font-medium text-white" style={{ backgroundColor: newspaperColors.ink }}>Save</button>
              </div>
            </div>
          )}

          {editMode === 'timeHorizon' && (
            <div className="bg-white border-2 mb-6 p-6" style={{ borderColor: newspaperColors.accent, boxShadow: `4px 4px 0px ${newspaperColors.accent}40` }}>
              <h2 className="font-serif text-xl font-bold mb-4" style={{ color: newspaperColors.ink }}>What's your time horizon?</h2>
              <div className="space-y-3">
                {timeHorizons.map(({ id, label, desc }) => (
                  <button
                    key={id}
                    onClick={() => setTempTimeHorizon(id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                      tempTimeHorizon === id 
                        ? 'border-[#8B4513] bg-[#F5F0E6]' 
                        : 'border-[#D4CFC4] hover:border-[#8B4513]'
                    }`}
                  >
                    <div className="flex-1">
                      <p className="font-medium" style={{ color: newspaperColors.ink }}>{label}</p>
                      <p className="text-sm" style={{ color: newspaperColors.muted }}>{desc}</p>
                    </div>
                    {tempTimeHorizon === id && <Check size={20} style={{ color: newspaperColors.accent }} />}
                  </button>
                ))}
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={cancelEdit} className="flex-1 py-3 border-2 font-medium" style={{ borderColor: newspaperColors.line, color: newspaperColors.muted }}>Cancel</button>
                <button onClick={saveChanges} className="flex-1 py-3 font-medium text-white" style={{ backgroundColor: newspaperColors.ink }}>Save</button>
              </div>
            </div>
          )}

          {editMode === 'none' && (
            <>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-serif text-lg font-bold" style={{ color: newspaperColors.ink }}>Your Type</h2>
                  <button onClick={() => setEditMode('userType')} className="text-sm font-medium" style={{ color: newspaperColors.accent }}>Edit</button>
                </div>
                <div className="bg-white border-2 p-4" style={{ borderColor: newspaperColors.line }}>
                  <span className="font-medium" style={{ color: newspaperColors.ink }}>{userTypeLabels[preferences.userType || 'exploring']}</span>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-serif text-lg font-bold" style={{ color: newspaperColors.ink }}>Your Interests</h2>
                  <button onClick={() => setEditMode('interests')} className="text-sm font-medium" style={{ color: newspaperColors.accent }}>Edit</button>
                </div>
                <div className="bg-white border-2 p-4">
                  <div className="flex flex-wrap gap-2">
                    {preferences.selectedInterests.length > 0 ? (
                      preferences.selectedInterests.map((interest) => (
                        <span key={interest} className="px-3 py-1.5 text-sm capitalize border" style={{ borderColor: newspaperColors.line, color: newspaperColors.ink }}>
                          {interest}
                        </span>
                      ))
                    ) : (
                      <p style={{ color: newspaperColors.muted }}>No interests selected</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-serif text-lg font-bold" style={{ color: newspaperColors.ink }}>Your Goal</h2>
                  <button onClick={() => setEditMode('goal')} className="text-sm font-medium" style={{ color: newspaperColors.accent }}>Edit</button>
                </div>
                <div className="bg-white border-2 p-4" style={{ borderColor: newspaperColors.line }}>
                  <p className="font-medium capitalize" style={{ color: newspaperColors.ink }}>{preferences.goal?.replace('_', ' ') || 'Not set'}</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-serif text-lg font-bold" style={{ color: newspaperColors.ink }}>Notification Preference</h2>
                  <button onClick={() => setEditMode('notifications')} className="text-sm font-medium" style={{ color: newspaperColors.accent }}>Edit</button>
                </div>
                <div className="bg-white border-2 p-4" style={{ borderColor: newspaperColors.line }}>
                  <p className="font-medium" style={{ color: newspaperColors.ink }}>{notificationLabels[preferences.notificationPref || 'key_only']}</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-serif text-lg font-bold" style={{ color: newspaperColors.ink }}>Experience Level</h2>
                  <button onClick={() => setEditMode('experienceLevel')} className="text-sm font-medium" style={{ color: newspaperColors.accent }}>Edit</button>
                </div>
                <div className="bg-white border-2 p-4" style={{ borderColor: newspaperColors.line }}>
                  <p className="font-medium capitalize" style={{ color: newspaperColors.ink }}>{preferences.experienceLevel || 'Not set'}</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-serif text-lg font-bold" style={{ color: newspaperColors.ink }}>Risk Appetite</h2>
                  <button onClick={() => setEditMode('riskAppetite')} className="text-sm font-medium" style={{ color: newspaperColors.accent }}>Edit</button>
                </div>
                <div className="bg-white border-2 p-4" style={{ borderColor: newspaperColors.line }}>
                  <p className="font-medium capitalize" style={{ color: newspaperColors.ink }}>{preferences.riskAppetite || 'Not set'}</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-serif text-lg font-bold" style={{ color: newspaperColors.ink }}>Time Horizon</h2>
                  <button onClick={() => setEditMode('timeHorizon')} className="text-sm font-medium" style={{ color: newspaperColors.accent }}>Edit</button>
                </div>
                <div className="bg-white border-2 p-4" style={{ borderColor: newspaperColors.line }}>
                  <p className="font-medium capitalize" style={{ color: newspaperColors.ink }}>{preferences.timeHorizon || 'Not set'}</p>
                </div>
              </div>

              <div className="mb-6 bg-white border-2 p-4" style={{ borderColor: newspaperColors.line }}>
                <div className="flex items-center gap-3 mb-3">
                  <Mail size={18} style={{ color: newspaperColors.muted }} />
                  <span className="font-medium" style={{ color: newspaperColors.ink }}>Account</span>
                </div>
                <p className="text-sm" style={{ color: newspaperColors.muted }}>{user?.email || 'Not available'}</p>
              </div>
            </>
          )}

          <div className="pt-6 mt-8" style={{ borderTop: `2px solid ${newspaperColors.line}` }}>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-4 border-2 font-medium transition-all hover:bg-red-50"
              style={{ borderColor: '#DC2626', color: '#DC2626' }}
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
