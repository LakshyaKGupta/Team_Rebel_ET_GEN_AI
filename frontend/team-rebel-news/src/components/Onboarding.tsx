"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, 
  GraduationCap, 
  Rocket, 
  Compass,
  LineChart,
  Briefcase,
  Globe,
  Cpu,
  PiggyBank,
  Bell,
  Zap,
  Clock,
  BellOff,
  ArrowRight,
  Check
} from "lucide-react";
import { useUser } from "@/context/UserContext";

type UserType = "investor" | "student" | "founder" | "exploring" | null;
type Interest = "stocks" | "startups" | "economy" | "global" | "tech" | "finance";
type Goal = "invest" | "stay_updated" | "learn" | null;
type NotificationPref = "realtime" | "key_only" | "daily" | "none" | null;

const userTypes = [
  { id: "investor", label: "Investor", icon: TrendingUp, desc: "Track markets & portfolio" },
  { id: "student", label: "Student", icon: GraduationCap, desc: "Learn business & finance" },
  { id: "founder", label: "Founder", icon: Rocket, desc: "Build & scale my startup" },
  { id: "exploring", label: "Just Exploring", icon: Compass, desc: "Stay informed casually" },
] as const;

const interests = [
  { id: "stocks", label: "Stocks & Markets", icon: LineChart },
  { id: "startups", label: "Startups & Funding", icon: Briefcase },
  { id: "economy", label: "Economy & Policy", icon: Globe },
  { id: "global", label: "Global Business", icon: Globe },
  { id: "tech", label: "Technology", icon: Cpu },
  { id: "finance", label: "Personal Finance", icon: PiggyBank },
] as const;

const goals = [
  { id: "invest", label: "Make better investment decisions" },
  { id: "stay_updated", label: "Stay updated quickly" },
  { id: "learn", label: "Learn and understand deeply" },
] as const;

