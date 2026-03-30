// Social Sharing Module
// Enables sharing of articles and briefings to social platforms

import { NextRequest, NextResponse } from 'next/server';

interface ShareableContent {
  id: string;
  title: string;
  summary: string;
  url: string;
  imageUrl?: string;
  articleUrl?: string;
}

interface ShareStats {
  contentId: string;
  platform: string;
  shareCount: number;
  clicks: number;
  lastShared: Date;
}

/**
 * Generate sharing URLs for different platforms
 */
export function generateShareUrls(content: ShareableContent) {
  const encodedUrl = encodeURIComponent(content.url);
  const encodedTitle = encodeURIComponent(content.title);
  const encodedSummary = encodeURIComponent(content.summary);

  return {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedSummary}%0A%0A${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    copy: content.url, // For copy to clipboard
  };
}

/**
 * Generate shareable snippet for content
 */
export function generateShareSnippet(content: ShareableContent): string {
  return `
"${content.title}"

${content.summary}

Read more: ${content.url}

#ETGenAI #News
  `.trim();
}

/**
 * Track share click
 */
export async function trackShare(
  contentId: string,
  platform: string,
  userId: string
): Promise<void> {
  try {
    // TODO: Save share event to database
    console.log(`[Share] ${platform} share of ${contentId} by user ${userId}`);
  } catch (error) {
    console.error('Error tracking share:', error);
  }
}

/**
 * Get share statistics
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const contentId = searchParams.get('contentId');

    if (!contentId) {
      return NextResponse.json(
        { error: 'contentId parameter required' },
        { status: 400 }
      );
    }

    // TODO: Fetch share stats from database
    const stats = {
      contentId,
      totalShares: 0,
      byPlatform: {
        twitter: 0,
        linkedin: 0,
        facebook: 0,
        email: 0,
        whatsapp: 0,
        reddit: 0,
      },
      topPlatform: 'twitter',
    };

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error('Error fetching share stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch share stats' },
      { status: 500 }
    );
  }
}

/**
 * API endpoint to track share
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contentId, platform, userId } = body;

    if (!contentId || !platform) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await trackShare(contentId, platform, userId);

    return NextResponse.json({
      success: true,
      message: 'Share tracked successfully',
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
 * React component for share buttons
 */
export const ShareButtons = ({
  content,
  onShare,
}: {
  content: ShareableContent;
  onShare?: (platform: string) => void;
}) => {
  const urls = generateShareUrls(content);

  const platforms = [
    { name: 'Twitter', icon: '𝕏', url: urls.twitter },
    { name: 'LinkedIn', icon: 'in', url: urls.linkedin },
    { name: 'Facebook', icon: 'f', url: urls.facebook },
    { name: 'Email', icon: '✉', url: urls.email },
    { name: 'WhatsApp', icon: 'W', url: urls.whatsapp },
  ];

  const handleShare = (platform: string, url: string) => {
    onShare?.(platform);
    window.open(url, '_blank', 'width=600,height=400');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(urls.copy);
    onShare?.('copy');
  };

  return (
    <div className="flex items-center gap-2">
      {platforms.map((platform) => (
        <button
          key={platform.name}
          onClick={() => handleShare(platform.name, platform.url)}
          className="rounded-full p-2 hover:bg-[#F8F3EB] transition-colors"
          title={`Share on ${platform.name}`}
        >
          <span className="text-sm font-semibold text-[#8B4513]">
            {platform.icon}
          </span>
        </button>
      ))}
      <button
        onClick={handleCopy}
        className="rounded-full p-2 hover:bg-[#F8F3EB] transition-colors"
        title="Copy link"
      >
        <span className="text-sm font-semibold text-[#8B4513]">🔗</span>
      </button>
    </div>
  );
};

export default {
  generateShareUrls,
  generateShareSnippet,
  trackShare,
};
