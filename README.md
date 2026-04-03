# My ET — AI-Native News Experience

> **Built by Team Rebel for the ET Gen AI Hackathon**

[![Live Demo](https://img.shields.io/badge/Live_Demo-myetnews.vercel.app-emerald?style=for-the-badge)](https://myetnews.vercel.app/) [![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/) [![Groq](https://img.shields.io/badge/Powered_by-Groq_AI-f55036?style=for-the-badge)](https://groq.com)

Welcome to **My ET**, an entirely reimagined business news ecosystem built from the ground up for the AI era. Instead of overwhelming users with a static wall of generic headlines, My ET leverages advanced LLMs (via Groq) to intelligently curate, summarize, and synthesize macroeconomic events natively around the user’s personal portfolio, goals, and risk appetite.

Because reading the news shouldn't feel like a chore; it should feel like having a brilliant analyst briefing you.

---

## 🌟 The Vision

Business news currently suffers from noise, irrelevance, and high cognitive load. **My ET** solves this triad by introducing three revolutionary pillars:

1. **The Personalized Newsroom:** A dynamic dashboard that reads the user's investment profile and automatically filters out the noise, presenting only what moves the needle for them.
2. **The "Story Arc" Briefings:** We don't just show an article. My ET runs an AI inference pipeline that generates a multi-dimensional briefing, uncovering hidden triggers, timeline outlooks, and multi-perspective contrarian debates—complete with likelihood percentages and key momentum indicators.
3. **The Embedded News Assistant:** A context-aware financial chatbot that lives natively within every briefing, instantly answering complex questions like *"How will this RBI decision impact my specific HDFC stock holding?"*

## 💡 Core Functionalities

### 1. Intelligent Dashboard & Radar
- **Live Event Ingestion:** Connects to live RSS pipelines ensuring real-time discovery of critical market events.
- **Portfolio Radar Strategy:** Our bespoke algorithm semantically cross-references live news with the user's declared portfolio assets (e.g. tracking "RELIANCE" or "HDFC"), highlighting *where their holdings intersect with the news.*
- **Contrarian Views Visualization:** Instantly see Bull vs Bear vs Base scenario probabilities modeled securely by our backend AI logic.

### 2. High-Speed, Zero-Cost Inference via Groq
To ensure enterprise-grade reliability and latency, the entire AI pipeline is wired to **Groq**. By utilizing `llama-3.3-70b-versatile`, the AI synthesizes complex macroeconomic events in milliseconds without hitting extreme rate limits or costing a fortune.
- **Double Fallback Architecture:** Our backend gracefully degrades to cached or deterministic mock algorithms if live inference fails, ensuring 100% uptime for end users.

### 3. Serverless Edge & Persistent DB
- **Framework:** Next.js 14 App Router (React).
- **Backend Persistence:** Supabase PostgreSQL acting as the central nervous system, persisting encrypted JWT-based auth tokens, user portfolios, and saved briefings.
- **Cache Layers:** We implemented `unstable_cache` effectively across external data endpoints to respect rigid Vercel serverless bounds and eliminate unnecessary cross-region hops.

---

## 🚀 Local Development Setup

To run this platform on your local machine, strictly follow the steps below.

### Prerequisites
- Node.js (v18 or higher)
- A highly capable package manager (npm or yarn will do)

### Installation
1. **Clone the Source**
   ```bash
   git clone https://github.com/LakshyaKGupta/Team_Rebel_ET_GEN_AI.git
   cd Team_Rebel_ET_GEN_AI
   ```

2. **Install Packages**
   ```bash
   npm install
   ```

3. **Establish Environment Variables**
   Create a `.env` file at the root. You will need:
   ```env
   # Database keys (Supabase Postgres)
   DATABASE_URL="your-postgres-uri"
   
   # JWT
   JWT_SECRET="generate-a-secure-secret"
   
   # AI 
   GROQ_API_KEY="gsk_your_groq_key_here"
   ```

4. **Spin Up The World**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` to interact with My ET instantly.

---

## 🏛 Technical Architecture

```text
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/              # JWT issuance logic
│   │   │   ├── generate-briefing/ # The Groq multi-perspective generator
│   │   │   └── ai/                # Context-aware chat pipeline
│   │   ├── dashboard/             # The intelligent user hub
│   │   ├── briefing/[id]/         # Dynamic SSR pages rendering AI insights
│   ├── components/                # Modular UI primitives (Tailwind & Framer)
│   ├── context/                   # Global state (User, Notifications, etc.)
│   └── lib/                       # Heavy lifting: Types, Prismas, and DB optimization
```

## 🛡️ Validation & Compilation

We take type safety seriously. The platform is entirely TypeScript enforced.
Before committing, ensure standard checks pass flawlessly:
```bash
npx tsc --noEmit
npm run lint
npm run build
```

## 🤝 Project Constraints & Acknowledgements

*Built passionately by Team Rebel over the course of the ET Gen AI hackathon.* 
We extend our thanks to the Economic Times for inspiring the challenge, Next.js for the robust infrastructure, and Groq for redefining sequence processing speed limits.

**License:** MIT