const notificationPrefs = [
  { id: "realtime", label: "Real-time alerts", icon: Zap, desc: "High frequency" },
  { id: "key_only", label: "Key updates only", icon: Bell, desc: "Recommended" },
  { id: "daily", label: "Daily summary", icon: Clock, desc: "Once a day" },
  { id: "none", label: "No notifications", icon: BellOff, desc: "Manual check" },
] as const;

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const { preferences, setUserType, setSelectedInterests, setGoal, setNotificationPref, completeOnboarding } = useUser();
  
  const [userType, setLocalUserType] = useState<UserType>(preferences.userType);
  const [selectedInterests, setSelectedInterestsLocal] = useState<Interest[]>(preferences.selectedInterests);
  const [goal, setGoalLocal] = useState<Goal>(preferences.goal);
  const [notificationPref, setNotificationPrefLocal] = useState<NotificationPref>(preferences.notificationPref);

  const toggleInterest = (interest: Interest) => {
    setSelectedInterestsLocal(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const canProceed = () => {
    if (step === 1) return !!userType;
    if (step === 2) return selectedInterests.length > 0;
    if (step === 3) return !!goal;
    if (step === 4) return !!notificationPref;
    return true;
  };

  const handleContinue = () => {
    if (step === 1) setUserType(userType);
    if (step === 2) setSelectedInterests(selectedInterests);
    if (step === 3) setGoal(goal);
    if (step === 4) setNotificationPref(notificationPref);
    
    if (step < 5) {
      setStep(s => s + 1);
    } else {
      completeOnboarding();
    }
  };

  const getSampleContent = () => {
    if (userType === "investor") {
      return { title: "RBI Policy Impact", subtitle: "Tailored for Investors", topic: "Economy" };
    }
    if (userType === "student") {
      return { title: "Understanding Markets", subtitle: "Quick explainer", topic: "Basics" };
    }
    if (userType === "founder") {
      return { title: "Startup Funding Round", subtitle: "Competitor analysis", topic: "Startups" };
    }
    return { title: "Today's Top Stories", subtitle: "Curated for you", topic: "General" };
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-100 z-50">
        <motion.div 
          className="h-full bg-black"
          initial={{ width: "20%" }}
          animate={{ width: `${step * 20}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 py-12 max-w-lg mx-auto w-full">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight">Let&apos;s personalize your news experience</h1>
                <p className="text-gray-500 text-lg">This takes less than 30 seconds</p>
              </div>

              <div className="space-y-3">
                {userTypes.map(({ id, label, icon: Icon, desc }) => (
                  <button
                    key={id}
                    onClick={() => setLocalUserType(id as UserType)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                      userType === id 
                        ? "border-black bg-gray-50" 
                        : "border-gray-100 hover:border-gray-300"
                    }`}
                  >
                    <div className={`p-3 rounded-xl ${userType === id ? "bg-black text-white" : "bg-gray-100"}`}>
                      <Icon size={24} />
                    </div>
                    <div>
                      <p className="font-medium text-lg">{label}</p>
                      <p className="text-gray-500 text-sm">{desc}</p>
                    </div>
                    {userType === id && (
                      <Check className="ml-auto" size={20} />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight">What do you care about?</h1>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {interests.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => toggleInterest(id as Interest)}
                    className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all duration-200 ${
                      selectedInterests.includes(id as Interest)
                        ? "border-black bg-gray-50"
                        : "border-gray-100 hover:border-gray-300"
                    }`}
                  >
                    <div className={`p-3 rounded-xl ${selectedInterests.includes(id as Interest) ? "bg-black text-white" : "bg-gray-100"}`}>
                      <Icon size={28} />
                    </div>
                    <p className="font-medium text-center text-sm">{label}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight">What do you want from news?</h1>
              </div>

              <div className="space-y-3">
                {goals.map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => setGoalLocal(id as Goal)}
                    className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all duration-200 text-left ${
                      goal === id 
                        ? "border-black bg-gray-50" 
                        : "border-gray-100 hover:border-gray-300"
                    }`}
                  >
                    <p className="font-medium text-lg">{label}</p>
                    {goal === id && <Check size={20} />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight">How often should we update you?</h1>
              </div>

              <div className="space-y-3">
                {notificationPrefs.map(({ id, label, icon: Icon, desc }) => (
                  <button
                    key={id}
                    onClick={() => setNotificationPrefLocal(id as NotificationPref)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                      notificationPref === id 
                        ? "border-black bg-gray-50" 
                        : "border-gray-100 hover:border-gray-300"
                    }`}
                  >
                    <div className={`p-3 rounded-xl ${notificationPref === id ? "bg-black text-white" : "bg-gray-100"}`}>
                      <Icon size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{label}</p>
                      <p className="text-gray-500 text-sm">{desc}</p>
                    </div>
                    {notificationPref === id && <Check size={20} />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight">Your personalized news experience is ready</h1>
              </div>

              <div className="bg-gray-50 rounded-3xl p-6 space-y-4">
                {(() => {
                  const sample = getSampleContent();
                  return (
                    <>
                      <div className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-wide">
                        <span>{sample.topic}</span>
                        <span>•</span>
                        <span>Just now</span>
                      </div>
                      <h3 className="text-xl font-semibold">{sample.title}</h3>
                      <p className="text-gray-500">{sample.subtitle}</p>
                      <div className="flex gap-2 pt-2">
                        <span className="px-3 py-1 bg-gray-200 rounded-full text-xs">Briefing</span>
                        <span className="px-3 py-1 bg-gray-200 rounded-full text-xs">5 min read</span>
                      </div>
                    </>
                  );
                })()}
              </div>

              <button 
                onClick={handleContinue}
                className="w-full bg-black text-white py-4 rounded-2xl font-medium text-lg flex items-center justify-center gap-2"
              >
                Enter My Newsroom
                <ArrowRight size={20} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {step < 5 && (
          <div className="mt-8 flex justify-between items-center">
            {step > 1 && (
              <button 
                onClick={() => setStep(s => s - 1)}
                className="text-gray-500 hover:text-black transition-colors"
              >
                Back
              </button>
            )}
            <button
              onClick={handleContinue}
              disabled={!canProceed()}
              className={`ml-auto flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                canProceed() 
                  ? "bg-black text-white" 
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              Continue
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
