// Social Sharing API
// Tracks article shares across social platforms

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * Get share statistics for content
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const contentId = searchParams.get('contentId');
    const userId = searchParams.get('userId');

    if (!contentId) {
      return NextResponse.json(
        { error: 'contentId parameter required' },
        { status: 400 }
      );
    }

    // Fetch share statistics from database
    const shares = await prisma.shareTracking.findMany({
      where: { contentId },
      select: {
        platform: true,
        shareCount: true,
        clicks: true,
        lastShared: true,
      },
    });

    // Calculate totals
    const totalShares = shares.reduce((sum, s) => sum + s.shareCount, 0);
    const totalClicks = shares.reduce((sum, s) => sum + s.clicks, 0);

    // Group by platform
    const byPlatform: Record<string, { shareCount: number; clicks: number }> = {};
    shares.forEach((s) => {
      byPlatform[s.platform] = {
        shareCount: s.shareCount,
        clicks: s.clicks,
      };
    });

    // Find top platform
    const topPlatform = Object.entries(byPlatform).sort(
      ([, a], [, b]) => b.shareCount - a.shareCount
    )[0]?.[0] || 'twitter';

    return NextResponse.json({
      success: true,
      stats: {
        contentId,
        totalShares,
        totalClicks,
        byPlatform,
        topPlatform,
      },
    });
  } catch (error) {
    console.error('Error fetching share stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch share statistics' },
      { status: 500 }
    );
  }
}

/**
 * Track share click/action
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, contentId, platform } = body;

    if (!userId || !contentId || !platform) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const validPlatforms = [
      'twitter',
      'linkedin',
      'facebook',
      'email',
      'whatsapp',
      'reddit',
    ];
    if (!validPlatforms.includes(platform)) {
      return NextResponse.json(
        { error: 'Invalid platform' },
        { status: 400 }
      );
    }

    // Record or update share tracking
    const share = await prisma.shareTracking.upsert({
      where: {
        userId_contentId_platform: {
          userId,
          contentId,
          platform,
        },
      },
      create: {
        userId,
        contentId,
        platform,
        shareCount: 1,
        clicks: 0,
        lastShared: new Date(),
      },
      update: {
        shareCount: { increment: 1 },
        lastShared: new Date(),
      },
      select: {
        id: true,
        contentId: true,
        platform: true,
        shareCount: true,
        clicks: true,
      },
    });

    return NextResponse.json({
      success: true,
      share,
    });
  } catch (error) {
    console.error('Error tracking share:', error);
    return NextResponse.json(
      { error: 'Failed to track share' },
      { status: 500 }
    );
  }
}

/**
 * Record share click
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, contentId, platform } = body;

    if (!userId || !contentId || !platform) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Increment click count
    const updated = await prisma.shareTracking.update({
      where: {
        userId_contentId_platform: {
          userId,
          contentId,
          platform,
        },
      },
      data: {
        clicks: { increment: 1 },
      },
      select: {
        id: true,
        contentId: true,
        platform: true,
        clicks: true,
      },
    });

    return NextResponse.json({
      success: true,
      updated,
    });
  } catch (error) {
    console.error('Error recording click:', error);
    return NextResponse.json(
      { error: 'Failed to record click' },
      { status: 500 }
    );
  }
}
