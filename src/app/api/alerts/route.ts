// Real-Time Portfolio Alerts System
// Monitors news for portfolio-related articles and sends alerts

import { NextRequest, NextResponse } from 'next/server';

interface Alert {
  id: string;
  userId: string;
  assetSymbol: string;
  alertType: 'price_change' | 'news_mention' | 'threshold_breach';
  threshold?: number;
  isActive: boolean;
  createdAt: Date;
}

interface PortfolioAsset {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  priceChange?: number;
}

interface NewsAlert {
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
function isRelevantToAsset(
  articleTitle: string,
  articleSummary: string,
  assetSymbol: string,
  assetName: string
): boolean {
  const text = `${articleTitle} ${articleSummary}`.toLowerCase();
  const symbolLower = assetSymbol.toLowerCase();
  const nameLower = assetName.toLowerCase();

  // Direct mention
  if (text.includes(symbolLower) || text.includes(nameLower)) {
    return true;
  }

  // Check for common variations
  const variations = [
    assetSymbol.replace(/^([A-Z]+)\d+/, '$1'), // Remove trailing numbers
    assetName.split(' ')[0], // First word of name
  ];

  return variations.some((v) => v && text.includes(v.toLowerCase()));
}

/**
 * Determine alert importance based on sentiment and keywords
 */
function determineImportance(
  title: string,
  summary: string,
  sentiment: string
): 'high' | 'medium' | 'low' {
  const text = `${title} ${summary}`.toLowerCase();
  const highPriorityWords = [
    'crash',
    'collapse',
    'surge',
    'breakthrough',
    'bankruptcy',
    'acquisition',
    'merger',
    'ipo',
    'scandal',
    'fraud',
  ];
  const mediumPriorityWords = [
    'earnings',
    'profit',
    'loss',
    'growth',
    'decline',
    'upgrade',
    'downgrade',
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
      if (
        isRelevantToAsset(
          article.title || '',
          article.summary || '',
          asset.symbol,
          asset.name
        )
      ) {
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
 * API route for retrieving portfolio alerts
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

    // TODO: Fetch from database
    // This would query the alerts table filtered by userId
    const alerts: NewsAlert[] = []; // Placeholder

    const filtered =
      importance === 'all'
        ? alerts
        : alerts.filter((a) => a.importance === importance);

    return NextResponse.json({
      success: true,
      alerts: filtered,
      count: filtered.length,
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
 * Create a new alert for a portfolio asset
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, assetSymbol, alertType, threshold } = body;

    if (!userId || !assetSymbol || !alertType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate alert type
    const validTypes = ['price_change', 'news_mention', 'threshold_breach'];
    if (!validTypes.includes(alertType)) {
      return NextResponse.json(
        { error: 'Invalid alert type' },
        { status: 400 }
      );
    }

    // TODO: Save to database
    const alert: Alert = {
      id: `alert-${Date.now()}`,
      userId,
      assetSymbol,
      alertType,
      threshold,
      isActive: true,
      createdAt: new Date(),
    };

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
 * Send alert notification (email, push, in-app)
 */
export async function sendAlert(alert: NewsAlert, userId: string) {
  // Email notification
  try {
    const emailTemplate = `
      <h2>${alert.assetSymbol}: ${alert.title}</h2>
      <p><strong>Source:</strong> ${alert.source}</p>
      <p><strong>Sentiment:</strong> ${alert.sentiment}</p>
      <p><strong>Priority:</strong> ${alert.importance}</p>
      <p>${alert.summary}</p>
      <p><a href="${alert.articleUrl}">Read full article</a></p>
    `;

    // TODO: Send email via SendGrid, Nodemailer, etc.
    console.log(`[Alert] Sending email to user ${userId}:`, alert);

    // Push notification (for mobile)
    // TODO: Implement push notifications
    console.log(`[Alert] Push notification for user ${userId}:`, alert);

    // In-app notification (via database)
    // TODO: Save notification to database
    console.log(`[Alert] In-app notification for user ${userId}:`, alert);
  } catch (error) {
    console.error('Error sending alert:', error);
  }
}

export default {
  processNewsForAlerts,
  sendAlert,
  determineImportance,
  isRelevantToAsset,
};
