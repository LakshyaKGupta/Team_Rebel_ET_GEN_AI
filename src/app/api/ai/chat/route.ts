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
      const userType = userProfile?.userType || 'exploring';
      const interests = userProfile?.selectedInterests?.join(', ') || 'general news';
      const contextTitle = articleContext?.title ? `"${articleContext.title}"` : "this topic";
      
      const userQueryRaw = messages && messages.length > 0 ? messages[messages.length - 1].content : '';
      
      return NextResponse.json({
        success: true,
        message: `[AI Demonstration Mode]\n\nBased on your profile as a **${userType}** interested in **${interests}**, here is my analysis regarding ${contextTitle}:\n\nYou asked: "${userQueryRaw}"\n\nThis article highlights key events that could influence your selected sectors. Since my external API key is not configured, this is an offline demonstration response. However, I have successfully received your exact article context and personalized profile!`
      });
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
      return `You are a friendly, highly intelligent but very conversational news assistant.

${userIntro}
Experience level: ${experienceLevel}
Interests: ${interests}

IMPORTANT: The user is currently reading the specific article summarized below. When they say "this article" or ask you to explain it, DO NOT ask them for a link! You must use the context provided below to generate your answer immediately.

ARTICLE CONTEXT:
Title: ${articleContext.title}
Summary: ${articleContext.summary || 'No summary available'}
${articleContext.category ? `Category: ${articleContext.category}` : ''}

YOUR CONVERSATION RULES:
- If the user asks about "this article", analyze the ARTICLE CONTEXT block above and answer them.
- You must reply exactly like a human talking to a friend! Never use rigid or robotic structure.
- Answer their question directly in 1 or 2 short, highly readable paragraphs.
- Keep the language incredibly simple. Explain it like they are five years old if the topic is complex.
- Do NOT use bullet points or numbered lists unless explicitly asked to.
- Never say "Here is the answer". Just start having a normal conversation with them giving them the answer.
- Keep your entire response under 100 words if possible. Just be direct, friendly, and helpful.`;
  }

  return `You are a friendly, highly intelligent but very conversational news assistant.

${userIntro}
Experience level: ${experienceLevel}
Interests: ${interests}

YOUR CONVERSATION RULES:
- Reply naturally like a friend. Never use rigid or robotic formatting.
- Keep sentences short, sweet, and incredibly easy to understand.
- Do NOT output numbered lists or complex sections.
- Just answer their question directly natively in no more than 1 or 2 paragraphs.
- Drop all financial jargon immediately and explain the concepts plainly.`;
}
