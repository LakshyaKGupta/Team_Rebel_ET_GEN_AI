"use client";

import { useState, useEffect } from "react";
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
  ArrowRight,
  ArrowLeft,
  Check,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { useUser } from "@/context/UserContext";
import { apisignup, apilogin, apiupdatePreferences, apiForgotPassword, apiGoogleLogin } from "@/lib/api";
import { GoogleLogin } from "@react-oauth/google";
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
  { id: "realtime" as const, label: "Real-time alerts", desc: "High frequency" },
  { id: "key_only" as const, label: "Key updates only", desc: "Recommended" },
  { id: "daily" as const, label: "Daily summary", desc: "Once a day" },
  { id: "none" as const, label: "No notifications", desc: "Manual check" },
];

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

type AuthMode = "signup" | "login" | "forgot_password";

export default function Onboarding() {
  const router = useRouter();
  const { preferences, isAuthenticated, isLoading: userLoading, setUserType, setSelectedInterests, setGoal, setNotificationPref, setExperienceLevel, setRiskAppetite, setTimeHorizon, completeOnboarding, refreshUser } = useUser();
  
  const [step, setStep] = useState(0);
  const [authMode, setAuthMode] = useState<AuthMode>("signup");
  const [resetSent, setResetSent] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setLocalUserType] = useState<string | null>(null);
  const [selectedInterests, setSelectedInterestsLocal] = useState<string[]>([]);
  const [goal, setGoalLocal] = useState<string | null>(null);
  const [notificationPref, setNotificationPrefLocal] = useState<string | null>(null);
  const [experienceLevel, setExperienceLevelLocal] = useState<string | null>(null);
  const [riskAppetite, setRiskAppetiteLocal] = useState<string | null>(null);
  const [timeHorizon, setTimeHorizonLocal] = useState<string | null>(null);

  useEffect(() => {
    if (!userLoading && isAuthenticated && preferences.hasCompletedOnboarding) {
      router.replace("/dashboard");
    }
  }, [userLoading, isAuthenticated, preferences.hasCompletedOnboarding, router]);

  useEffect(() => {
    if (!userLoading) {
      setLocalUserType(preferences.userType);
      setSelectedInterestsLocal(preferences.selectedInterests);
      setGoalLocal(preferences.goal);
      setNotificationPrefLocal(preferences.notificationPref);
    }
  }, [userLoading, preferences]);

  if (userLoading) {
    return (
      <div className="min-h-screen bg-[#080B14] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#E8501A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const toggleInterest = (interest: string) => {
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
    if (step === 5) return !!experienceLevel;
    if (step === 6) return !!riskAppetite;
    if (step === 7) return !!timeHorizon;
    return true;
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (credentialResponse.credential) {
      try {
        setAuthError("");
        setIsLoading(true);
        const data = await apiGoogleLogin(credentialResponse.credential);
        await refreshUser();
        if (data.preferences?.hasCompletedOnboarding) {
          router.push("/dashboard");
        } else {
          setStep(1);
        }
      } catch (error) {
        setAuthError(error instanceof Error ? error.message : "Google authentication failed");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsLoading(true);

    try {
      if (authMode === "forgot_password") {
        if (!email.trim()) {
          setAuthError("Please enter your email address");
          setIsLoading(false);
          return;
        }
        await apiForgotPassword(email);
        setResetSent(true);
        setIsLoading(false);
        return;
      }

      if (authMode === "signup") {
        await apisignup(email, password);
        await refreshUser();
        setStep(1);
      } else {
        const data = await apilogin(email, password);
        await refreshUser();
        if (data.preferences?.hasCompletedOnboarding) {
          router.push("/dashboard");
          return;
        } else {
          setStep(1);
        }
      }
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = async () => {
    if (step === 1) {
      setUserType(userType as any);
      await apiupdatePreferences({ userType: userType || undefined });
    }
    if (step === 2) {
      setSelectedInterests(selectedInterests as any);
      await apiupdatePreferences({ selectedInterests });
    }
    if (step === 3) {
      setGoal(goal as any);
      await apiupdatePreferences({ goal: goal || undefined });
    }
    if (step === 4) {
      setNotificationPref(notificationPref as any);
      await apiupdatePreferences({ notificationPref: notificationPref || undefined });
    }
    if (step === 5) {
      setExperienceLevel(experienceLevel as any);
      await apiupdatePreferences({ experienceLevel: experienceLevel || undefined });
    }
    if (step === 6) {
      setRiskAppetite(riskAppetite as any);
      await apiupdatePreferences({ riskAppetite: riskAppetite || undefined });
    }
    if (step === 7) {
      setTimeHorizon(timeHorizon as any);
      await apiupdatePreferences({ timeHorizon: timeHorizon || undefined });
    }
    
    if (step < 7) {
      setStep(s => s + 1);
    } else {
      await apiupdatePreferences({ hasCompletedOnboarding: true });
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

  const handleSkipStep = () => {
    if (step === 1) {
      setUserType("exploring");
      setSelectedInterests(["stocks", "economy"]);
      setGoal("stay_updated");
      setNotificationPref("key_only");
      setExperienceLevel("beginner");
      setRiskAppetite("moderate");
      setTimeHorizon("medium");
      completeOnboarding();
      router.push("/dashboard");
    }
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
                {authMode === "signup" ? "Create your account" : authMode === "login" ? "Welcome back" : "Reset Password"}
              </h1>
              <p className="text-[#7E8BA3]">
                {authMode === "signup" ? "Start your personalized newsroom" : authMode === "login" ? "Sign in to continue" : "We'll send a recovery link to your email"}
              </p>
            </div>

            {authMode === "forgot_password" && resetSent ? (
              <div className="space-y-6 text-center">
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400">
                  A password reset link has been sent to <strong>{email}</strong> if an account exists.
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("login");
                    setResetSent(false);
                  }}
                  className="text-[#E8501A] hover:underline"
                >
                  Back to Sign in
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {authMode !== "forgot_password" && (
                  <>
                    <div className="flex justify-center w-full">
                      <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => setAuthError("Google authentication failed")}
                        useOneTap
                        theme="filled_black"
                        shape="pill"
                        text={authMode === "signup" ? "signup_with" : "signin_with"}
                      />
                    </div>
                    <div className="relative py-2">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-white/[0.07]" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-[#080B14] px-3 text-[#7E8BA3]">or continue with email</span>
                      </div>
                    </div>
                  </>
                )}
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

              {authMode !== "forgot_password" && (
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
                  {authMode === "login" && (
                    <div className="flex justify-end mt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode("forgot_password");
                          setAuthError("");
                        }}
                        className="text-sm text-[#7E8BA3] hover:text-[#E8501A] transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}
                </div>
              )}

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
                    {authMode === "signup" ? "Create Account" : authMode === "login" ? "Sign In" : "Send Reset Link"}
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
            </div>
            )}

            {authMode !== "forgot_password" && (
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
            )}
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
          initial={{ width: "12.5%" }}
          animate={{ width: `${step * 12.5}%` }}
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
        <p className="text-sm text-[#7E8BA3]">Step {step} of 7</p>
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

              <button
                onClick={handleSkipStep}
                className="w-full text-center text-[#7E8BA3] hover:text-white transition-colors text-sm py-2"
              >
                Skip this step
              </button>
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
                {notificationPrefs.map(({ id, label, desc }) => (
                  <button
                    key={id}
                    onClick={() => setNotificationPrefLocal(id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                      notificationPref === id 
                        ? "border-[#E8501A] bg-[#E8501A]/10" 
                        : "border-white/[0.07] hover:border-[#E8501A]/50 bg-[rgba(255,255,255,0.04)]"
                    }`}
                  >
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

          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-white">What&apos;s your experience level?</h1>
                <p className="text-[#7E8BA3] text-lg">This helps us tailor the complexity</p>
              </div>

              <div className="space-y-3">
                {experienceLevels.map(({ id, label, desc }) => (
                  <button
                    key={id}
                    onClick={() => setExperienceLevelLocal(id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                      experienceLevel === id 
                        ? "border-[#E8501A] bg-[#E8501A]/10" 
                        : "border-white/[0.07] hover:border-[#E8501A]/50 bg-[rgba(255,255,255,0.04)]"
                    }`}
                  >
                    <div className="flex-1">
                      <p className="font-medium text-white">{label}</p>
                      <p className="text-[#7E8BA3] text-sm">{desc}</p>
                    </div>
                    {experienceLevel === id && <Check size={20} className="text-[#E8501A]" />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 6 && (
            <motion.div
              key="step6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-white">What&apos;s your risk appetite?</h1>
                <p className="text-[#7E8BA3] text-lg">This helps us recommend appropriate content</p>
              </div>

              <div className="space-y-3">
                {riskAppetites.map(({ id, label, desc }) => (
                  <button
                    key={id}
                    onClick={() => setRiskAppetiteLocal(id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                      riskAppetite === id 
                        ? "border-[#E8501A] bg-[#E8501A]/10" 
                        : "border-white/[0.07] hover:border-[#E8501A]/50 bg-[rgba(255,255,255,0.04)]"
                    }`}
                  >
                    <div className="flex-1">
                      <p className="font-medium text-white">{label}</p>
                      <p className="text-[#7E8BA3] text-sm">{desc}</p>
                    </div>
                    {riskAppetite === id && <Check size={20} className="text-[#E8501A]" />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 7 && (
            <motion.div
              key="step7"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-white">What&apos;s your time horizon?</h1>
                <p className="text-[#7E8BA3] text-lg">How long do you typically invest for?</p>
              </div>

              <div className="space-y-3">
                {timeHorizons.map(({ id, label, desc }) => (
                  <button
                    key={id}
                    onClick={() => setTimeHorizonLocal(id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                      timeHorizon === id 
                        ? "border-[#E8501A] bg-[#E8501A]/10" 
                        : "border-white/[0.07] hover:border-[#E8501A]/50 bg-[rgba(255,255,255,0.04)]"
                    }`}
                  >
                    <div className="flex-1">
                      <p className="font-medium text-white">{label}</p>
                      <p className="text-[#7E8BA3] text-sm">{desc}</p>
                    </div>
                    {timeHorizon === id && <Check size={20} className="text-[#E8501A]" />}
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
              {step === 7 ? "Get Started" : "Continue"}
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
