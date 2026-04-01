import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

const generalViewCache = new Map<string, unknown>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, mode, articles, depthLevel, simulatedUserType } = body;

    if (!topic || !mode) {
      return NextResponse.json({ error: "Missing topic or mode" }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "Groq API key not configured" }, { status: 500 });
    }

    const cacheKey = JSON.stringify({
      topic,
      mode,
    });

    if (mode === "general_view" && generalViewCache.has(cacheKey)) {
      return NextResponse.json(generalViewCache.get(cacheKey));
    }

    const prompt = `
Provide a ${mode === 'explain_simply' ? 'simple' : 'detailed'} brief about the topic: ${topic}

${articles ? `Based on these articles: ${JSON.stringify(articles)}` : 'Use your knowledge to provide insights.'}

Keep the response clear, concise, and actionable.
`;

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: 'You are a financial news briefing assistant. Provide clear, concise, and actionable insights.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1024,
      })
    });

    if (!groqResponse.ok) {
      const error = await groqResponse.json();
      console.error('Groq API error:', error);
      throw new Error(`Groq returned ${groqResponse.status}`);
    }

    const data = await groqResponse.json();
    const aiResponse = data.choices?.[0]?.message?.content || '';

    const responsePayload = {
      topic,
      mode,
      aiResponse,
      source: "groq",
      timestamp: new Date().toISOString(),
    };

    if (mode === "general_view") {
      generalViewCache.set(cacheKey, responsePayload);
    }

    return NextResponse.json(responsePayload);
  } catch (error) {
    console.error("AI briefing error:", error);
    return NextResponse.json(
      { error: "Failed to generate briefing" },
      { status: 500 }
    );
  }
}
