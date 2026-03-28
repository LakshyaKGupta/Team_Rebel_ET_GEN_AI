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
  ArrowLeft,
  Check,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { useUser } from "@/context/UserContext";
import { UserType, Interest, Goal, NotificationPref } from "@/lib/types";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

type AuthMode = "signup" | "login";

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [authMode, setAuthMode] = useState<AuthMode>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { setUserType, setSelectedInterests, setGoal, setNotificationPref, completeOnboarding, preferences } = useUser();
  
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

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsLoading(true);

    if (!email || !password) {
      setAuthError("Please enter email and password");
      setIsLoading(false);
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 800));

    const users = JSON.parse(localStorage.getItem("myet_users") || "[]");
    
    if (authMode === "signup") {
      if (users.find((u: any) => u.email === email)) {
        setAuthError("Email already exists");
        setIsLoading(false);
        return;
      }
      const newUser = { email, password, createdAt: new Date().toISOString() };
      users.push(newUser);
      localStorage.setItem("myet_users", JSON.stringify(users));
      localStorage.setItem("myet_current_user", email);
    } else {
      const user = users.find((u: any) => u.email === email && u.password === password);
      if (!user) {
        setAuthError("Invalid email or password");
        setIsLoading(false);
        return;
      }
      localStorage.setItem("myet_current_user", email);
    }

    const allPrefs = JSON.parse(localStorage.getItem("myet_preferences") || "{}");
    const userPrefs = allPrefs[email];
    
    if (userPrefs && userPrefs.hasCompletedOnboarding) {
      router.push("/dashboard");
      setIsLoading(false);
      return;
    }

    if (userPrefs) {
      setLocalUserType(userPrefs.userType);
      setSelectedInterestsLocal(userPrefs.selectedInterests || []);
      setGoalLocal(userPrefs.goal);
      setNotificationPrefLocal(userPrefs.notificationPref);
    }

    setIsLoading(false);
    setStep(1);
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
      router.push("/dashboard");
    }
  };

  const handleBack = () => {
    if (step === 1) {
      setStep(0);
    } else {
      setStep(s => s - 1);
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

  if (step === 0) {
    return (
      <div className="min-h-screen bg-[#080B14] flex flex-col">
        <div className="pt-6 px-6">
          <Link href="/" className="text-[#7E8BA3] hover:text-white transition-colors text-sm flex items-center gap-2">
            <ArrowLeft size={16} /> Back to home
          </Link>
        </div>

        <div className="flex-1 flex flex-col justify-center px-6 py-8 max-w-md mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-white">
                {authMode === "signup" ? "Create your account" : "Welcome back"}
              </h1>
              <p className="text-[#7E8BA3]">
                {authMode === "signup" ? "Start your personalized newsroom" : "Sign in to continue"}
              </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label className="text-sm text-[#7E8BA3] mb-2 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7E8BA3]" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.07] border border-white/[0.07] text-white placeholder-[#7E8BA3] focus:outline-none focus:border-[#E8501A] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-[#7E8BA3] mb-2 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7E8BA3]" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3 rounded-xl bg-white/[0.07] border border-white/[0.07] text-white placeholder-[#7E8BA3] focus:outline-none focus:border-[#E8501A] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7E8BA3] hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {authError && (
                <p className="text-red-400 text-sm">{authError}</p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium bg-gradient-to-r from-[#E8501A] to-[#F0A500] text-white transition-all hover:opacity-90 disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {authMode === "signup" ? "Create Account" : "Sign In"}
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="text-center">
              <p className="text-[#7E8BA3]">
                {authMode === "signup" ? "Already have an account?" : "Don't have an account?"}{" "}
                <button
                  onClick={() => {
                    setAuthMode(authMode === "signup" ? "login" : "signup");
                    setAuthError("");
                  }}
                  className="text-[#E8501A] hover:underline"
                >
                  {authMode === "signup" ? "Sign in" : "Sign up"}
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

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

      <div className="pt-4 px-4 flex justify-between items-center">
        <button 
          onClick={handleBack}
          className="text-[#7E8BA3] hover:text-white transition-colors flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Back
        </button>
        <p className="text-sm text-[#7E8BA3]">Step {step} of 4</p>
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
                <h1 className="text-3xl font-semibold tracking-tight text-white">Who are you?</h1>
                <p className="text-[#7E8BA3] text-lg">This helps us personalize your news</p>
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
                <p className="text-[#7E8BA3]">Select at least one</p>
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

        {step > 0 && (
          <div className="mt-8">
            <button
              onClick={handleContinue}
              disabled={!canProceed()}
              className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-medium transition-all ${
                canProceed() 
                  ? "bg-gradient-to-r from-[#E8501A] to-[#F0A500] text-white" 
                  : "bg-white/[0.07] text-[#7E8BA3] cursor-not-allowed"
              }`}
            >
              {step === 4 ? "Get Started" : "Continue"}
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
