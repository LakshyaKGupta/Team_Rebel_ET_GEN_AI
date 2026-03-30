import { NextRequest, NextResponse } from 'next/server';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface UserProfile {
  userType?: string;
  experienceLevel?: string;
  riskAppetite?: string;
  timeHorizon?: string;
  goal?: string;
  selectedInterests?: string[];
}

export async function POST(req: NextRequest) {
  try {
    const { messages, userProfile } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Get relevant news context for the user's query
    const userQuery = messages[messages.length - 1]?.content || '';
    const newsContext = await fetchRelevantNews(userQuery, userProfile);

    // Build system prompt based on user profile and news context
    const systemPrompt = buildSystemPrompt(userProfile, newsContext);

    // Convert messages to Gemini format
    const geminiMessages = messages.map((msg: Message) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    // Direct API call using Gemini
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/${process.env.GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemPrompt }]
          },
          contents: geminiMessages,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          }
        })
      }
    );

    if (!response.ok) {
      const error = await response.json();
      const errorMsg = error?.error?.message || 'AI service unavailable';
      if (errorMsg.includes('high demand')) {
        throw new Error('AI is busy, please try again in a few seconds');
      }
      throw new Error(errorMsg);
    }

    const data = await response.json();
    const assistantMessage = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return NextResponse.json({
      success: true,
      message: assistantMessage,
      usage: {
        prompt_tokens: 0,
        completion_tokens: 0,
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}

async function fetchRelevantNews(query: string, userProfile: UserProfile): Promise<string> {
  try {
    const interests = userProfile?.selectedInterests?.join(' OR ') || 'business finance';
    const searchQuery = `${query} ${interests}`.substring(0, 100);

    // Use absolute URL for server-side fetch
    const baseUrl = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';
    const res = await fetch(
      `${baseUrl}/api/news?topic=${encodeURIComponent(searchQuery)}&limit=3`,
      { headers: { 'Content-Type': 'application/json' } }
    );

    if (!res.ok) return '';

    const data = await res.json();
    
    if (!data.articles || data.articles.length === 0) return '';

    return data.articles
      .map((article: any) => `- ${article.title}: ${article.summary}`)
      .join('\n');
  } catch (error) {
    console.error('Failed to fetch news context:', error);
    return '';
  }
}

function buildSystemPrompt(userProfile: UserProfile, newsContext: string): string {
  const profile = userProfile || {};
  const userType = profile.userType || 'general reader';
  const experienceLevel = profile.experienceLevel || 'beginner';
  const riskAppetite = profile.riskAppetite || 'moderate';
  const timeHorizon = profile.timeHorizon || 'medium';
  const goal = profile.goal || 'stay updated';
  const interests = profile.selectedInterests?.join(', ') || 'general business news';

  let toneGuidance = '';
  let analysisDepth = '';

  // Adjust tone and depth based on user type
  if (userType === 'investor') {
    toneGuidance = 'Provide investment-focused analysis with potential impacts on portfolios and market trends.';
    analysisDepth = 'Include risk factors, growth potential, and investment implications.';
  } else if (userType === 'founder') {
    toneGuidance = 'Focus on business implications, market opportunities, and competitive dynamics.';
    analysisDepth = 'Highlight market trends, regulatory impacts, and growth opportunities relevant to startups.';
  } else if (userType === 'student') {
    toneGuidance = 'Explain concepts in easy-to-understand language with real-world examples.';
    analysisDepth = 'Break down complex topics into digestible pieces with clear definitions.';
  } else {
    toneGuidance = 'Provide balanced, informative coverage of business and economic news.';
    analysisDepth = 'Focus on clarity and relevance to general audiences.';
  }

  const newsContextSection = newsContext
    ? `\n\nRecent relevant news context:\n${newsContext}`
    : '';

  return `You are a personalized financial news and business analysis assistant for the Economic Times. Your role is to provide clear, insightful answers to user queries about economics, finance, markets, investments, and business news.

## User Profile
- **User Type**: ${userType}
- **Experience Level**: ${experienceLevel}
- **Risk Appetite**: ${riskAppetite}
- **Time Horizon**: ${timeHorizon}
- **Primary Goal**: ${goal}
- **Interests**: ${interests}

## Communication Style
- ${toneGuidance}
- ${analysisDepth}
- Always match the complexity level to the user's experience
- For beginners: Explain without jargon, define key terms
- For advanced users: Provide detailed analysis and data-driven insights
- Be concise yet comprehensive${newsContextSection}

## Guidelines
1. **Personalization**: Always tailor responses to the user's profile and interests
2. **News Integration**: Reference current events and market data when relevant
3. **Accuracy**: Cite sources and acknowledge uncertainty when appropriate
4. **Actionability**: Provide practical insights aligned with the user's goals
5. **Scope**: Focus on economic, financial, business, and market topics
6. **Clarity**: Use appropriate technical depth for the user's experience level
7. **Relevance**: Prioritize information relevant to their stated interests
8. **Redirect**: If asked about non-business topics, politely redirect to relevant business news

## Response Format
- Start with a direct answer to the question
- Provide supporting context or analysis as needed
- Include actionable insights when relevant
- Suggest follow-up topics if useful

Respond in a friendly, professional tone that matches the user's sophistication level and interests.`;
}

