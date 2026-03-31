// Portfolio Analytics Utilities
// Helper functions for portfolio calculations

export interface Holding {
  id: string;
  portfolioId?: string;
  symbol: string;
  name: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  purchaseDate: Date;
  sector?: string | null;
  notes?: string | null;
}

export interface HoldingPerformance {
  holding: Holding;
  currentValue: number;
  purchaseValue: number;
  gainLoss: number;
  gainLossPercent: number;
  dayChangePercent: number;
  dayChange: number;
}

export interface PortfolioSummary {
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

  let topPerformer = holdings[0] || null;
  let worstPerformer = holdings[0] || null;

  for (const holding of holdings) {
    if (holding.gainLossPercent > (topPerformer?.gainLossPercent ?? -Infinity)) {
      topPerformer = holding;
    }
    if (holding.gainLossPercent < (worstPerformer?.gainLossPercent ?? Infinity)) {
      worstPerformer = holding;
    }
  }

  const sectorAllocation: Record<string, number> = {};
  for (const { holding, currentValue } of holdings) {
    const sector = holding.sector || 'Uncategorized';
    sectorAllocation[sector] = (sectorAllocation[sector] || 0) + currentValue;
  }

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
 * Calculate risk metrics for portfolio
 */
export function calculateRiskMetrics(holdings: HoldingPerformance[]) {
  const returns = holdings.map((h) => h.gainLossPercent);
  const averageReturn = returns.reduce((a, b) => a + b, 0) / returns.length;

  const variance =
    returns.reduce((sum, r) => sum + Math.pow(r - averageReturn, 2), 0) /
    returns.length;
  const standardDeviation = Math.sqrt(variance);

  return {
    averageReturn,
    standardDeviation,
    totalRisk: standardDeviation * Math.sqrt(252),
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
