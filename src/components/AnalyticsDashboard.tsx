'use client';

import { useEffect, useState, useMemo } from 'react';
import { useUser } from '@/context/UserContext';
import { TrendingUp, TrendingDown, PieChart, BarChart3, Activity } from 'lucide-react';

interface EngagementMetric {
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
}

interface ContentMetric {
  category: string;
  views: number;
  engagement: number;
  timeSpent: number;
}

interface UserAnalytics {
  totalArticlesRead: number;
  totalTimeSpent: number;
  averageTimePerArticle: number;
  topCategories: ContentMetric[];
  readingPattern: { hour: number; count: number }[];
  favoriteTopics: { topic: string; count: number }[];
  engagementScore: number;
  personalizationAccuracy: number;
}

export default function AnalyticsDashboard() {
  const { preferences, user } = useUser();
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('month');

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        // TODO: Fetch real analytics from backend
        // For now, generating mock data
        const mockAnalytics: UserAnalytics = {
          totalArticlesRead: 124,
          totalTimeSpent: 3240, // minutes
          averageTimePerArticle: 26.1,
          topCategories: [
            { category: 'Tech', views: 45, engagement: 0.89, timeSpent: 1200 },
            { category: 'Markets', views: 38, engagement: 0.76, timeSpent: 950 },
            { category: 'Startups', views: 28, engagement: 0.82, timeSpent: 700 },
            { category: 'Economy', views: 13, engagement: 0.62, timeSpent: 390 },
          ],
          readingPattern: Array.from({ length: 24 }, (_, i) => ({
            hour: i,
            count: Math.floor(Math.random() * 15),
          })),
          favoriteTopics: [
            { topic: 'AI & Machine Learning', count: 34 },
            { topic: 'Stock Market', count: 28 },
            { topic: 'Crypto', count: 22 },
            { topic: 'Venture Capital', count: 18 },
            { topic: 'Product Management', count: 12 },
          ],
          engagementScore: 78,
          personalizationAccuracy: 0.84,
        };

        setAnalytics(mockAnalytics);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeRange]);

  const engagementMetrics: EngagementMetric[] = useMemo(
    () =>
      analytics
        ? [
            {
              label: 'Articles Read',
              value: analytics.totalArticlesRead,
              change: 12,
              trend: 'up',
            },
            {
              label: 'Time Spent (mins)',
              value: analytics.totalTimeSpent,
              change: 8,
              trend: 'up',
            },
            {
              label: 'Avg Time/Article',
              value: Math.round(analytics.averageTimePerArticle),
              change: -3,
              trend: 'down',
            },
            {
              label: 'Engagement Score',
              value: analytics.engagementScore,
              change: 5,
              trend: 'up',
            },
          ]
        : [],
    [analytics]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B4513]"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="rounded-lg border border-[#DDD4C4] bg-white p-6 text-center">
        <p className="text-[#5C5C5C]">Failed to load analytics</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex gap-2">
        {(['week', 'month', 'all'] as const).map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              timeRange === range
                ? 'bg-[#1A1A1A] text-white'
                : 'border border-[#DDD4C4] bg-white text-[#5C5C5C] hover:bg-[#F8F3EB]'
            }`}
          >
            {range === 'week'
              ? 'This Week'
              : range === 'month'
                ? 'This Month'
                : 'All Time'}
          </button>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {engagementMetrics.map((metric, index) => (
          <div
            key={index}
            className="rounded-[20px] border border-[#DDD4C4] bg-white p-4"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8B4513]">
              {metric.label}
            </p>
            <div className="mt-3 flex items-end justify-between">
              <p className="text-3xl font-bold text-[#1A1A1A]">{metric.value}</p>
              <div
                className={`flex items-center gap-1 text-sm font-medium ${
                  metric.trend === 'up'
                    ? 'text-green-600'
                    : metric.trend === 'down'
                      ? 'text-red-600'
                      : 'text-[#5C5C5C]'
                }`}
              >
                {metric.trend === 'up' ? (
                  <TrendingUp size={16} />
                ) : metric.trend === 'down' ? (
                  <TrendingDown size={16} />
                ) : null}
                <span>{Math.abs(metric.change)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Top Categories */}
      <div className="rounded-[24px] border border-[#DDD4C4] bg-white p-6">
        <div className="mb-4 flex items-center gap-2">
          <BarChart3 size={20} className="text-[#8B4513]" />
          <h2 className="text-lg font-semibold">Content Engagement by Category</h2>
        </div>
        <div className="space-y-3">
          {analytics.topCategories.map((category, index) => (
            <div key={index}>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-[#1A1A1A]">
                  {category.category}
                </span>
                <span className="text-xs text-[#5C5C5C]">
                  {Math.round(category.engagement * 100)}% engagement
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[#F0E9D9]">
                <div
                  className="h-full bg-gradient-to-r from-[#8B4513] to-[#A0522D]"
                  style={{
                    width: `${(category.engagement * 100) / 100}`,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Topics */}
      <div className="rounded-[24px] border border-[#DDD4C4] bg-white p-6">
        <div className="mb-4 flex items-center gap-2">
          <Activity size={20} className="text-[#8B4513]" />
          <h2 className="text-lg font-semibold">Your Favorite Topics</h2>
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          {analytics.favoriteTopics.map((topic, index) => (
            <div
              key={index}
              className="rounded-[16px] border border-[#ECE5D8] bg-[#FCFAF6] p-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#1A1A1A]">
                  {topic.topic}
                </span>
                <span className="rounded-full bg-[#F4EBDD] px-2 py-1 text-xs font-semibold text-[#8B4513]">
                  {topic.count} reads
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Personalization Metrics */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Reading Pattern */}
        <div className="rounded-[24px] border border-[#DDD4C4] bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">Reading Pattern</h2>
          <div className="space-y-2">
            <p className="text-sm text-[#5C5C5C]">
              Most active between{' '}
              <strong>
                {analytics.readingPattern
                  .sort((a, b) => b.count - a.count)[0]
                  .hour.toString()
                  .padStart(2, '0')}
                :00
              </strong>{' '}
              and{' '}
              <strong>
                {(
                  analytics.readingPattern.sort((a, b) => b.count - a.count)[0]
                    .hour + 1
                )
                  .toString()
                  .padStart(2, '0')}
                :00
              </strong>
            </p>
          </div>
        </div>

        {/* Personalization Score */}
        <div className="rounded-[24px] border border-[#DDD4C4] bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">Personalization Score</h2>
          <div className="space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-[#5C5C5C]">Accuracy</span>
                <span className="text-sm font-bold text-[#8B4513]">
                  {Math.round(analytics.personalizationAccuracy * 100)}%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[#F0E9D9]">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-green-600"
                  style={{
                    width: `${analytics.personalizationAccuracy * 100}%`,
                  }}
                ></div>
              </div>
            </div>
            <p className="text-xs text-[#5C5C5C]">
              Our recommendations match your interests based on your reading
              behavior and preferences.
            </p>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="rounded-[24px] border border-[#DDD4C4] bg-[#FCFAF6] p-6">
        <h2 className="mb-3 text-lg font-semibold">Insights</h2>
        <ul className="space-y-2 text-sm text-[#5C5C5C]">
          <li>
            ✓ You read {analytics.topCategories[0].category} content the most
            ({analytics.topCategories[0].views} articles)
          </li>
          <li>
            ✓ Your average read time has{' '}
            {Math.random() > 0.5 ? 'increased' : 'decreased'} by 12% this month
          </li>
          <li>
            ✓ The personalization engine has{' '}
            {Math.round(analytics.personalizationAccuracy * 100)}% accuracy for
            your content preferences
          </li>
          <li>
            ✓ Based on your reading pattern, best time to check news is around{' '}
            <strong>
              {analytics.readingPattern
                .sort((a, b) => b.count - a.count)[0]
                .hour.toString()
                .padStart(2, '0')}
              :00
            </strong>
          </li>
        </ul>
      </div>
    </div>
  );
}
