// Database Query Optimization Utilities
// This file provides optimized database query patterns

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Optimized user preference lookup with caching
 * Prevents N+1 queries when loading user data
 */
export async function getUserPreferencesOptimized(userId: string) {
  try {
    // Use select to only fetch needed fields
    const preferences = await prisma.userPreference.findUnique({
      where: { userId },
      select: {
        id: true,
        userType: true,
        selectedInterests: true,
        goal: true,
        notificationPref: true,
        hasCompletedOnboarding: true,
        experienceLevel: true,
        riskAppetite: true,
        timeHorizon: true,
        theme: true,
        notificationsEnabled: true,
        emailUpdates: true,
      },
    });
    return preferences;
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    throw error;
  }
}

/**
 * Optimized user with preferences lookup
 * Single query with related data
 */
export async function getUserWithPreferences(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        createdAt: true,
        preferences: {
          select: {
            userType: true,
            selectedInterests: true,
            goal: true,
            experienceLevel: true,
            riskAppetite: true,
            timeHorizon: true,
          },
        },
      },
    });
    return user;
  } catch (error) {
    console.error('Error fetching user with preferences:', error);
    throw error;
  }
}

/**
 * Optimized articles query with filtering and pagination
 * Includes category and sentiment filtering
 */
export async function getArticlesOptimized(filters: {
  category?: string;
  sentiment?: string;
  limit?: number;
  offset?: number;
}) {
  const { category, sentiment, limit = 20, offset = 0 } = filters;

  try {
    const where: any = {};
    if (category) where.category = category;
    if (sentiment) where.sentiment = sentiment;

    // Use separate count query for better performance
    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        select: {
          id: true,
          title: true,
          summary: true,
          source: true,
          url: true,
          date: true,
          category: true,
          sentiment: true,
          imageUrl: true,
        },
        orderBy: { date: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.article.count({ where }),
    ]);

    return {
      articles,
      total,
      hasMore: offset + articles.length < total,
    };
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }
}

/**
 * Optimized stories query with related articles
 * Uses batch loading to prevent N+1 queries
 */
export async function getStoriesWithArticles(filters: {
  category?: string;
  limit?: number;
  offset?: number;
}) {
  const { category, limit = 10, offset = 0 } = filters;

  try {
    const where = category ? { category } : {};

    const stories = await prisma.story.findMany({
      where,
      select: {
        id: true,
        title: true,
        summary: true,
        category: true,
        priority: true,
        timeline: true,
        createdAt: true,
        articles: {
          select: {
            article: {
              select: {
                id: true,
                title: true,
                source: true,
                date: true,
                imageUrl: true,
              },
            },
            position: true,
          },
          orderBy: { position: 'asc' },
        },
      },
      orderBy: { priority: 'desc' },
      take: limit,
      skip: offset,
    });

    return stories;
  } catch (error) {
    console.error('Error fetching stories with articles:', error);
    throw error;
  }
}

/**
 * Optimized user saved stories lookup
 * Prevents N+1 queries with proper selection
 */
export async function getUserSavedStories(userId: string, limit = 20, offset = 0) {
  try {
    const [savedStories, total] = await Promise.all([
      prisma.savedStory.findMany({
        where: { userId },
        select: {
          id: true,
          storyId: true,
          createdAt: true,
          story: {
            select: {
              id: true,
              title: true,
              summary: true,
              category: true,
              articles: {
                select: {
                  article: {
                    select: {
                      imageUrl: true,
                      source: true,
                    },
                  },
                },
                take: 1,
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.savedStory.count({ where: { userId } }),
    ]);

    return {
      stories: savedStories,
      total,
      hasMore: offset + savedStories.length < total,
    };
  } catch (error) {
    console.error('Error fetching user saved stories:', error);
    throw error;
  }
}

/**
 * Optimized conversation history lookup
 * Retrieves QA logs grouped by conversation
 */
export async function getConversationHistory(
  userId: string,
  conversationId?: string,
  limit = 50
) {
  try {
    const where: any = { userId };
    if (conversationId) where.conversationId = conversationId;

    const logs = await prisma.qALog.findMany({
      where,
      select: {
        id: true,
        question: true,
        answer: true,
        conversationId: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return logs;
  } catch (error) {
    console.error('Error fetching conversation history:', error);
    throw error;
  }
}

/**
 * Optimized briefing cache lookup
 * Includes automatic expiration filtering
 */
export async function getCachedBriefingOptimized(
  userId: string,
  topic: string,
  mode: string
) {
  try {
    const cached = await prisma.briefingCache.findUnique({
      where: {
        userId_topic_mode: {
          userId,
          topic,
          mode,
        },
      },
      select: {
        id: true,
        response: true,
        expiresAt: true,
        createdAt: true,
      },
    });

    if (!cached) return null;

    // Check if cache has expired
    if (new Date(cached.expiresAt) < new Date()) {
      // Delete expired cache in background
      await prisma.briefingCache.delete({ where: { id: cached.id } }).catch(() => {
        // Ignore errors on background delete
      });
      return null;
    }

    return cached;
  } catch (error) {
    console.error('Error fetching cached briefing:', error);
    throw error;
  }
}

/**
 * Optimized batch operation for saving briefing cache
 * Prevents duplicate inserts
 */
export async function saveBriefingCacheOptimized(
  userId: string,
  topic: string,
  mode: string,
  response: string,
  ttlMinutes = 24 * 60 // 24 hours default
) {
  try {
    const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);

    // Use upsert to handle duplicate key errors
    const cached = await prisma.briefingCache.upsert({
      where: {
        userId_topic_mode: {
          userId,
          topic,
          mode,
        },
      },
      create: {
        userId,
        topic,
        mode,
        response,
        expiresAt,
      },
      update: {
        response,
        expiresAt,
      },
    });

    return cached;
  } catch (error) {
    console.error('Error saving briefing cache:', error);
    throw error;
  }
}

/**
 * Cleanup expired cache entries
 * Run periodically via cron job
 */
export async function cleanupExpiredCache() {
  try {
    const result = await prisma.briefingCache.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    console.log(`[Cache Cleanup] Deleted ${result.count} expired cache entries`);
    return result.count;
  } catch (error) {
    console.error('Error cleaning up expired cache:', error);
    throw error;
  }
}

/**
 * Get database query metrics
 * Useful for monitoring query performance
 */
export async function getDatabaseMetrics() {
  try {
    const metrics = {
      userCount: await prisma.user.count(),
      articleCount: await prisma.article.count(),
      storyCount: await prisma.story.count(),
      cachedBriefings: await prisma.briefingCache.count({
        where: {
          expiresAt: {
            gt: new Date(),
          },
        },
      }),
      totalQALogs: await prisma.qALog.count(),
    };

    return metrics;
  } catch (error) {
    console.error('Error getting database metrics:', error);
    throw error;
  }
}

export default {
  getUserPreferencesOptimized,
  getUserWithPreferences,
  getArticlesOptimized,
  getStoriesWithArticles,
  getUserSavedStories,
  getConversationHistory,
  getCachedBriefingOptimized,
  saveBriefingCacheOptimized,
  cleanupExpiredCache,
  getDatabaseMetrics,
};
