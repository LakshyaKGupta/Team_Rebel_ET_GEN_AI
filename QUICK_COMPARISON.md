# Quick Reference: Frontend vs Backend Differences

## 🎯 MOST CRITICAL DIFFERENCES

### 1. AI Integration Status
```
FRONTEND:  Demo Mode ❌ - Returns prompt structures only
BACKEND:   Production Ready ✅ - Calls Google Generative AI
ACTION:    Implement real LLM calls in /api/ai/briefing
```

### 2. News Data Source
```
FRONTEND:  Static mock data (hardcoded topics)
BACKEND:   Live NewsAPI + RSS feeds with auto-ingestion
ACTION:    Integrate ingestion pipeline from backend
```

### 3. User ID Strategy
```
FRONTEND:  UUID (string)
BACKEND:   Integer auto-increment
ACTION:    ⚠️ Breaking change - needs migration strategy
```

### 4. Advanced Features
```
Frontend Missing:
  ❌ Story arc analysis
  ❌ RAG-based Q&A with retrieval
  ❌ Contrarian perspectives
  ❌ Sentiment tracking
  ❌ Named entity recognition

Backend Has All:
  ✅ Everything above
  ✅ Plus ingestion pipeline
  ✅ Smart caching with fingerprints
```

---

## 📊 COMPONENT MATRIX

| Feature | Frontend | Backend | Status |
|---------|----------|---------|--------|
| **Onboarding** | ✅ YES | ✅ YES | ✅ SAME |
| **User Auth** | ✅ JWT | ❓ BASIC | ⚠️ DIFFERENT |
| **Chat** | ✅ GROQ | ✅ GOOGLE AI | ✨ DIFFERENT |
| **Briefing** | 📋 DEMO | 📋 REAL | 🆕 IMPROVED |
| **Story Arcs** | ❌ NO | ✅ YES | 🆕 NEW |
| **Q&A** | ✅ BASIC | ✅ RAG | ✨ IMPROVED |
| **News Feed** | 📦 STATIC | 🔄 LIVE | 🆕 NEW |
| **Ingestion** | ❌ NO | ✅ YES | 🆕 NEW |
| **Saved Items** | ❌ NO | ✅ YES | 🆕 NEW |
| **Caching** | 💾 MEMORY | 💿 SQLITE | ✨ IMPROVED |

---

## 🔌 API ROUTES: WHAT'S NEW IN BACKEND

**Frontend has these:**
- `/api/auth/*` - Login, signup, password change
- `/api/ai/chat` - Groq-powered chat
- `/api/ai/briefing` - Demo mode (returns prompts, not content)

**Backend ADDED these (🆕 NEW):**
- `/news` - Personalized feed with AI scoring
- `/stories` - Story clustering index
- `/story/{id}` - Full story with context
- `/story/{id}/contrarian` - Alternative viewpoints
- `/ask` - Interactive Q&A with RAG + history
- `/summarize` - Smart summarization with cache
- `/saved-items` - Bookmarking system
- `/ingestion/refresh` - Manual news trigger
- `/health` - API status + AI runtime

**Total Backend Routes: 15+**
**Total Frontend Routes: 8**

---

## 🗄️ DATABASE SCHEMA MIGRATION NEEDED

### Simple View:

**FRONTEND:**
```
users (uuid)
└── preferences
```

**BACKEND:**
```
users (integer)
├── preferences
├── saved_stories
├── articles
├── stories
├── story_articles
├── qa_logs         // Q&A history
├── briefing_cache  // Response caching
└── ingestion_log
```

**⚠️ ACTION:** Choose schema or create adapter layer

---

## 🚀 MERGE ROADMAP (Priority Order)

### Phase 1: Critical (Foundation)
- [ ] **Real LLM Integration** - Replace demo with actual API calls
- [ ] **Schema Alignment** - Resolve user ID / field naming
- [ ] **Authentication** - Implement proper auth in backend

### Phase 2: Important (Features)
- [ ] **News Ingestion** - Integrate live news pipeline
- [ ] **Persistent Caching** - Switch from in-memory
- [ ] **Q&A with RAG** - Add retrieval-augmented generation

### Phase 3: Nice-to-Have (Advanced)
- [ ] **Story Arcs** - Timeline + players + contrarian views
- [ ] **Sentiment Analysis** - Trend tracking
- [ ] **Saved Items** - User bookmarking

---

## 💻 ENVIRONMENT VARIABLES NEEDED

### Frontend .env (Current)
```
DATABASE_URL=file:./dev.db
JWT_SECRET=your-key
GROQ_API_KEY=your-key
```

### Backend .env (Needs handling)
```
OPENAI_API_KEY=optional
GOOGLE_API_KEY=required (for Gemini)
NEWSAPI_KEY=required
RSS_FEEDS=optional
INGEST_INTERVAL_MINUTES=30
NEWS_CACHE_TTL_SECONDS=60
```

**⚠️ BREAKING:** Different keys, different infra

---

## 📦 DEPENDENCY DIFFERENCES

### Frontend adds (if merging Backend features):
```json
{
  "google-generativeai": "^latest",
  "scikit-learn": "via python",
  "newsapi": "via python"
}
```

### Frontend removes (if not needed):
- ❌ Could drop `framer-motion` if simplifying UI
- ✅ Keep `groq-sdk` (cheaper for chat, keep as backup)

---

## 🎯 RECOMMENDATION

### SUGGESTED APPROACH:

1. **Copy the Backend personalization logic**
   - AI instruction generation ✅ Works great
   - Story clustering algorithm
   - Ranking/scoring system

2. **Keep Frontend architecture**
   - Next.js monolith is good for single team
   - Simpler deployment & debugging

3. **Hybrid integration:**
   ```
   Frontend                Backend
   ┌─────────────────┬─────────────────────┐
   │ UI + Auth +     │ News Ingestion +    │
   │ Chat (Groq)     │ AI (Google) + RAG   │
   │ User Context    │ Story Analysis      │
   └─────────────────┴─────────────────────┘
        OR migrate to Backend architecture
   ```

### Questions to decide:
- [ ] Keep Groq or switch to Google AI?
- [ ] Keep single app or go microservices?
- [ ] Use UUID or integers for user IDs?
- [ ] Add SQLite caching or keep in-memory?

---

## ✅ CHECKLIST FOR MERGE

- [ ] Backup both repos
- [ ] Create feature branch
- [ ] Migrate schema (plan for UUID→int or vice versa)
- [ ] Port news ingestion pipeline
- [ ] Replace demo AI with real calls
- [ ] Implement RAG for Q&A
- [ ] Add story arc generation
- [ ] Update TypeScript types
- [ ] Test auth flow end-to-end
- [ ] Load test new features
- [ ] Update README with new features
- [ ] Security audit (especially secrets!)

---

## 🔗 Related Files

- [Detailed Comparison](./DETAILED_COMPARISON.md) - Full specs with code examples
- [Frontend AGENTS.md](./AGENTS.md) - Project overview & architecture
- [Backend README](./backend_repo/README.md) - Backend features list
- [Backend API Docs](./backend_repo/docs/) - API specifications

