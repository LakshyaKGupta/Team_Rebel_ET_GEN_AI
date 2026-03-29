import { NextRequest, NextResponse } from "next/server";

const generalViewCache = new Map<string, unknown>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, mode, articles, depthLevel, simulatedUserType } = body;

    if (!topic || !mode) {
      return NextResponse.json({ error: "Missing topic or mode" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
    }

    const cacheKey = JSON.stringify({
      topic,
      mode,
    });

    if (mode === "general_view" && generalViewCache.has(cacheKey)) {
      return NextResponse.json(generalViewCache.get(cacheKey));
    }

    // Simple prompt without persona complexity
    const prompt = `
Provide a ${mode === 'explain_simply' ? 'simple' : 'detailed'} brief about the topic: ${topic}

${articles ? `Based on these articles: ${JSON.stringify(articles)}` : 'Use your knowledge to provide insights.'}

Keep the response clear, concise, and actionable.
`;

    // Call Gemini API directly
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1/models/${process.env.GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: 'You are a financial news briefing assistant. Provide clear, concise, and actionable insights.' }]
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!geminiResponse.ok) {
      const error = await geminiResponse.json();
      console.error('Gemini API error:', error);
      throw new Error(`Gemini returned ${geminiResponse.status}`);
    }

    const data = await geminiResponse.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    const responsePayload = {
      topic,
      mode,
      aiResponse,
      source: "gemini",
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
