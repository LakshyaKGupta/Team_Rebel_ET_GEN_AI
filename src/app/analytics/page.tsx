'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';

import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import { useUser } from '@/context/UserContext';

export default function AnalyticsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useUser();
  const [activeNav, setActiveNav] = useState<'home' | 'topics'>('home');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F3EFE7]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B4513]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3EFE7] text-[#1A1A1A] lg:flex">
      <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />

      <main className="flex-1 pb-40 pt-16 lg:pt-0 lg:pb-10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-4 lg:px-6 lg:py-6">
          {/* Header */}
          <section className="rounded-[32px] border border-[#DDD4C4] bg-[#FCFAF5] p-4 shadow-sm lg:p-6">
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => router.back()}
                className="rounded-full p-2 hover:bg-[#F8F3EB] transition-colors"
              >
                <ArrowLeft size={20} className="text-[#1A1A1A]" />
              </button>
              <div>
                <h1 className="text-2xl font-semibold leading-tight lg:text-3xl">
                  Your Analytics
                </h1>
                <p className="mt-2 text-sm leading-6 text-[#5C5C5C]">
                  Track your reading patterns, engagement, and personalization insights
                </p>
              </div>
            </div>
          </section>

          {/* Analytics Dashboard */}
          <section className="rounded-[32px] border border-[#DDD4C4] bg-[#FCFAF5] p-4 shadow-sm lg:p-6">
            <AnalyticsDashboard />
          </section>

          {/* Info Section */}
          <section className="rounded-[24px] border border-[#DDD4C4] bg-[#F8F3EB] p-4 lg:p-6">
            <h3 className="font-semibold mb-2">How We Use Your Data</h3>
            <ul className="text-sm text-[#5C5C5C] space-y-1">
              <li>
                • <strong>Content Preferences:</strong> Your reading patterns help us
                recommend more relevant articles
              </li>
              <li>
                • <strong>Time Optimization:</strong> We track when you&apos;re most active to
                send briefings at the best time
              </li>
              <li>
                • <strong>Personalization:</strong> Your engagement helps train our AI to
                better understand your interests
              </li>
              <li>
                • <strong>Privacy:</strong> All data is encrypted and only used to improve
                your experience
              </li>
            </ul>
          </section>
        </div>
      </main>


    </div>
  );
}
