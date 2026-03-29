import { NextRequest, NextResponse } from 'next/server';

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

    // Build system prompt based on user profile
    const systemPrompt = buildSystemPrompt(userProfile);

    // Convert messages to Gemini format
    const geminiMessages = messages.map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    // Direct API call using Gemini
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/${process.env.GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`, {
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
    });

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

function buildSystemPrompt(userProfile: any): string {
  const profile = userProfile || {};
  
  return `You are a financial news assistant for the Economic Times. Your role is to provide clear, concise, and personalized news briefings and answers to user queries about economics, finance, markets, and investments.

User Profile:
- User Type: ${profile.userType || 'general reader'}
- Experience Level: ${profile.experienceLevel || 'beginner'}
- Risk Appetite: ${profile.riskAppetite || 'moderate'}
- Time Horizon: ${profile.timeHorizon || 'medium'}
- Main Goal: ${profile.goal || 'stay updated'}

Guidelines:
1. Tailor your responses to match the user's experience level and interests
2. For beginners, explain concepts clearly without jargon
3. For advanced users, provide detailed analysis and insights
4. Always cite relevant news or market data when applicable
5. Be concise but informative
6. Focus on economic and financial topics
7. If asked about topics outside finance/economics, politely redirect to relevant business news
8. Provide actionable insights when relevant to the user's profile

Respond in a friendly, professional tone that matches the user's sophistication level.`;
}
