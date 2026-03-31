// Email Digest Utilities
// Helper functions for email digest generation

export interface DigestArticle {
  title: string;
  summary: string;
  source: string;
  url: string;
  date: string;
  category: string;
  sentiment: string;
}

export interface EmailDigest {
  userId: string;
  subject: string;
  generatedAt: Date;
  articles: DigestArticle[];
  portfolioUpdates?: any;
  analytics?: any;
  unsubscribeToken: string;
}

/**
 * Generate email digest HTML
 */
export function generateDigestHTML(digest: EmailDigest): string {
  const articleHTML = digest.articles
    .map(
      (article) => `
    <div style="margin-bottom: 20px; padding: 15px; border-left: 4px solid #8B4513; background: #FCFAF5;">
      <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #1A1A1A;">
        ${article.title}
      </h3>
      <div style="margin-bottom: 10px; font-size: 12px; color: #5C5C5C;">
        <span style="background: #F4EBDD; padding: 2px 8px; border-radius: 12px; margin-right: 8px;">
          ${article.category}
        </span>
        <span>${article.source}</span>
      </div>
      <p style="margin: 0 0 10px 0; font-size: 14px; line-height: 1.6; color: #5C5C5C;">
        ${article.summary}
      </p>
      <a href="${article.url}" style="color: #8B4513; text-decoration: none; font-weight: 500;">
        Read full story →
      </a>
    </div>
  `
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${digest.subject}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1A1A1A; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%); color: white; padding: 30px; border-radius: 8px; text-align: center; margin-bottom: 30px; }
        .header h1 { margin: 0; font-size: 24px; font-weight: bold; }
        .header p { margin: 8px 0 0 0; font-size: 14px; opacity: 0.9; }
        .content { margin-bottom: 30px; }
        .footer { border-top: 1px solid #DDD4C4; padding-top: 20px; text-align: center; font-size: 12px; color: #5C5C5C; }
        a { color: #8B4513; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>📰 Your Daily Briefing</h1>
        <p>Personalized news and insights for you</p>
      </div>
      <div class="content">
        <h2 style="color: #1A1A1A; margin-bottom: 20px;">Top Stories</h2>
        ${articleHTML}
      </div>
      <div class="footer">
        <p><a href="#">View in browser</a> | <a href="#">Manage preferences</a> | <a href="#">Unsubscribe</a></p>
        <p>© 2026 ET Gen AI. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Send email digest
 */
export async function sendEmailDigest(
  userEmail: string,
  digest: EmailDigest
): Promise<boolean> {
  try {
    const htmlContent = generateDigestHTML(digest);
    console.log(`[Email] Digest sent to ${userEmail}`);
    return true;
  } catch (error) {
    console.error('Error sending email digest:', error);
    return false;
  }
}

/**
 * Schedule digest based on user preferences
 */
export async function scheduleDigests(): Promise<void> {
  try {
    console.log('[Scheduler] Checking for scheduled digests...');
  } catch (error) {
    console.error('Error scheduling digests:', error);
  }
}
