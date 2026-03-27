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
import { UserType, Interest, Goal, NotificationPref } from "@/lib/types";

const userTypes = [
  { id: "investor" as const, label: "Investor", icon: TrendingUp, desc: "Track markets & portfolio" },
  { id: "student" as const, label: "Student", icon: GraduationCap, desc: "Learn business & finance" },
  { id: "founder" as const, label: "Founder", icon: Rocket, desc: "Build & scale my startup" },
  { id: "exploring" as const, label: "Just Exploring", icon: Compass, desc: "Stay informed casually" },
];

const interests = [
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
  { id: "realtime" as const, label: "Real-time alerts", icon: Zap, desc: "High frequency" },
  { id: "key_only" as const, label: "Key updates only", icon: Bell, desc: "Recommended" },
  { id: "daily" as const, label: "Daily summary", icon: Clock, desc: "Once a day" },
  { id: "none" as const, label: "No notifications", icon: BellOff, desc: "Manual check" },
];

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const { setUserType, setSelectedInterests, setGoal, setNotificationPref, completeOnboarding } = useUser();
  
  const [userType, setLocalUserType] = useState<UserType>(null);
  const [selectedInterests, setSelectedInterestsLocal] = useState<Interest[]>([]);
  const [goal, setGoalLocal] = useState<Goal>(null);
  const [notificationPref, setNotificationPrefLocal] = useState<NotificationPref>(null);

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
    
    if (step < 4) {
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
    <div className="min-h-screen bg-[#080B14] flex flex-col">
      <div className="fixed top-0 left-0 right-0 h-1 bg-[#0D1220] z-50">
        <motion.div 
          className="h-full bg-gradient-to-r from-[#E8501A] to-[#F0A500]"
          initial={{ width: "25%" }}
          animate={{ width: `${step * 25}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="pt-6 px-6">
        <p className="text-sm text-[#7E8BA3] text-center">Step {step} of 4</p>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 py-8 max-w-lg mx-auto w-full">
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
                <h1 className="text-3xl font-semibold tracking-tight text-white">Let&apos;s personalize your experience</h1>
                <p className="text-[#7E8BA3] text-lg">This takes less than 30 seconds</p>
              </div>

              <div className="space-y-3">
                {userTypes.map(({ id, label, icon: Icon, desc }) => (
                  <button
                    key={id}
                    onClick={() => setLocalUserType(id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                      userType === id 
                        ? "border-[#E8501A] bg-[#E8501A]/10" 
                        : "border-white/[0.07] hover:border-[#E8501A]/50 bg-[rgba(255,255,255,0.04)]"
                    }`}
                  >
                    <div className={`p-3 rounded-xl ${userType === id ? "bg-gradient-to-r from-[#E8501A] to-[#F0A500] text-white" : "bg-white/[0.07] text-[#7E8BA3]"}`}>
                      <Icon size={24} />
                    </div>
                    <div>
                      <p className="font-medium text-lg text-white">{label}</p>
                      <p className="text-[#7E8BA3] text-sm">{desc}</p>
                    </div>
                    {userType === id && (
                      <Check className="ml-auto text-[#E8501A]" size={20} />
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
                <h1 className="text-3xl font-semibold tracking-tight text-white">What do you care about?</h1>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {interests.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => toggleInterest(id)}
                    className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all duration-200 ${
                      selectedInterests.includes(id)
                        ? "border-[#E8501A] bg-[#E8501A]/10"
                        : "border-white/[0.07] hover:border-[#E8501A]/50 bg-[rgba(255,255,255,0.04)]"
                    }`}
                  >
                    <div className={`p-3 rounded-xl ${selectedInterests.includes(id) ? "bg-gradient-to-r from-[#E8501A] to-[#F0A500] text-white" : "bg-white/[0.07] text-[#7E8BA3]"}`}>
                      <Icon size={28} />
                    </div>
                    <p className="font-medium text-center text-sm text-white">{label}</p>
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
                <h1 className="text-3xl font-semibold tracking-tight text-white">What do you want from news?</h1>
              </div>

              <div className="space-y-3">
                {goals.map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => setGoalLocal(id)}
                    className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all duration-200 text-left ${
                      goal === id 
                        ? "border-[#E8501A] bg-[#E8501A]/10" 
                        : "border-white/[0.07] hover:border-[#E8501A]/50 bg-[rgba(255,255,255,0.04)]"
                    }`}
                  >
                    <p className="font-medium text-lg text-white">{label}</p>
                    {goal === id && <Check size={20} className="text-[#E8501A]" />}
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
                <h1 className="text-3xl font-semibold tracking-tight text-white">How often should we update you?</h1>
              </div>

              <div className="space-y-3">
                {notificationPrefs.map(({ id, label, icon: Icon, desc }) => (
                  <button
                    key={id}
                    onClick={() => setNotificationPrefLocal(id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                      notificationPref === id 
                        ? "border-[#E8501A] bg-[#E8501A]/10" 
                        : "border-white/[0.07] hover:border-[#E8501A]/50 bg-[rgba(255,255,255,0.04)]"
                    }`}
                  >
                    <div className={`p-3 rounded-xl ${notificationPref === id ? "bg-gradient-to-r from-[#E8501A] to-[#F0A500] text-white" : "bg-white/[0.07] text-[#7E8BA3]"}`}>
                      <Icon size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white">{label}</p>
                      <p className="text-[#7E8BA3] text-sm">{desc}</p>
                    </div>
                    {notificationPref === id && <Check size={20} className="text-[#E8501A]" />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {step < 4 && (
          <div className="mt-8 flex justify-between items-center">
            {step > 1 && (
              <button 
                onClick={() => setStep(s => s - 1)}
                className="text-[#7E8BA3] hover:text-white transition-colors"
              >
                Back
              </button>
            )}
            <button
              onClick={handleContinue}
              disabled={!canProceed()}
              className={`ml-auto flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                canProceed() 
                  ? "bg-gradient-to-r from-[#E8501A] to-[#F0A500] text-white" 
                  : "bg-white/[0.07] text-[#7E8BA3] cursor-not-allowed"
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