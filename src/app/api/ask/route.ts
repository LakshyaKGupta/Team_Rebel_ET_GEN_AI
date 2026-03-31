import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, context, conversationId } = body;

    if (!question || question.trim().length === 0) {
      return NextResponse.json({ error: "Question cannot be empty" }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "Groq API key not configured" }, { status: 500 });
    }

    const systemPrompt = `You are a knowledgeable financial and economics advisor. 
Answer questions about investments, markets, startups, and economics in a clear, 
concise manner. Keep responses focused and actionable.`;

    const userMessage = context 
      ? `Context: ${context}\n\nNow answer: ${question}`
      : question;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 512,
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Groq API error:', error);
      throw new Error(`Groq returned ${response.status}`);
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || '';

    const questionId = Math.random().toString(36).substring(7);

    return NextResponse.json({
      questionId,
      question,
      answer,
      timestamp: new Date().toISOString(),
      source: "groq",
    });
  } catch (error) {
    console.error("Ask error:", error);

    return NextResponse.json(
      {
        error: "Failed to get answer",
        message: "The Groq AI service is temporarily unavailable. Please try again.",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
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
