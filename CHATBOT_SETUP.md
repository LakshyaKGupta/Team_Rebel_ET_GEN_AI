# Groq AI Chatbot Setup Guide

This project now includes an AI-powered chatbot that answers news and finance-related queries using the Groq API. The chatbot is personalized based on the user's profile.

## Features

- **Floating Widget**: Chat widget appears as a floating button on all pages
- **Full-Page Chat**: Dedicated chat page at `/chat` for extended conversations
- **Personalized Responses**: AI adapts responses based on user profile (type, experience level, risk appetite)
- **Free Tier**: Uses Groq's free tier API with no credit card required
- **Streaming Response**: Smooth chat experience with real-time responses

## Setup Instructions

### 1. Get a Groq API Key (Free)

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up with your email
3. Navigate to the API Keys section
4. Create a new API key
5. Copy the key

### 2. Add to Environment Variables

Update your `.env` file:

```bash
# Replace with your actual API key from step 1
GROQ_API_KEY="gsk_your_api_key_here"
```

### 3. Start the Development Server

```bash
npm run dev
```

The chatbot is now available:
- **Floating Widget**: Visible on all pages (bottom-right corner)
- **Full Chat Page**: Navigate to `/chat` for dedicated chat interface

## Free Tier Limits

Groq's free tier provides generous limits:
- **Rate Limit**: 30 requests per minute
- **Model**: Mixtral 8x7b (fast, efficient)
- **Response Length**: Up to 1024 tokens per message
- **No Credit Card Required**: Completely free

## Architecture

### New Files Added

```
src/
├── app/
│   ├── api/ai/chat/route.ts          # Chat API endpoint
│   └── chat/page.tsx                  # Full-page chat interface
├── components/
│   └── ChatBotWidget.tsx             # Floating chat widget
└── context/
    └── ChatContext.tsx               # Chat state management
```

### API Endpoint: `/api/ai/chat`

**Request:**
```json
{
  "messages": [
    { "role": "user", "content": "What happened to tech stocks today?" }
  ],
  "userProfile": {
    "userType": "investor",
    "experienceLevel": "intermediate",
    "riskAppetite": "moderate"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Tech stocks experienced...",
  "usage": {
    "prompt_tokens": 45,
    "completion_tokens": 126
  }
}
```

## How It Works

### Personalization Engine

The chatbot uses the user's profile to tailor responses:

- **Tone**: Matches user sophistication (enthusiastic for beginners, analytical for advanced)
- **Depth**: Adjusts explanation complexity
- **Focus**: Highlights relevant insights based on user type (investor, student, founder, explorer)
- **Risk Considerations**: Incorporates risk appetite into financial advice

### Chat Context

The `ChatContext` manages:
- Message history (user and assistant)
- Loading states
- Error handling
- User profile integration

### Widget vs Full Page

- **Widget**: Quick queries, always accessible, unobtrusive
- **Full Page**: Deep conversations, better readability, dedicated space

## Customization

### Change AI Model

Edit `src/app/api/ai/chat/route.ts`:

```typescript
const response = await groq.chat.completions.create({
  model: 'llama2-70b-4096',  // Or any other Groq model
  // ... rest of config
});
```

Available models on Groq:
- `mixtral-8x7b-32768` (Default, fast)
- `llama2-70b-4096` (Larger, slower)
- `gemma-7b-it` (Lean)

### Modify System Prompt

Edit the `buildSystemPrompt()` function in `src/app/api/ai/chat/route.ts` to change:
- Personality
- Guidelines
- Output format
- Tone for different user types

### Customize Widget Appearance

Edit `src/components/ChatBotWidget.tsx`:
- Colors: Modify Tailwind classes
- Position: Change the button placement
- Size: Adjust width/height

## Testing

### Local Testing

1. Start dev server: `npm run dev`
2. Open http://localhost:3000
3. Look for messaging icon (bottom-right)
4. Click to open chat
5. Try a query: "What are the top market trends?"

### Example Queries

- "Explain inflation for a beginner"
- "What sectors should I invest in?"
- "How does the stock market work?"
- "What's happening with cryptocurrency?"
- "Difference between stocks and bonds?"

## Troubleshooting

### "Groq API key not configured"

Make sure `.env` file has:
```
GROQ_API_KEY="your-actual-key"
```

Then restart the dev server.

### "Failed to process chat request"

1. Check API key validity at [console.groq.com](https://console.groq.com)
2. Verify rate limits (30 req/min on free tier)
3. Check browser console for detailed errors
4. Ensure user profile exists (complete onboarding)

### Chat widget not appearing

1. Make sure `ChatProvider` is in layout.tsx
2. Check browser console for errors
3. Clear browser cache and refresh

## Future Enhancements

Potential improvements:
- **Message Persistence**: Save chat history to database
- **Search Integration**: Link to actual news articles
- **Voice Chat**: Audio input/output
- **Export Conversations**: Download chat as PDF
- **Advanced Analytics**: Track common questions
- **Multi-language**: Support multiple languages
- **Streaming Responses**: Real-time token streaming

## Cost Analysis

**Groq Free Tier**: Completely free with generous limits
- Perfect for MVP and testing
- No credit card required
- Estimated 10,000+ messages per month possible

**Future Scaling**:
When scaling to production, consider:
- Groq paid plans
- OpenAI API
- Anthropic Claude
- Local LLM with Ollama

## Support

For issues or questions:
1. Check Groq documentation: https://console.groq.com/docs
2. Review browser console for errors
3. Check `.env` configuration
4. Verify API key validity
