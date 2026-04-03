"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiResetPassword } from "@/lib/api";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import Link from "next/link";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    if (!token) {
      setError("Invalid or missing reset token");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await apiResetPassword(token, password);
      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="space-y-6 text-center">
        <h2 className="text-2xl font-semibold text-white">Password Reset Successful!</h2>
        <p className="text-[#7E8BA3]">You can now sign in with your new password.</p>
        <button
          onClick={() => router.push("/")}
          className="w-full py-3 rounded-xl font-medium bg-gradient-to-r from-[#E8501A] to-[#F0A500] text-white hover:opacity-90 transition-all"
        >
          Go to Sign In
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm text-[#7E8BA3] mb-2 block">New Password</label>
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

      <div>
        <label className="text-sm text-[#7E8BA3] mb-2 block">Confirm Password</label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7E8BA3]" size={18} />
          <input
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full pl-11 pr-12 py-3 rounded-xl bg-white/[0.07] border border-white/[0.07] text-white placeholder-[#7E8BA3] focus:outline-none focus:border-[#E8501A] transition-colors"
          />
        </div>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={isLoading || !password || !confirmPassword}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium bg-gradient-to-r from-[#E8501A] to-[#F0A500] text-white transition-all hover:opacity-90 disabled:opacity-50"
      >
        {isLoading ? (
          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            Change Password
            <ArrowRight size={18} />
          </>
        )}
      </button>
      
      <div className="text-center mt-4">
        <Link href="/" className="text-sm text-[#7E8BA3] hover:text-[#E8501A] transition-colors">
          Back to home
        </Link>
      </div>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#080B14] flex flex-col justify-center px-6 py-8">
      <div className="max-w-md mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-white">Reset Password</h1>
            <p className="text-[#7E8BA3]">Create a new password for your account.</p>
          </div>

          <Suspense fallback={<div className="text-center text-[#7E8BA3]">Loading...</div>}>
            <ResetPasswordForm />
          </Suspense>
        </motion.div>
      </div>
    </div>
  );
}
