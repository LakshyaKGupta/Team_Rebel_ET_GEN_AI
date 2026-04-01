import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

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

interface ArticleContext {
  title: string;
  summary: string;
  url: string;
  category?: string;
  generalView?: string;
  keyTakeaways?: string[];
  impact?: Record<string, string>;
  sources?: Array<{ name: string; url: string }>;
}

export async function POST(req: NextRequest) {
  try {
    const { messages, userProfile, articleContext } = await req.json();

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'AI is not configured. Please try again later.' },
        { status: 500 }
      );
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Please ask a question' },
        { status: 400 }
      );
    }

    const userQuery = messages[messages.length - 1]?.content || '';
    const systemPrompt = buildSystemPrompt(userProfile, articleContext);

    const groqMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map((msg: Message) => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      }))
    ];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
        messages: groqMessages,
        temperature: 0.7,
        max_tokens: 1200,
      })
    });

    if (!response.ok) {
      const error = await response.json();
      const errorMsg = error?.error?.message || 'AI service unavailable';
      if (errorMsg.includes('high demand') || errorMsg.includes('rate limit')) {
        throw new Error('AI is busy. Please wait a moment and try again.');
      }
      throw new Error(errorMsg);
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content || '';

    return NextResponse.json({
      success: true,
      message: assistantMessage,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}

function buildSystemPrompt(userProfile: UserProfile, articleContext?: ArticleContext | null) {
  const profile = userProfile || {};
  const userType = profile.userType || 'exploring';
  const experienceLevel = profile.experienceLevel || 'beginner';
  const interests = profile.selectedInterests?.join(', ') || 'business, finance, economy';

  let userIntro = '';
  if (userType === 'student') {
    userIntro = 'The user is a student. Use simple examples and relate to studies/careers.';
  } else if (userType === 'investor') {
    userIntro = 'The user is an investor. Focus on portfolio impact and market implications.';
  } else if (userType === 'founder') {
    userIntro = 'The user is a startup founder. Focus on business implications and opportunities.';
  } else if (userType === 'professional') {
    userIntro = 'The user is a working professional. Focus on industry trends and practical insights.';
  } else {
    userIntro = 'The user is exploring business news. Keep explanations clear and practical.';
  }

  if (articleContext) {
    return `You are a friendly news assistant. Help the user understand an article clearly.

${userIntro}
Experience level: ${experienceLevel}
Interests: ${interests}

ARTICLE TO EXPLAIN:
Title: ${articleContext.title}
Summary: ${articleContext.summary || 'No summary available'}
${articleContext.category ? `Category: ${articleContext.category}` : ''}
${articleContext.generalView ? `Why it matters: ${articleContext.generalView}` : ''}
${articleContext.keyTakeaways?.length ? `Key points:\n${articleContext.keyTakeaways.map((t, i) => `${i + 1}. ${t}`).join('\n')}` : ''}

IMPORTANT RULES:
- Start with a clear, simple explanation
- Use short paragraphs (2-3 sentences each)
- Avoid jargon - if you must use it, explain it
- Give practical examples
- End with what this means for the user specifically
- Be conversational, like explaining to a friend
- Don't be overly formal

Format your response like this:
1. What happened (1-2 sentences)
2. Why it matters (2-3 sentences)
3. What it means for you (1-2 sentences)
4. Simple example if helpful

Keep it under 200 words. Be direct and helpful.`;
  }

  return `You are a friendly news assistant. Help users understand business and financial news.

${userIntro}
Experience level: ${experienceLevel}
Interests: ${interests}

IMPORTANT RULES:
- Be conversational and warm
- Start with the key takeaway
- Use short paragraphs
- Avoid jargon when possible
- Give practical examples
- Relate to the user's interests
- Keep responses focused and useful
- If you're not sure, say so honestly

Format: Be direct. Short intro, explanation, then practical takeaway.`;
}
