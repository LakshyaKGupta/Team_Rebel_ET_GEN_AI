# Team_Rebel_ET_GEN_AI

**Live Demo**: https://myetnews.vercel.app/

AI-Native News Experience - Personalized newsroom + Interactive AI briefings + AI Chatbot

## 🚀 Overview

This project revolutionizes business news delivery using Gen-AI:

- **My ET**: Personalized newsroom based on user interests
- **News Navigator**: Interactive AI-powered intelligence briefings  
- **News Assistant**: AI chatbot for answering finance and investment queries powered by Groq

## ✨ Features

### Dashboard
- Personalized news based on your interests (Markets, Economy, Tech, Startups, Banking)
- Real news from NewsAPI with images
- Quick filters (Portfolio, Liked, Saved, Interest-based)
- Cached news for instant loading

### Topics
- Browse news by category
- Add custom interests
- Interest verification
- Infinite scroll with "View more"

### Briefing
- AI-generated summaries for articles
- Story Arc: Timeline, Updates, Players, Sentiment
- Personal Impact: "Why it matters to you"
- Portfolio relevance

### Notifications
- Interest-based news alerts
- Breaking news notifications
- Category filters

### AI Chatbot
- Powered by Groq (free tier)
- Context-aware responses
- Article context sharing
- Floating widget on every page

## 🛠 Tech Stack

- **Frontend**: Next.js 14 + Tailwind CSS + Framer Motion
- **Backend**: Next.js API Routes
- **Database**: Prisma + PostgreSQL (Supabase)
- **AI**: Groq API (free tier for chat)
- **News Data**: NewsAPI

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── news/          # News API endpoint
│   │   ├── generate-briefing/  # Briefing generation
│   │   └── ai/            # AI chat endpoints
│   ├── dashboard/         # Main dashboard
│   ├── topics/            # Topics browser
│   ├── briefing/[id]/    # Article briefing
│   ├── notifications/     # Notifications page
│   └── chat/             # Full chat page
├── components/
│   ├── layout/           # Sidebar, Navigation
│   ├── nav/              # BottomNav
│   └── cards/            # TopicVisual, etc.
├── context/
│   ├── UserContext.tsx
│   ├── NotificationContext.tsx
│   ├── BriefingContext.tsx
│   └── ChatContext.tsx
└── lib/
    ├── data.ts           # Static data
    ├── api.ts            # API utilities
    └── types.ts          # TypeScript types
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Groq API key (free at https://console.groq.com)
- NewsAPI key (free at https://newsapi.org)

### Installation

```bash
# Clone the repository
git clone https://github.com/LakshyaKGupta/Team_Rebel_ET_GEN_AI.git
cd Team_Rebel_ET_GEN_AI

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file with:

```env
# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://..."

# Authentication
JWT_SECRET="your-super-secret-jwt-key"

# Groq AI API (free, fast)
GROQ_API_KEY="gsk_..."
GROQ_MODEL="llama-3.1-8b-instant"

# News APIs
NEWSAPI_KEY="your-newsapi-key"

# Frontend
FRONTEND_ORIGIN="http://localhost:3000"
```

### Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

### Build for Production

```bash
npm run build
npm start
```

## 📋 Environment Setup

### Required APIs

1. **Groq API** (for AI Chatbot)
   - Get free key at https://console.groq.com
   - No credit card required
   - Free tier: 30 requests/minute

2. **NewsAPI** (for news articles)
   - Get free key at https://newsapi.org
   - 100 requests/day on free tier
   - Limited to 100 results

3. **Database** (optional for full features)
   - Supabase PostgreSQL recommended
   - Prisma ORM for database access

## 🎯 User Types

The app supports different personas:

- **Investor**: Focus on markets, portfolio, financial news
- **Founder**: Startup ecosystem, funding, tech trends
- **Student**: Learning about business and finance
- **Professional**: Industry-specific insights
- **Explorer**: General news discovery

## 📱 Responsive Design

- Desktop: Full sidebar navigation
- Mobile: Bottom navigation bar
- Touch-friendly UI elements
- Optimized for all screen sizes

## 🔒 Security

- JWT-based authentication
- HTTP-only cookies
- Server-side validation
- Protected API routes

## 📄 License

MIT License - See LICENSE file for details

## 👥 Team

Team Rebel - ET_GEN_AI Hackathon Project

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Groq for providing free AI inference
- NewsAPI for news data
- Vercel for deployment
