// Portfolio Tracking and Analytics
// Enhanced portfolio management with performance tracking

import { NextRequest, NextResponse } from 'next/server';

interface Portfolio {
  id: string;
  userId: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

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

interface HoldingPerformance {
  holding: Holding;
  currentValue: number;
  purchaseValue: number;
  gainLoss: number;
  gainLossPercent: number;
  dayChangePercent: number;
  dayChange: number;
}

interface PortfolioSummary {
  totalValue: number;
  totalInvested: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  dayChange: number;
  dayChangePercent: number;
  holdingCount: number;
  topPerformer: HoldingPerformance | null;
  worstPerformer: HoldingPerformance | null;
  sectorAllocation: Record<string, number>;
}

/**
 * Calculate holding performance metrics
 */
export function calculateHoldingPerformance(
  holding: Holding,
  currentPrice: number,
  dayChangePercent: number = 0
): HoldingPerformance {
  const currentValue = holding.quantity * currentPrice;
  const purchaseValue = holding.quantity * holding.purchasePrice;
  const gainLoss = currentValue - purchaseValue;
  const gainLossPercent =
    purchaseValue > 0 ? (gainLoss / purchaseValue) * 100 : 0;
  const dayChange = currentValue * (dayChangePercent / 100);

  return {
    holding,
    currentValue,
    purchaseValue,
    gainLoss,
    gainLossPercent,
    dayChangePercent,
    dayChange,
  };
}

/**
 * Calculate portfolio summary metrics
 */
export function calculatePortfolioSummary(
  holdings: HoldingPerformance[]
): PortfolioSummary {
  const totalValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);
  const totalInvested = holdings.reduce((sum, h) => sum + h.purchaseValue, 0);
  const totalGainLoss = holdings.reduce((sum, h) => sum + h.gainLoss, 0);
  const totalGainLossPercent =
    totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;
  const dayChange = holdings.reduce((sum, h) => sum + h.dayChange, 0);
  const dayChangePercent = totalValue > 0 ? (dayChange / totalValue) * 100 : 0;

  // Find top and worst performers
  let topPerformer = holdings[0] || null;
  let worstPerformer = holdings[0] || null;

  for (const holding of holdings) {
    if (holding.gainLossPercent > (topPerformer?.gainLossPercent ?? -Infinity)) {
      topPerformer = holding;
    }
    if (
      holding.gainLossPercent < (worstPerformer?.gainLossPercent ?? Infinity)
    ) {
      worstPerformer = holding;
    }
  }

  // Calculate sector allocation
  const sectorAllocation: Record<string, number> = {};
  for (const { holding, currentValue } of holdings) {
    const sector = holding.sector || 'Uncategorized';
    sectorAllocation[sector] = (sectorAllocation[sector] || 0) + currentValue;
  }

  // Convert to percentages
  for (const sector in sectorAllocation) {
    sectorAllocation[sector] = (sectorAllocation[sector] / totalValue) * 100;
  }

  return {
    totalValue,
    totalInvested,
    totalGainLoss,
    totalGainLossPercent,
    dayChange,
    dayChangePercent,
    holdingCount: holdings.length,
    topPerformer,
    worstPerformer,
    sectorAllocation,
  };
}

/**
 * Get portfolio analytics for dashboard
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const portfolioId = searchParams.get('portfolioId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId parameter required' },
        { status: 400 }
      );
    }

    // TODO: Fetch portfolio and holdings from database
    const holdings: HoldingPerformance[] = []; // Placeholder
    const summary =
      holdings.length > 0 ? calculatePortfolioSummary(holdings) : null;

    return NextResponse.json({
      success: true,
      portfolio: {
        holdings,
        summary,
      },
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
 * Add or update holding in portfolio
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      portfolioId,
      symbol,
      name,
      quantity,
      purchasePrice,
      sector,
    } = body;

    // Validation
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

    // TODO: Save holding to database
    const holding: Holding = {
      id: `holding-${Date.now()}`,
      portfolioId,
      symbol,
      name,
      quantity,
      purchasePrice,
      currentPrice: purchasePrice, // Would be fetched from external API
      purchaseDate: new Date(),
      sector,
    };

    return NextResponse.json({
      success: true,
      holding,
    });
  } catch (error) {
    console.error('Error creating holding:', error);
    return NextResponse.json(
      { error: 'Failed to create holding' },
      { status: 500 }
    );
  }
}

/**
 * Calculate risk metrics for portfolio
 */
export function calculateRiskMetrics(holdings: HoldingPerformance[]) {
  const returns = holdings.map((h) => h.gainLossPercent);

  // Average return
  const averageReturn = returns.reduce((a, b) => a + b, 0) / returns.length;

  // Standard deviation (volatility)
  const variance =
    returns.reduce((sum, r) => sum + Math.pow(r - averageReturn, 2), 0) /
    returns.length;
  const standardDeviation = Math.sqrt(variance);

  // Beta (would require market return data)
  // Sharpe ratio (would require risk-free rate)
  // Sortino ratio (would require downside deviation)

  return {
    averageReturn,
    standardDeviation,
    totalRisk: standardDeviation * Math.sqrt(252), // Annualized
    concentration:
      Math.max(...holdings.map((h) => h.currentValue)) /
      holdings.reduce((sum, h) => sum + h.currentValue, 0),
  };
}

/**
 * Get holdings impacted by news article
 */
export function getImpactedHoldings(
  holdings: Holding[],
  newsArticle: any
): Holding[] {
  const text = `${newsArticle.title} ${newsArticle.summary}`.toLowerCase();

  return holdings.filter((holding) => {
    const symbolMatch = text.includes(holding.symbol.toLowerCase());
    const nameMatch = text.includes(holding.name.toLowerCase());
    return symbolMatch || nameMatch;
  });
}

export default {
  calculateHoldingPerformance,
  calculatePortfolioSummary,
  calculateRiskMetrics,
  getImpactedHoldings,
};
