// Portfolio Analytics API
// GET, POST handlers for portfolio and holdings

import { NextRequest, NextResponse } from 'next/server';
import { calculateHoldingPerformance, calculatePortfolioSummary, HoldingPerformance } from '@/lib/portfolio-utils';

export const dynamic = 'force-dynamic';

interface Holding {
  id: string;
  portfolioId: string;
  symbol: string;
  name: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  purchaseDate: Date;
  sector?: string;
  notes?: string;
}

/**
 * GET - Fetch portfolio analytics and holdings
 */
export async function GET(request: NextRequest) {
  try {
    const { prisma } = await import('@/lib/prisma');
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const portfolioId = searchParams.get('portfolioId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId parameter required' },
        { status: 400 }
      );
    }

    const query = portfolioId
      ? { portfolio: { id: portfolioId, userId } }
      : { portfolio: { userId } };

    const holdingsData = await prisma.holding.findMany({
      where: query,
      select: {
        id: true,
        symbol: true,
        name: true,
        quantity: true,
        purchasePrice: true,
        currentPrice: true,
        purchaseDate: true,
        sector: true,
        notes: true,
      },
    });

    const holdings: HoldingPerformance[] = holdingsData.map((h) => ({
      holding: h,
      currentValue: h.quantity * h.currentPrice,
      purchaseValue: h.quantity * h.purchasePrice,
      gainLoss: h.quantity * h.currentPrice - h.quantity * h.purchasePrice,
      gainLossPercent:
        h.quantity * h.purchasePrice > 0
          ? ((h.quantity * h.currentPrice - h.quantity * h.purchasePrice) /
              (h.quantity * h.purchasePrice)) *
            100
          : 0,
      dayChangePercent: 0,
      dayChange: 0,
    }));

    const summary =
      holdings.length > 0 ? calculatePortfolioSummary(holdings) : null;

    return NextResponse.json({
      success: true,
      portfolio: { holdings, summary },
    });
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio' },
      { status: 500 }
    );
  }
}

/**
 * POST - Add or update holding in portfolio
 */
export async function POST(request: NextRequest) {
  try {
    const { prisma } = await import('@/lib/prisma');
    
    const body = await request.json();
    const { userId, portfolioId, symbol, name, quantity, purchasePrice, currentPrice, sector } = body;

    if (!userId || !portfolioId || !symbol || !quantity || !purchasePrice) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (quantity <= 0 || purchasePrice <= 0) {
      return NextResponse.json(
        { error: 'Quantity and price must be positive' },
        { status: 400 }
      );
    }

    const portfolio = await prisma.portfolio.findUnique({
      where: { id: portfolioId },
    });

    if (!portfolio || portfolio.userId !== userId) {
      return NextResponse.json(
        { error: 'Portfolio not found or unauthorized' },
        { status: 404 }
      );
    }

    const holding = await prisma.holding.create({
      data: {
        portfolioId,
        symbol,
        name,
        quantity: parseFloat(quantity.toString()),
        purchasePrice: parseFloat(purchasePrice.toString()),
        currentPrice: currentPrice
          ? parseFloat(currentPrice.toString())
          : parseFloat(purchasePrice.toString()),
        purchaseDate: new Date(),
        sector: sector || null,
      },
      select: {
        id: true,
        portfolioId: true,
        symbol: true,
        name: true,
        quantity: true,
        purchasePrice: true,
        currentPrice: true,
        sector: true,
      },
    });

    return NextResponse.json({ success: true, holding });
  } catch (error) {
    console.error('Error creating holding:', error);
    return NextResponse.json(
      { error: 'Failed to create holding' },
      { status: 500 }
    );
  }
}
