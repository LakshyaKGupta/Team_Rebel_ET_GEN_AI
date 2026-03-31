// Email Digest API
// GET, POST, DELETE handlers for email digest configuration

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET - Retrieve digest preferences
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId parameter required' },
        { status: 400 }
      );
    }

    const config = await prisma.emailDigestConfig.findUnique({
      where: { userId },
      select: {
        userId: true,
        frequency: true,
        sendTime: true,
        topics: true,
        includePortfolio: true,
        includeAnalytics: true,
        timezone: true,
        isSubscribed: true,
        lastSent: true,
      },
    });

    if (!config) {
      return NextResponse.json({
        success: true,
        config: {
          userId,
          frequency: 'daily',
          sendTime: '08:00',
          topics: [],
          includePortfolio: false,
          includeAnalytics: false,
          timezone: 'UTC',
          isSubscribed: false,
        },
      });
    }

    return NextResponse.json({
      success: true,
      config: {
        ...config,
        topics: JSON.parse(config.topics),
      },
    });
  } catch (error) {
    console.error('Error fetching digest config:', error);
    return NextResponse.json(
      { error: 'Failed to fetch digest config' },
      { status: 500 }
    );
  }
}

/**
 * POST - Configure email digest subscription
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, frequency, sendTime, topics, includePortfolio, includeAnalytics, timezone } = body;

    if (!userId || !frequency || !sendTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const validFrequencies = ['daily', 'weekly', 'bi-weekly'];
    if (!validFrequencies.includes(frequency)) {
      return NextResponse.json(
        { error: 'Invalid frequency' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const config = await prisma.emailDigestConfig.upsert({
      where: { userId },
      create: {
        userId,
        frequency,
        sendTime,
        topics: JSON.stringify(topics || []),
        includePortfolio: includePortfolio || false,
        includeAnalytics: includeAnalytics || false,
        timezone: timezone || 'UTC',
        isSubscribed: true,
      },
      update: {
        frequency,
        sendTime,
        topics: JSON.stringify(topics || []),
        includePortfolio: includePortfolio || false,
        includeAnalytics: includeAnalytics || false,
        timezone: timezone || 'UTC',
        isSubscribed: true,
      },
      select: {
        userId: true,
        frequency: true,
        sendTime: true,
        topics: true,
        includePortfolio: true,
        includeAnalytics: true,
        timezone: true,
      },
    });

    return NextResponse.json({
      success: true,
      config: {
        ...config,
        topics: JSON.parse(config.topics),
      },
      message: `Email digest configured for ${frequency} delivery at ${sendTime}`,
    });
  } catch (error) {
    console.error('Error configuring digest:', error);
    return NextResponse.json(
      { error: 'Failed to configure digest' },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Unsubscribe from email digest
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId parameter required' },
        { status: 400 }
      );
    }

    await prisma.emailDigestConfig.update({
      where: { userId },
      data: { isSubscribed: false },
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed from email digests',
    });
  } catch (error) {
    console.error('Error unsubscribing:', error);
    return NextResponse.json(
      { error: 'Failed to unsubscribe' },
      { status: 500 }
    );
  }
}
