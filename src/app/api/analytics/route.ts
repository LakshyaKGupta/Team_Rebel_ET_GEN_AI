// Analytics API
// Provides user engagement and reading pattern analytics

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Get analytics for a user
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const timeRange = searchParams.get('timeRange') || 'month';

    if (!userId) {
      return NextResponse.json(
        { error: 'userId parameter required' },
        { status: 400 }
      );
    }

    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    if (timeRange === 'week') {
      startDate.setDate(now.getDate() - 7);
    } else if (timeRange === 'month') {
      startDate.setMonth(now.getMonth() - 1);
    } else {
      // 'all' - fetch everything
      startDate = new Date('2000-01-01');
    }

    // Fetch engagements for time range
    const engagements = await prisma.engagement.findMany({
      where: {
        userId,
        timestamp: {
          gte: startDate,
        },
      },
      select: {
        actionType: true,
        readTimeSeconds: true,
        timestamp: true,
      },
    });

    // Fetch reading patterns
    const readingPatterns = await prisma.readingPattern.findMany({
      where: { userId },
      select: {
        hour: true,
        readCount: true,
        totalTimeMinutes: true,
      },
      orderBy: { hour: 'asc' },
    });

    // Calculate metrics
    const totalArticlesRead = engagements.filter(
      (e) => e.actionType === 'read'
    ).length;
    const totalTimeSpent = engagements.reduce(
      (sum, e) => sum + (e.readTimeSeconds ? e.readTimeSeconds / 60 : 0),
      0
    );
    const averageTimePerArticle =
      totalArticlesRead > 0 ? totalTimeSpent / totalArticlesRead : 0;

    // Calculate engagement score (0-100)
    const reads = engagements.filter((e) => e.actionType === 'read').length;
    const likes = engagements.filter((e) => e.actionType === 'like').length;
    const saves = engagements.filter((e) => e.actionType === 'save').length;
    const shares = engagements.filter((e) => e.actionType === 'share').length;
    const engagementScore = Math.min(
      100,
      Math.round((reads * 0.4 + likes * 0.3 + saves * 0.2 + shares * 0.1) / 2)
    );

    // Find peak reading hour
    const peakHour = readingPatterns.length > 0
      ? readingPatterns.reduce((max, p) =>
          p.readCount > max.readCount ? p : max
        )
      : null;

    // Calculate personalization accuracy
    // This would be calculated based on recommendation hit rate in production
    const personalizationAccuracy = 0.84; // Placeholder

    return NextResponse.json({
      success: true,
      analytics: {
        totalArticlesRead,
        totalTimeSpent: Math.round(totalTimeSpent),
        averageTimePerArticle: Math.round(averageTimePerArticle * 10) / 10,
        engagementScore,
        personalizationAccuracy,
        readingPattern: readingPatterns.map((p) => ({
          hour: p.hour,
          count: p.readCount,
        })),
        peakReadingHour: peakHour?.hour || 9,
        topActions: {
          reads,
          likes,
          saves,
          shares,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

/**
 * Record user engagement
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, articleId, actionType, readTimeSeconds } = body;

    if (!userId || !actionType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const validActions = ['read', 'like', 'save', 'share'];
    if (!validActions.includes(actionType)) {
      return NextResponse.json(
        { error: 'Invalid action type' },
        { status: 400 }
      );
    }

    // Save engagement to database
    const engagement = await prisma.engagement.create({
      data: {
        userId,
        articleId: articleId || 'unknown',
        actionType,
        readTimeSeconds: readTimeSeconds ? parseInt(readTimeSeconds) : null,
      },
      select: {
        id: true,
        userId: true,
        actionType: true,
        timestamp: true,
      },
    });

    // Update reading pattern if it's a read action
    if (actionType === 'read') {
      const now = new Date();
      const hour = now.getHours();

      await prisma.readingPattern.upsert({
        where: {
          userId_hour: {
            userId,
            hour,
          },
        },
        create: {
          userId,
          hour,
          readCount: 1,
          totalTimeMinutes: readTimeSeconds ? readTimeSeconds / 60 : 0,
          lastUpdated: new Date(),
        },
        update: {
          readCount: { increment: 1 },
          totalTimeMinutes: {
            increment: readTimeSeconds ? readTimeSeconds / 60 : 0,
          },
          lastUpdated: new Date(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      engagement,
    });
  } catch (error) {
    console.error('Error recording engagement:', error);
    return NextResponse.json(
      { error: 'Failed to record engagement' },
      { status: 500 }
    );
  }
}
