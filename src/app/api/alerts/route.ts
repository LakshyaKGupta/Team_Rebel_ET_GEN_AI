// Real-Time Portfolio Alerts API
// GET, POST, DELETE handlers for portfolio alerts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Alert {
  id: string;
  userId: string;
  assetSymbol: string;
  alertType: 'price_change' | 'news_mention' | 'threshold_breach';
  threshold?: number;
  isActive: boolean;
  createdAt: Date;
}

/**
 * GET - Retrieve portfolio alerts
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const importance = searchParams.get('importance') || 'all';

    if (!userId) {
      return NextResponse.json(
        { error: 'userId parameter required' },
        { status: 400 }
      );
    }

    const whereClause: any = {
      userId,
      isActive: true,
    };

    if (importance !== 'all') {
      whereClause.importance = importance;
    }

    const alerts = await prisma.alert.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        assetSymbol: true,
        alertType: true,
        importance: true,
        threshold: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      alerts,
      count: alerts.length,
    });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch alerts' },
      { status: 500 }
    );
  }
}

/**
 * POST - Create a new alert for a portfolio asset
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, portfolioId, holdingId, assetSymbol, alertType, threshold } = body;

    if (!userId || !assetSymbol || !alertType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const validTypes = ['price_change', 'news_mention', 'threshold_breach'];
    if (!validTypes.includes(alertType)) {
      return NextResponse.json(
        { error: 'Invalid alert type' },
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

    const alert = await prisma.alert.create({
      data: {
        userId,
        portfolioId: portfolioId || null,
        holdingId: holdingId || null,
        assetSymbol,
        alertType,
        threshold: threshold ? parseFloat(threshold) : null,
        importance: 'medium',
        isActive: true,
      },
      select: {
        id: true,
        userId: true,
        assetSymbol: true,
        alertType: true,
        threshold: true,
        isActive: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      alert,
    });
  } catch (error) {
    console.error('Error creating alert:', error);
    return NextResponse.json(
      { error: 'Failed to create alert' },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Deactivate an alert
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const alertId = searchParams.get('alertId');
    const userId = searchParams.get('userId');

    if (!alertId || !userId) {
      return NextResponse.json(
        { error: 'alertId and userId parameters required' },
        { status: 400 }
      );
    }

    const alert = await prisma.alert.findUnique({
      where: { id: alertId },
    });

    if (!alert || alert.userId !== userId) {
      return NextResponse.json(
        { error: 'Alert not found or unauthorized' },
        { status: 404 }
      );
    }

    const updated = await prisma.alert.update({
      where: { id: alertId },
      data: { isActive: false },
      select: {
        id: true,
        assetSymbol: true,
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      alert: updated,
    });
  } catch (error) {
    console.error('Error deleting alert:', error);
    return NextResponse.json(
      { error: 'Failed to delete alert' },
      { status: 500 }
    );
  }
}
