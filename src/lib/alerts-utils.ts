// Alert System Utilities
// Helper functions for the alerts system

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface PortfolioAsset {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  priceChange?: number;
}

export interface NewsAlert {
  id: string;
  assetSymbol: string;
  title: string;
  summary: string;
  source: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  importance: 'high' | 'medium' | 'low';
  timestamp: Date;
  articleUrl: string;
}

/**
 * Check if a news article mentions any portfolio assets
 */
export function isRelevantToAsset(
  articleTitle: string,
  articleSummary: string,
  assetSymbol: string,
  assetName: string
): boolean {
  const text = `${articleTitle} ${articleSummary}`.toLowerCase();
  const symbolLower = assetSymbol.toLowerCase();
  const nameLower = assetName.toLowerCase();

  if (text.includes(symbolLower) || text.includes(nameLower)) {
    return true;
  }

  const variations = [
    assetSymbol.replace(/^([A-Z]+)\d+/, '$1'),
    assetName.split(' ')[0],
  ];

  return variations.some((v) => v && text.includes(v.toLowerCase()));
}

/**
 * Determine alert importance based on sentiment and keywords
 */
export function determineImportance(
  title: string,
  summary: string,
  sentiment: string
): 'high' | 'medium' | 'low' {
  const text = `${title} ${summary}`.toLowerCase();
  const highPriorityWords = [
    'crash', 'collapse', 'surge', 'breakthrough', 'bankruptcy',
    'acquisition', 'merger', 'ipo', 'scandal', 'fraud',
  ];
  const mediumPriorityWords = [
    'earnings', 'profit', 'loss', 'growth', 'decline', 'upgrade', 'downgrade',
  ];

  const hasHighPriority = highPriorityWords.some((word) => text.includes(word));
  const hasMediumPriority = mediumPriorityWords.some((word) => text.includes(word));

  if (hasHighPriority || sentiment !== 'neutral') return 'high';
  if (hasMediumPriority) return 'medium';
  return 'low';
}

/**
 * Process news articles and create alerts for portfolio assets
 */
export async function processNewsForAlerts(
  articles: any[],
  portfolioAssets: PortfolioAsset[],
  userId: string
): Promise<NewsAlert[]> {
  const alerts: NewsAlert[] = [];

  for (const article of articles) {
    for (const asset of portfolioAssets) {
      if (isRelevantToAsset(
        article.title || '',
        article.summary || '',
        asset.symbol,
        asset.name
      )) {
        const importance = determineImportance(
          article.title || '',
          article.summary || '',
          article.sentiment || 'neutral'
        );

        alerts.push({
          id: `alert-${Date.now()}-${Math.random()}`,
          assetSymbol: asset.symbol,
          title: article.title,
          summary: article.summary,
          source: article.source,
          sentiment: article.sentiment || 'neutral',
          importance,
          timestamp: new Date(article.date || Date.now()),
          articleUrl: article.url,
        });
      }
    }
  }

  return alerts;
}

/**
 * Send alert notification (email, push, in-app)
 */
export async function sendAlert(alert: NewsAlert, userId: string) {
  try {
    const emailTemplate = `
      <h2>${alert.assetSymbol}: ${alert.title}</h2>
      <p><strong>Source:</strong> ${alert.source}</p>
      <p><strong>Sentiment:</strong> ${alert.sentiment}</p>
      <p><strong>Priority:</strong> ${alert.importance}</p>
      <p>${alert.summary}</p>
      <p><a href="${alert.articleUrl}">Read full article</a></p>
    `;

    console.log(`[Alert] Sending email to user ${userId}:`, alert);
    console.log(`[Alert] Push notification for user ${userId}:`, alert);
    console.log(`[Alert] In-app notification for user ${userId}:`, alert);
  } catch (error) {
    console.error('Error sending alert:', error);
  }
}
