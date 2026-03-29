import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, context, conversationId } = body;

    if (!question || question.trim().length === 0) {
      return NextResponse.json({ error: "Question cannot be empty" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
    }

    // Build messages with context
    const systemPrompt = `You are a knowledgeable financial and economics advisor. 
Answer questions about investments, markets, startups, and economics in a clear, 
concise manner. Keep responses focused and actionable.`;

    const userMessage = context 
      ? `Context: ${context}\n\nNow answer: ${question}`
      : question;

    // Get AI response
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/${process.env.GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemPrompt }]
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: userMessage }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 512,
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Gemini API error:', error);
      throw new Error(`Gemini returned ${response.status}`);
    }

    const data = await response.json();
    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Generate simple ID
    const questionId = Math.random().toString(36).substring(7);

    return NextResponse.json({
      questionId,
      question,
      answer,
      timestamp: new Date().toISOString(),
      source: "gemini",
    });
  } catch (error) {
    console.error("Ask error:", error);

    // Return a helpful error response
    return NextResponse.json(
      {
        error: "Failed to get answer",
        message: "The Gemini AI service is temporarily unavailable. Please try again.",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get conversation history would require database access
    // For now, return empty history
    return NextResponse.json({
      history: [],
      count: 0,
    });
  } catch (error) {
    console.error("Get Q&A history error:", error);
    return NextResponse.json(
      { error: "Failed to fetch history" },
      { status: 500 }
    );
  }
}
