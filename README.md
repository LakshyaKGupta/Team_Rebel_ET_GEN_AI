# Team_Rebel_ET_GEN_AI

AI-Native News Experience - Personalized newsroom + Interactive AI briefings + AI Chatbot

## Project Overview

This project aims to revolutionize business news delivery using Gen-AI:
- **My ET**: Personalized newsroom based on user interests
- **News Navigator**: Interactive AI-powered intelligence briefings
- **News Assistant**: AI chatbot for answering finance and investment queries powered by Groq

## Key Features

✨ **Personalized Dashboard**: Curated news based on user type and interests
📰 **Smart Briefings**: AI-generated summaries adapted to your profile
💬 **AI Chatbot**: Ask questions about markets, investments, and news
📊 **Portfolio Integration**: Track relevant news for your investments
🎯 **User Profiles**: Investor, Founder, Student, or Explorer personas

## Tech Stack

- Frontend: Next.js 14 + Tailwind CSS
- Backend: Next.js API Routes
- Database: Prisma + SQLite
- AI: Groq (free tier for chat)
- News Data: Static data (integrates GDELT / NewsAPI)

## Getting Started

```bash
# Clone the repository
git clone https://github.com/LakshyaKGupta/Team_Rebel_ET_GEN_AI.git

# Install dependencies
cd Team_Rebel_ET_GEN_AI
npm install

# Configure environment
# Copy .env and add your Groq API key
# See CHATBOT_SETUP.md for detailed instructions

# Run development server
npm run dev
```

Visit http://localhost:3000 to get started!

## AI Chatbot Setup

The project includes an AI-powered chatbot with:
- **Free Tier**: Uses Groq API (no credit card required)
- **Personalized**: Responds based on your user profile
- **Always Available**: Floating widget on every page
- **Full Chat Page**: Dedicated interface at `/chat`

For detailed setup instructions, see [CHATBOT_SETUP.md](CHATBOT_SETUP.md).

### Quick Start

1. Get free API key: https://console.groq.com
2. Add to `.env`: `GROQ_API_KEY="your-key"`
3. Start dev server: `npm run dev`
4. Click the 💬 icon (bottom-right) to chat!
